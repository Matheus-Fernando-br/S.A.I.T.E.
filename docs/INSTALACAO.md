# Implantação, configuração e operação

O S.A.I.T.E. roda **na nuvem** para que todos os dispositivos (celular, computador e, no futuro,
apps, `.exe` e TV) usem os mesmos dados:

| Parte | Serviço | Endereço |
|---|---|---|
| Interface (site) | Vercel | https://saite-agent.vercel.app |
| Backend (API) | Render — serviço `S.A.I.T.E.` (pasta `backend`, branch `main`) | https://s-a-i-t-e.onrender.com |
| Banco de dados | Supabase — projeto `saite` (us-west-1, perto do Render em Oregon) | PostgreSQL |
| Modelos de IA | Provedor compatível com a API OpenAI (padrão: Google Gemini) | chamado pelo backend |

Nada roda no seu computador. O navegador fala só com o backend no Render; o backend fala com o banco e
com o provedor de IA. As chaves ficam apenas no Render.

## 1. Banco de dados (Supabase) — já criado

O projeto `saite` foi criado e o esquema já foi aplicado (tabelas, índices, RLS ligado e acesso pela API
pública do Supabase bloqueado). Para conectar o backend, falta apenas a **URL de conexão**:

1. Abra https://supabase.com/dashboard → projeto **saite**.
2. **Project Settings → Database → Reset database password**: gere uma senha e copie-a.
3. Clique em **Connect** (topo da página) → aba **Connection string** → **Session pooler** (funciona por IPv4,
   que é o que o Render usa). Copie a URL e troque `[YOUR-PASSWORD]` pela senha do passo 2.

O formato é:
`postgresql://postgres.rceydzbmdflvewueaqkj:SENHA@aws-?-us-west-1.pooler.supabase.com:5432/postgres`

## 2. Chave do provedor de IA

Padrão recomendado: **Google Gemini** (uma única chave serve para o chat e para os embeddings; plano gratuito).

1. Entre em https://aistudio.google.com/apikey com sua conta Google.
2. **Create API key** → copie a chave.

No plano gratuito do Gemini, o Google pode usar o conteúdo enviado para melhorar os produtos dele. Se preferir
outro provedor, veja a seção 6.

## 3. Variáveis no Render

Render → serviço **S.A.I.T.E.** → **Environment** → *Add Environment Variable*. Cadastre os **segredos**:

| Variável | Valor |
|---|---|
| `DATABASE_URL` | URL do passo 1 |
| `SAITE_LLM_API_KEY` | chave do passo 2 |
| `SAITE_ACCESS_PASSWORD` | a senha que você vai usar para entrar no S.A.I.T.E. (longa; não reutilize outra senha) |

Já configuradas (não secretas): `SAITE_LLM_PROVIDER=openai_compatible`,
`SAITE_LLM_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai`, `SAITE_CHAT_MODEL=gemini-2.5-flash`,
`SAITE_EMBED_MODEL=gemini-embedding-001`, `SAITE_CORS_ORIGINS=https://saite-agent.vercel.app,http://localhost:3000`.

Variáveis antigas (`OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_KEY`, `USER_ID`) não são mais usadas e podem ser apagadas.

Comandos do serviço (já estão assim): *Root Directory* `backend`, *Build* `pip install -r requirements.txt`,
*Start* `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. O Render publica automaticamente a cada commit na `main`.

Ao iniciar, o backend aplica as migrações pendentes sozinho. Confira em https://s-a-i-t-e.onrender.com/health
(deve mostrar `"auth_required": true`).

## 4. Interface (Vercel)

O site publicado usa `https://s-a-i-t-e.onrender.com` automaticamente. Se o projeto na Vercel tiver a variável
`NEXT_PUBLIC_API_URL`, ela deve apontar para esse mesmo endereço. A Vercel publica a cada commit na `main`.

## 5. Uso

1. Abra https://saite-agent.vercel.app no celular ou no computador e entre com `SAITE_ACCESS_PASSWORD`.
2. A sessão dura 90 dias por dispositivo. *Configurações → Conexão → Sair deste dispositivo* encerra a sessão local;
   trocar a senha no Render encerra as sessões de **todos** os dispositivos.
3. No plano gratuito, o Render "dorme" após 15 minutos sem uso: a primeira abertura pode levar até ~1 minuto
   (o site mostra um aviso). O Supabase gratuito pausa projetos após 7 dias sem nenhuma atividade — basta reativar no painel.

## 6. Outros provedores de IA

Qualquer serviço com API compatível com a da OpenAI funciona; troque as variáveis no Render (ou em Configurações → IA):

| Provedor | `SAITE_LLM_BASE_URL` | Modelo de chat | Embeddings |
|---|---|---|---|
| Google Gemini (padrão) | `https://generativelanguage.googleapis.com/v1beta/openai` | `gemini-2.5-flash` | `gemini-embedding-001` (mesma chave) |
| Groq (modelos abertos, não treina com seus dados) | `https://api.groq.com/openai/v1` | `llama-3.3-70b-versatile` | não oferece: use `SAITE_EMBED_BASE_URL`/`SAITE_EMBED_API_KEY` do Gemini |
| OpenRouter | `https://openrouter.ai/api/v1` | ex.: `meta-llama/llama-3.3-70b-instruct` | use outro provedor para embeddings |
| Ollama (desenvolvimento local) | `http://127.0.0.1:11434` com `SAITE_LLM_PROVIDER=ollama` | `qwen2.5:7b` | `bge-m3` |

Ao trocar o **modelo de embeddings**, use *Reindexar* na aba Aprender (os vetores antigos não são compatíveis).

## 7. Desenvolvimento local

Pré-requisitos: Python 3.11+, Node 20+, um PostgreSQL (local ou um projeto Supabase de teste).

```bash
cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements-dev.txt && cp .env.example .env
```

Edite o `.env` (`DATABASE_URL` de um banco de desenvolvimento — nunca o de produção) e rode:

```bash
uvicorn app.main:app --reload --port 8000
```

```bash
cd frontend && npm install && npm run dev
```

Em `http://localhost:3000` a interface usa `http://localhost:8000` automaticamente.

## 8. Testes

Os testes do backend usam um PostgreSQL descartável (o esquema `public` dele é **apagado** a cada teste):

```bash
cd backend && SAITE_TEST_DATABASE_URL=postgresql://postgres@127.0.0.1:5433/postgres python -m pytest
```

```bash
cd agent && python -m pytest
```

```bash
cd frontend && npm run lint && npm run typecheck && npm run build
```

Ponta a ponta (backend configurado como produção em `localhost:8000` com um banco de teste, e `npm run start`):

```bash
cd frontend && SAITE_E2E_PASSWORD=<senha do backend de teste> npm run test:e2e -- --screens ../docs/screenshots
```

Avaliação do RAG com um modelo real (banco descartável):

```bash
cd backend && SAITE_EVAL_DATABASE_URL=postgresql://... python -m eval.rag_eval --chat-model gemini-2.5-flash --embed-model gemini-embedding-001 --base-url https://generativelanguage.googleapis.com/v1beta/openai
```

## 9. Backup e recuperação

- O Supabase gratuito não inclui backups automáticos para restauração. Use *Configurações → Dados → Exportar*
  periodicamente (JSON com projetos, conversas, mensagens, memórias e catálogo de documentos).
- Para um backup completo do banco: `pg_dump "$DATABASE_URL" > saite.sql` (de qualquer computador com PostgreSQL instalado).

## 10. Solução de problemas

| Sintoma | Causa provável | Solução |
|---|---|---|
| "Iniciando o servidor na nuvem…" por ~1 min | Render gratuito acordando | aguarde; é normal após 15 min sem uso |
| "Servidor indisponível" | deploy com erro ou `DATABASE_URL` errada | veja os logs do serviço no Render |
| Senha não aceita | `SAITE_ACCESS_PASSWORD` diferente | confira a variável no Render |
| "Muitas tentativas" | proteção contra força bruta | aguarde 5 minutos |
| "O provedor recusou a chave" | `SAITE_LLM_API_KEY` ausente/errada | gere outra chave e atualize no Render |
| "Limite de uso do provedor" | cota gratuita do provedor esgotada | aguarde ou troque de provedor (seção 6) |
| Documento "Indexado só para busca por palavras" | embeddings falharam | confira o modelo de embeddings e use *Reprocessar* |
| "Nenhum texto encontrado no PDF" | PDF digitalizado (imagem) | OCR ainda não suportado |
| Respostas citam trechos pouco relacionados | limiar de similaridade não calibrado para o modelo | ajuste *Similaridade mínima* (Configurações → IA) usando *Testar recuperação* |
