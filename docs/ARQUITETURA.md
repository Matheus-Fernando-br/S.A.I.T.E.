# Arquitetura do S.A.I.T.E.

Estado em 2026-10-29 (backend 0.3.0, versão na nuvem). Estado anterior: `docs/DIAGNOSTICO_INICIAL.md`.

## 1. Visão geral

```
 Dispositivos (celular, computador; futuros app/.exe/TV)
   │  HTTPS — login com a senha do dono; sessão assinada por dispositivo
   ▼
 Interface Next.js — Vercel (saite-agent.vercel.app)      ← só arquivos estáticos
   │  HTTPS + SSE (Authorization: Bearer <sessão>)
   ▼
 Backend FastAPI — Render (s-a-i-t-e.onrender.com)
   ├─ Rotas /api ──► Serviços ──► PostgreSQL (Supabase, projeto "saite")
   │                     │            tabelas + tsvector + embeddings (bytea) + arquivos originais
   │                     └─► LLMProvider ──► provedor compatível com OpenAI (padrão Gemini) | Ollama
   └─ Tarefas assíncronas de ingestão (asyncio) com estado persistido no banco
 Agente local (agent/) — reservado para a versão desktop; inacessível a partir do Render
```

| Componente | Onde roda | Responsabilidade |
|---|---|---|
| Interface (`frontend/`) | navegador (servida pela Vercel) | telas, login, streaming, estados reais; nenhum segredo |
| Backend (`backend/`) | Render (free, Oregon) | API, autenticação, orquestração do chat, RAG, validação, limites |
| Banco | Supabase PostgreSQL 17 (us-west-1) | fonte da verdade única para todos os dispositivos |
| IA | provedor externo compatível com OpenAI | geração e embeddings |

**Por que assim:** o dono quer os mesmos dados em qualquer dispositivo e expandir para app, `.exe` e TV. Um único
backend com banco central atende todos os clientes pela mesma API; os futuros clientes só precisam implementar o
login e as rotas `/api`. O Render gratuito (512 MB, sem GPU) não comporta um modelo de linguagem, por isso a
inferência usa um provedor externo, atrás da mesma interface `LLMProvider` (trocável por configuração; Ollama
continua suportado para desenvolvimento ou para a futura versão desktop).

## 2. Backend — módulos

| Módulo | Arquivo(s) | Papel |
|---|---|---|
| Configuração | `app/core/config.py`, `app/services/settings.py` | variáveis de ambiente + preferências persistidas e validadas |
| Segurança | `app/core/security.py`, `app/api/routes/auth.py`, `app/main.py` | senha do dono, sessões HMAC, limites de taxa, CORS, erros |
| Banco | `app/db/database.py`, `app/db/migrations/*.sql` | pool psycopg, marcadores `?`, migrações versionadas com trava, log de atividades |
| Provedores LLM | `app/llm/{base,ollama,openai_compat,registry}.py` | contrato `LLMProvider`; chat e embeddings configuráveis separadamente |
| Chat | `app/services/agent.py`, `app/api/routes/chat.py` | prompt, histórico, RAG, ferramentas, SSE, persistência parcial |
| Conhecimento | `app/services/knowledge/*` | extração, chunking, URL segura, ingestão, recuperação híbrida |
| Projetos/conversas/memórias | `app/services/{project,conversation,message,memory}.py` | CRUD com isolamento |
| Computador | `app/services/computer.py` | cliente do agente local (desativado sem `SAITE_AGENT_URL`) |
| Dados | `app/api/routes/data.py` | exportação/importação, atividade |

## 3. Modelo de dados (PostgreSQL)

| Tabela | Conteúdo | Integridade |
|---|---|---|
| `projects` | nome, descrição, instruções, arquivado | — |
| `conversations` | título, fixada, arquivada, `project_id` | FK → projects (cascade) |
| `messages` | `seq` (ordem), papel, conteúdo, status, modelo, citações, ferramentas | FK → conversations (cascade) |
| `documents` | escopo, origem, hash, URL, status, erro, versão, modelo de embeddings | CHECK de consistência do escopo; FKs (cascade) |
| `document_blobs` | bytes do arquivo original ou da página capturada | FK → documents (cascade) |
| `chunks` | texto, localização, embedding float32 (bytea), `tsv` gerado (`portuguese`) com índice GIN | FK → documents (cascade) |
| `memories` | fato explícito do usuário, global ou de projeto | FK → projects (cascade) |
| `settings` | preferências | — |
| `activity_log` | ações relevantes, sem conteúdo | FK → projects (cascade) |
| `schema_migrations` | migrações aplicadas | — |

Todas com RLS ligado e sem privilégios para `anon`/`authenticated` (migração 002): o banco só é acessível pelo
backend, nunca pela API REST pública do Supabase. Os originais ficam no banco porque o disco do Render gratuito é
apagado a cada deploy. Para volumes grandes, os embeddings podem migrar para `pgvector` sem mudar a API.

## 4. Pipeline de conhecimento (aba Aprender)

1. **Validação** — extensão permitida, assinatura real (`%PDF`, ZIP), limite de tamanho, proteção contra *zip bomb*, texto sem bytes nulos.
2. **Deduplicação** — SHA-256 por escopo; URLs normalizadas.
3. **Armazenamento do original** — nome higienizado, dentro de `data/files`.
4. **Extração** — PDF (por página), DOCX (títulos e tabelas), XLSX (por planilha), CSV (grupos de linhas com cabeçalho), HTML (sem script/nav/rodapé, por título), MD (por título), TXT.
5. **Normalização** — Unicode NFC, remoção de controles, espaços.
6. **Chunking** — ~1 600 caracteres (~400 tokens) com 200 de sobreposição, respeitando parágrafos e frases; localização preservada.
7. **Embeddings** — no provedor configurado, em lotes; prefixos `search_document:`/`search_query:` quando o modelo os exige. Sem modelo de embeddings, o documento fica **indexado só lexicalmente**, com aviso.
8. **Gravação atômica** — trechos + FTS na mesma transação; versão incrementada no reprocessamento.
9. **Estado** — `pending → processing → ready|error`, consultado pela interface; cancelamento e reprocessamento idempotente; ao reiniciar, processamentos interrompidos viram erro recuperável.

**Links:** mesmo pipeline após o download seguro (seção Segurança). A cópia capturada é guardada; *Atualizar* captura de novo.

## 5. Recuperação e resposta (RAG)

1. Filtro de acesso **no SQL**: `global` + `project` do projeto da conversa + `conversation` da própria conversa.
2. Busca lexical `tsvector` em português com `ts_rank_cd` (só palavras `\w+` unidas por `|` — a entrada não vira sintaxe de consulta) + busca vetorial por cosseno.
3. Fusão por *Reciprocal Rank Fusion*; corte por similaridade mínima (0,45, calibrado para bge-m3 — recalibrar para outros modelos com `backend/eval`) e relativo ao melhor trecho (−0,25).
4. Prompt: persona → regras (fontes são dados não confiáveis; citar com [n]; admitir ausência) → projeto → memórias → fontes delimitadas → lembrete de citação.
5. Pós-processamento: marcadores [n] inexistentes são removidos; cada fonte recebe `cited: true/false`.
6. Interface: fontes citadas/consultadas com documento, local e trecho; aviso determinístico quando nenhuma fonte foi recuperada.

## 6. Chat

- Histórico: últimas N mensagens (padrão 20) limitadas pelo orçamento de contexto; mensagens com erro não voltam ao modelo.
- Streaming SSE (`start`, `notice`, `tool`, `token`, `done`, `error`); o botão Parar aborta a requisição e o backend salva o texto já gerado como `partial`.
- Título sugerido a partir da primeira mensagem; busca por título e conteúdo; fixar, arquivar, excluir.
- Memória: histórico ≠ memórias (fatos explícitos, criados só pelo usuário) ≠ base de conhecimento.

## 7. Agente local e ferramentas

Na versão na nuvem o agente não é alcançável (o Render não enxerga o computador do usuário): a interface informa
isso e a opção "Usar computador" fica desativada. O desenho previsto para o `.exe` é o agente abrir uma conexão de
saída autenticada com o backend. Quando o backend roda na mesma máquina (desenvolvimento), vale o fluxo abaixo.
O modelo só recebe definições de ferramentas quando o usuário ativa **Usar computador** e o agente está conectado
e não pausado; apenas as ferramentas ligadas nas permissões são oferecidas. Até 4 rodadas de chamadas; resultados
truncados e tratados como dados. Ferramentas inexistentes ou desligadas são recusadas pelo backend **e** pelo agente.
A interface só pode chamar diretamente `system_info` e `disk_usage` (painel "Meu PC").

## 8. Matriz de requisitos — estado final

Legenda: ✅ implementado e validado por teste · 🟡 parcial · ⛔ depende de configuração/recurso externo · 📋 documentado como evolução.

| Requisito | Estado | Evidência | Pendência |
|---|---|---|---|
| Dados sincronizados entre dispositivos | ✅ | banco central PostgreSQL; e2e "Sincronização: outro dispositivo vê a mesma conversa" | — |
| Backend no Render | ⛔ | serviço configurado; variáveis não secretas cadastradas | segredos (`DATABASE_URL`, chave de IA, senha) e código na `main` |
| Banco na nuvem | ✅ | Supabase `saite`, esquema aplicado, RLS + revogação verificados | — |
| Login/proteção da API pública | ✅ | `test_login_protects_every_route`, `test_login_is_rate_limited`; e2e login/logout | multiusuário (📋) |
| IA sem dependência da OpenAI | ✅ | provedor compatível (Gemini/Groq/OpenRouter/Ollama); nenhum SDK de fornecedor | — |
| Abstração de provedores | ✅ | `LLMProvider`; chat e embeddings separados; testes de URL base | validação com chave Gemini real pendente da chave |
| Estado do provedor e erros claros | ✅ | `/api/ai/status`, erros 401/429/404 com dica; banners | — |
| Persistência de conversas e histórico como contexto | ✅ | `test_stream_persists_messages_and_uses_history` (PostgreSQL) | — |
| Renomear/fixar/arquivar/excluir/pesquisar | ✅ | testes + e2e Histórico | — |
| Streaming e cancelamento | ✅ | SSE + AbortController; teste de erro no meio do stream | — |
| Importação de arquivos (7 formatos) e validação | ✅ | `test_extract_*`, `test_upload_*`; e2e Aprender | OCR (📋) |
| Importação por URL com proteção SSRF | ✅ | 31 testes em `test_urls.py` | — |
| Recuperação híbrida com citações | ✅ | avaliação em PostgreSQL: recuperação 100%, fidelidade 100% | calibrar limiar para gemini-embedding-001 |
| Escopos global/projeto/conversa isolados | ✅ | `test_project_context_does_not_leak` e afins | — |
| Projetos, memórias, exportação/importação | ✅ | testes + e2e | — |
| Agente local do computador | 🟡 | código e 17+5 testes; indisponível na nuvem (informado na interface) | conector de saída para o `.exe` (📋) |
| Interface conectada, responsiva e acessível | ✅ | e2e 15/15 com axe WCAG A/AA, 390 px, movimento reduzido | — |
| Voz, Google Drive, OCR | 📋 | botões sem função removidos | — |
