# Diagnóstico inicial — S.A.I.T.E.

Data: 2026-10-28 · Base auditada: commit `ec858e81` (branch `claude/new-session-owvmaf`, idêntica a `main`).

Este documento registra o estado **antes** das alterações. O estado final está em
`docs/ARQUITETURA.md` e no relatório `docs/RELATORIO_TECNICO_SAITE.pdf`.

## 1. Estado do repositório

| Item | Situação |
|---|---|
| Branch de trabalho | `claude/new-session-owvmaf` (sem alterações locais, sincronizada com o remoto) |
| Branches remotas | `main`, `claude/new-session-owvmaf` |
| Alterações não commitadas | Nenhuma |
| Segredos no Git | Nenhum `.env` versionado. `.gitignore` cobre `.env*` |
| Artefatos versionados indevidamente | **`frontend/node_modules` (25 349 arquivos) e `frontend/.next` (407 arquivos)** estavam commitados apesar de constarem no `.gitignore`. `.git` com 234 MB |
| PDF de referência | Não está no repositório nem anexado. Usada a síntese do prompt mestre (seção 2.1) |

## 2. Stack encontrada

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 16.3.1 (App Router), React 19.2, TypeScript, Tailwind CSS 4, lucide-react. Uma única página (`src/app/page.tsx`) |
| Backend | Python + FastAPI 0.141, Uvicorn, Pydantic 2 |
| Banco | Supabase (PostgreSQL remoto) via `supabase-py`; tabelas `conversations` e `messages` (esquema **não** versionado no repositório) |
| IA | `AsyncOpenAI` (`app/services/agent.py`) com `OPENAI_API_KEY` obrigatória |
| Implantação | Frontend na Vercel, backend no Render, banco no Supabase |
| Testes | **Nenhum** |

## 3. Verificações executadas (baseline)

| Comando | Resultado |
|---|---|
| `npx tsc --noEmit` (frontend) | OK, sem erros |
| `npm run lint` (frontend) | **1 erro**: `react-hooks/set-state-in-effect` em `ThemeProvider.tsx:27` |
| `npm run build` (frontend) | OK |
| `pip install -r requirements.txt && python -c "import app.main"` | **Falha**: `ModuleNotFoundError: No module named 'openai'` — o pacote usado em `agent.py` não está no `requirements.txt`; o backend não inicia a partir de uma instalação limpa |
| Testes automatizados | Inexistentes |

## 4. Problemas identificados

1. **Dependência obrigatória da API da OpenAI** (`agent.py`), contrariando a diretriz 3.1; o modelo configurado por padrão (`gpt-5.6-luna`) e a chave são requisitos de execução.
2. **Backend não instala/inicia** a partir do `requirements.txt` (falta `openai`).
3. **Sem autenticação**: o `USER_ID` vem de variável de ambiente; qualquer cliente que alcance a API lê/edita/exclui conversas. `PUT /conversations/{id}` recebe título por *query string*.
4. **Sem isolamento por usuário em mensagens**: `GET /conversations/{id}` e `POST /chat` não verificam a quem pertence a conversa.
5. **Chat sem contexto**: cada mensagem é enviada ao modelo isoladamente (o histórico persistido não é usado).
6. **Erros não tratados**: falhas do Supabase/OpenAI resultam em HTTP 500 genérico; `updateConversation`/`deleteConversation` no frontend ignoram `response.ok`.
7. **Interface com dados falsos**: painel "Meu PC" mostra valores fixos ("Intel i7 (24%)", "16 GB (62%)"); `PCStatus.tsx` com percentuais inventados; `Header.tsx` mostra "Online" fixo.
8. **Botões sem ação**: Pesquisar, Projetos, Aprender, Histórico, Configurações, microfone, Voz; "Anexar arquivos", "Adicionar do Drive" e "Mais ferramentas" disparam `alert()`.
9. **Sugestões da tela inicial desabilitadas** quando não há conversa (`disabled={!conversationId}`), embora o envio crie a conversa automaticamente.
10. **Menu "fixos" sem `data-conversation-menu`**: clicar dentro dele fecha o menu antes da ação (bug de interação).
11. **`createConversation` faz duas requisições** (cria e depois lista tudo para achar a conversa).
12. **Artefatos gerados versionados** (`node_modules`, `.next`).
13. **README desatualizado** (diz que a resposta é simulada e que o Supabase não está configurado).
14. **Banco remoto** para dados pessoais: conversas trafegam para Supabase/Render; incompatível com a meta de privacidade/local.
15. Um backend hospedado no Render **não consegue** alcançar Ollama, arquivos ou processos na máquina do usuário.

## 5. Matriz de requisitos (estado inicial)

Legenda de estado: ✅ implementada e validada · 🟡 parcial · 🖼️ só interface · ❌ ausente · ⛔ bloqueada por dependência externa · ❓ depende de decisão do usuário.

| Requisito | Estado atual | Evidência | Pendência | Prioridade | Dependências | Critério de conclusão |
|---|---|---|---|---|---|---|
| Inferência local sem OpenAI | ❌ | `backend/app/services/agent.py` usa `AsyncOpenAI` | Camada de provedores (Ollama / OpenAI-compatível local) | Crítica | Runtime local instalado | Chat responde com Ollama sem nenhuma chave comercial |
| Backend instalável | ❌ | `ModuleNotFoundError: openai` | Corrigir dependências | Crítica | — | `pip install -r requirements.txt` + `uvicorn` iniciam |
| Detecção/estado do runtime | ❌ | — | `/api/ai/status`, lista de modelos, erros claros | Crítica | Provedores | UI mostra conectado/desconectado real |
| Persistência de conversas | 🟡 | `services/conversation.py`, `message.py` (Supabase) | Banco local, esquema versionado, migrações | Crítica | — | Teste de integração cria/lista/continua conversa |
| Histórico como contexto | ❌ | `chat.py` envia só a mensagem atual | Enviar janela de histórico | Alta | Persistência | Teste verifica histórico no prompt |
| Renomear/fixar/excluir conversa | 🟡 | `routes/conversations.py`, `Sidebar.tsx` | Validação, verificação de erro, título no corpo | Média | — | Testes de API e UI |
| Pesquisar/arquivar conversas | 🖼️ ("Pesquisar" sem ação) / ❌ | `Sidebar.tsx` | Endpoint de busca, arquivamento | Média | Persistência | Busca retorna conversas por título/conteúdo |
| Streaming e cancelamento | ❌ | — | SSE + AbortController | Média | Provedores | Resposta aparece incrementalmente e pode ser interrompida |
| Aba Aprender — arquivos | 🖼️ (botão sem ação) | `Sidebar.tsx` | Upload, extração, chunks, índice | Alta | Banco, embeddings | PDF/TXT/MD/DOCX/CSV/XLSX/HTML indexados e listados |
| Aprender por links | ❌ | — | Importação com proteção SSRF | Alta | Ingestão | URL pública indexada; URL interna recusada (teste) |
| RAG com citações | ❌ | — | Recuperação híbrida + citações | Alta | Ingestão | Resposta cita documento/trecho; teste de fidelidade |
| Memória controlável | ❌ | — | Memórias explícitas, listagem/remoção | Média | Banco | Usuário vê e apaga memórias |
| Projetos isolados | 🖼️ (botão sem ação) | `Sidebar.tsx` | CRUD + escopo de conhecimento | Alta | Banco, RAG | Teste: projeto A não recupera documento de B |
| Agente local do computador | 🖼️ (valores fixos) | `Sidebar.tsx` "Meu PC", `PCStatus.tsx` | Serviço local autenticado, permissões | Alta | — | Dados reais; acesso fora de pasta permitida negado (teste) |
| Autenticação/autorização | ❌ | `USER_ID` via env | Token de API, bind em localhost | Crítica | — | Requisição sem token recebe 401 quando configurado |
| Configurações | 🖼️ (botão sem ação) | `Chat.tsx` | Tela de modelo, agente, memórias, dados | Média | Provedores, agente | Alterações persistem |
| Exportação/importação de dados | ❌ | — | Exportar JSON; backup do SQLite | Baixa | Banco | Exportação baixa arquivo válido |
| Voz (STT/TTS) | 🖼️ (botões sem ação) | `ChatInput.tsx` | Fora do escopo desta entrega (sem motor local definido) | Baixa | Decisão do usuário (motor local de voz) | — |
| Integração Google Drive | 🖼️ (`alert`) | `ChatInput.tsx` | Fora do escopo; exige OAuth de terceiros | Baixa | ❓ Decisão do usuário | — |
| Testes automatizados | ❌ | — | pytest + e2e | Crítica | — | Suíte executa e passa |
| Documentação de instalação | 🟡 | `README.md` desatualizado | Atualizar | Alta | — | Instalação reproduzível seguindo docs |
| Treinar/fine-tuning de modelo | ❌ (não requerido) | — | Documentar como evolução futura | Baixa | Dados, hardware | — |

## 6. Decisões tomadas a partir do diagnóstico

- **Backend passa a rodar na máquina do usuário** (junto do Ollama). A interface pode continuar na Vercel e falar com `http://localhost:8000` a partir do navegador.
- **SQLite local** (biblioteca padrão do Python, com FTS5) substitui o Supabase como fonte da verdade: zero serviços extras, privacidade por padrão, backup = copiar um arquivo. O Supabase deixa de ser dependência.
- **Ollama** como runtime padrão; provedor **OpenAI-compatível local** (llama.cpp `llama-server`, LM Studio) como alternativa, ambos atrás de uma interface `LLMProvider`.
- **Agente do computador como processo separado**, com token próprio, somente leitura, lista de pastas permitidas e auditoria.
- Sem filas externas (Redis/Celery): ingestão usa tarefas em segundo plano do FastAPI com estado persistido.
- Voz, Google Drive e fine-tuning ficam documentados como pendências.
