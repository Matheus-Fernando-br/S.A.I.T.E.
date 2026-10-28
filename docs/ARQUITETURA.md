# Arquitetura do S.A.I.T.E.

Estado em 2026-10-28 (versão 0.2.0 do backend). Estado anterior: `docs/DIAGNOSTICO_INICIAL.md`.

## 1. Visão geral

```
 Navegador (localhost:3000 ou saite-agent.vercel.app)
   │  HTTP/SSE para http://localhost:8000  (token opcional; CORS + Private Network Access)
   ▼
 Backend FastAPI — no computador do usuário (127.0.0.1:8000)
   ├─ Rotas /api ──► Serviços ──► SQLite (fonte da verdade + FTS5 + embeddings)
   │                     │              └─ backend/data/files (originais importados)
   │                     ├─► LLMProvider ──► Ollama :11434  |  llama.cpp/LM Studio (OpenAI-compatível)
   │                     └─► ComputerService ──► Agente local :8765 (token próprio)
   └─ Tarefas assíncronas de ingestão (asyncio) com estado persistido
 Agente local — processo separado (127.0.0.1:8765)
   └─ ferramentas somente leitura, pastas autorizadas, auditoria em ~/.saite-agent
```

| Componente | Onde roda | Responsabilidade |
|---|---|---|
| Interface Next.js (`frontend/`) | navegador; build estático (local ou Vercel) | telas, streaming, estados reais; nenhum segredo |
| Backend FastAPI (`backend/`) | máquina do usuário | API, orquestração do chat, RAG, persistência, validação, limites |
| Runtime de inferência | máquina do usuário | geração e embeddings (Ollama por padrão) |
| Agente local (`agent/`) | máquina do usuário | leituras do sistema/arquivos sob permissão |

A Vercel só entrega arquivos estáticos; ela nunca acessa o computador. Quem fala com `localhost` é o navegador.

## 2. Backend — módulos

| Módulo | Arquivo(s) | Papel |
|---|---|---|
| Configuração | `app/core/config.py`, `app/services/settings.py` | `.env` + preferências persistidas e validadas |
| Segurança | `app/core/security.py`, `app/main.py` | token Bearer opcional, limites de taxa, CORS, PNA, tratamento de erros |
| Banco | `app/db/database.py`, `app/db/migrations/*.sql` | conexão SQLite (WAL, FKs), migrações versionadas, log de atividades |
| Provedores LLM | `app/llm/{base,ollama,openai_compat,registry}.py` | contrato único `LLMProvider`; troca de runtime sem alterar o resto |
| Chat | `app/services/agent.py`, `app/api/routes/chat.py` | prompt, histórico, RAG, ferramentas, SSE, persistência parcial |
| Conhecimento | `app/services/knowledge/*` | extração, chunking, URL segura, ingestão, recuperação híbrida |
| Projetos/conversas/memórias | `app/services/{project,conversation,message,memory}.py` | CRUD com isolamento |
| Computador | `app/services/computer.py` | cliente do agente; esquemas das ferramentas |
| Dados | `app/api/routes/data.py` | exportação/importação, atividade |

## 3. Modelo de dados (SQLite)

| Tabela | Conteúdo | Integridade |
|---|---|---|
| `projects` | nome, descrição, instruções, arquivado | — |
| `conversations` | título, fixada, arquivada, `project_id` | FK → projects (cascade) |
| `messages` | papel, conteúdo, status (`complete/partial/error`), modelo, citações, ferramentas | FK → conversations (cascade) |
| `documents` | escopo (`global/project/conversation`), origem, hash, URL, status, erro, versão, modelo de embeddings | CHECK de consistência do escopo; FKs (cascade) |
| `chunks` | texto, localização (página/seção/linhas), embedding float32 | FK → documents (cascade) |
| `chunks_fts` | índice FTS5 (BM25, sem acentos) | sincronizado por gatilhos |
| `memories` | fato explícito do usuário, global ou de projeto | FK → projects (cascade) |
| `settings` | preferências | — |
| `activity_log` | ações relevantes, sem conteúdo | FK → projects (cascade) |

**Fonte da verdade:** as tabelas relacionais. **Índices derivados:** `chunks_fts` (gatilhos) e os embeddings em
`chunks` — ambos regeneráveis por *Reprocessar/Reindexar*. **Originais:** `data/files/<id>/`, apagados junto com o
documento. Remover um documento apaga trechos, índice e arquivo na mesma operação.

Escolha do SQLite: biblioteca padrão do Python, zero serviços, backup por cópia de arquivo, privacidade por padrão.
Para dezenas de milhares de trechos, a busca vetorial (força bruta com NumPy) pode ser trocada por `sqlite-vec`
ou Qdrant sem mudar a API (`retrieval.py`).

## 4. Pipeline de conhecimento (aba Aprender)

1. **Validação** — extensão permitida, assinatura real (`%PDF`, ZIP), limite de tamanho, proteção contra *zip bomb*, texto sem bytes nulos.
2. **Deduplicação** — SHA-256 por escopo; URLs normalizadas.
3. **Armazenamento do original** — nome higienizado, dentro de `data/files`.
4. **Extração** — PDF (por página), DOCX (títulos e tabelas), XLSX (por planilha), CSV (grupos de linhas com cabeçalho), HTML (sem script/nav/rodapé, por título), MD (por título), TXT.
5. **Normalização** — Unicode NFC, remoção de controles, espaços.
6. **Chunking** — ~1 600 caracteres (~400 tokens) com 200 de sobreposição, respeitando parágrafos e frases; localização preservada.
7. **Embeddings locais** — em lotes; prefixos `search_document:`/`search_query:` quando o modelo os exige. Sem modelo de embeddings, o documento fica **indexado só lexicalmente**, com aviso.
8. **Gravação atômica** — trechos + FTS na mesma transação; versão incrementada no reprocessamento.
9. **Estado** — `pending → processing → ready|error`, consultado pela interface; cancelamento e reprocessamento idempotente; ao reiniciar, processamentos interrompidos viram erro recuperável.

**Links:** mesmo pipeline após o download seguro (seção Segurança). A cópia capturada é guardada; *Atualizar* captura de novo.

## 5. Recuperação e resposta (RAG)

1. Filtro de acesso **no SQL**: `global` + `project` do projeto da conversa + `conversation` da própria conversa.
2. Busca lexical FTS5/BM25 (termos entre aspas — a entrada não vira sintaxe FTS) + busca vetorial por cosseno.
3. Fusão por *Reciprocal Rank Fusion*; corte por similaridade mínima (0,45 para bge-m3) e relativo ao melhor trecho (−0,25).
4. Prompt: persona → regras (fontes são dados não confiáveis; citar com [n]; admitir ausência) → projeto → memórias → fontes delimitadas → lembrete de citação.
5. Pós-processamento: marcadores [n] inexistentes são removidos; cada fonte recebe `cited: true/false`.
6. Interface: fontes citadas/consultadas com documento, local e trecho; aviso determinístico quando nenhuma fonte foi recuperada.

## 6. Chat

- Histórico: últimas N mensagens (padrão 20) limitadas pelo orçamento de contexto; mensagens com erro não voltam ao modelo.
- Streaming SSE (`start`, `notice`, `tool`, `token`, `done`, `error`); o botão Parar aborta a requisição e o backend salva o texto já gerado como `partial`.
- Título sugerido a partir da primeira mensagem; busca por título e conteúdo; fixar, arquivar, excluir.
- Memória: histórico ≠ memórias (fatos explícitos, criados só pelo usuário) ≠ base de conhecimento.

## 7. Agente local e ferramentas

O modelo só recebe definições de ferramentas quando o usuário ativa **Usar computador** e o agente está conectado
e não pausado; apenas as ferramentas ligadas nas permissões são oferecidas. Até 4 rodadas de chamadas; resultados
truncados e tratados como dados. Ferramentas inexistentes ou desligadas são recusadas pelo backend **e** pelo agente.
A interface só pode chamar diretamente `system_info` e `disk_usage` (painel "Meu PC").

## 8. Matriz de requisitos — estado final

Legenda: ✅ implementado e validado por teste · 🟡 parcial · ⛔ depende de recurso externo · 📋 documentado como evolução.

| Requisito | Estado | Evidência | Pendência |
|---|---|---|---|
| Inferência local sem OpenAI/Anthropic | ✅ | `app/llm/*`; nenhuma dependência comercial em `requirements.txt`; chat real com Ollama (`docs/avaliacao`) | — |
| Abstração de provedores | ✅ | `LLMProvider`, `OllamaProvider`, `OpenAICompatibleProvider` | llama.cpp validado só por contrato (não executado neste ambiente) |
| Detecção do runtime e modelos | ✅ | `GET /api/ai/status`; banners na interface; teste `test_ai_status_reports_models` | — |
| Indisponibilidade tratada sem simular | ✅ | `test_model_unavailable_is_reported_not_simulated`; e2e "backend offline" | — |
| Backend instalável | ✅ | `requirements.txt` coerente; suíte roda de instalação limpa | — |
| Persistência de conversas | ✅ | SQLite + migrações; `test_stream_persists_messages_and_uses_history`; e2e recarrega a página | — |
| Histórico como contexto | ✅ | mesmo teste verifica as mensagens enviadas ao modelo | — |
| Renomear/fixar/arquivar/excluir/pesquisar | ✅ | `test_conversation_lifecycle`, `test_search_history_by_title_and_content`; e2e Histórico | — |
| Streaming e cancelamento | ✅ | SSE + AbortController; `test_error_mid_stream_saves_partial_text`; e2e | — |
| Importação de arquivos (PDF, TXT, MD, DOCX, CSV, XLSX, HTML) | ✅ | `test_extract_supported_formats`, `test_upload_index_search_and_delete`; e2e Aprender | OCR (📋) |
| Validação/limites/arquivos inválidos | ✅ | `test_extract_rejects_invalid_files`, `test_zip_bomb_is_rejected`, `test_upload_limits_and_errors` | — |
| Processamento assíncrono com estado, cancelamento e reprocessamento | ✅ | `KnowledgeService.schedule/cancel/reprocess`; testes de reprocessamento | fila persistente entre reinícios (📋) |
| Importação por URL com proteção SSRF | ✅ | `urlfetch.py`; 31 testes em `test_urls.py` | — |
| Recuperação com citações e fidelidade | ✅ | `retrieval.py`; avaliação: recuperação 100%, fidelidade 100%, precisão das citações 100% (qwen2.5:7b) | modelos pequenos citam pouco |
| Admitir ausência de informação | 🟡 | 2 de 3 perguntas sem evidência (7b); interface sinaliza "sem fontes" de forma determinística | depende do modelo |
| Escopos global/projeto/conversa | ✅ | `test_project_context_does_not_leak`, `test_conversation_scoped_document_is_private_to_that_conversation` | — |
| Conteúdo importado tratado como não confiável | ✅ | prompt delimita fontes; ferramentas só com opt-in; `test_disallowed_tool_requests_are_refused` | ver riscos residuais |
| Projetos (CRUD, instruções, arquivamento, exclusão protegida, atividade) | ✅ | `test_project_crud_and_protected_delete`; e2e Projetos | — |
| Memória controlável e transparente | ✅ | `test_memories_crud`; Configurações → Memórias; "Lembrar isto" | — |
| Agente local autenticado, somente leitura, pastas autorizadas | ✅ | `agent/tests` (17), `test_computer_integration.py` (5) com processo real | — |
| Ferramentas sensíveis desligadas por padrão, pausa/revogação, auditoria | ✅ | `test_defaults_are_least_privilege`, `test_disabled_tool_pause_and_revocation`, `test_bad_arguments_and_audit_log` | — |
| Chamada de ferramenta por modelo real | ✅ | qwen2.5:7b chamou `search_files` e respondeu com o caminho correto | modelos ≤1,5b raramente chamam |
| Operações destrutivas no computador | 📋 | deliberadamente não implementadas | exigiriam fluxo de confirmação |
| Autenticação | 🟡 | token Bearer opcional + bind em 127.0.0.1; testes | multiusuário (📋) |
| Configurações e preferências | ✅ | `test_settings_persist_and_validate`; tela Configurações | — |
| Exportação/importação | ✅ | `test_export_import_roundtrip` | — |
| Interface conectada a funções reais, sem dados falsos | ✅ | remoção de `PCStatus`/`Header` e `alert()`; e2e 13/13 | — |
| Modernização visual, responsividade, acessibilidade, movimento reduzido | ✅ | e2e: axe WCAG A/AA sem violações sérias, 390 px sem rolagem horizontal, `prefers-reduced-motion` | — |
| Voz (STT/TTS) | 📋 | botões sem função removidos | escolher motor local (ex.: whisper.cpp, Piper) |
| Google Drive | 📋 | botão sem função removido | exige OAuth de terceiros e decisão do usuário |
| OCR de PDFs digitalizados | 📋 | erro claro orientando o usuário | integrar Tesseract (dependência nativa) |
| Treinamento/fine-tuning | 📋 | fora do escopo (ver relatório) | dados, hardware e objetivo definidos |
