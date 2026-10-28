# Instalação, configuração e operação

Este guia leva o S.A.I.T.E. de um clone vazio até o uso diário. Tudo roda **no seu computador**;
nenhuma chave de API comercial é necessária.

## 1. Visão rápida do que será executado

| Processo | Onde roda | Porta (padrão) | Obrigatório |
|---|---|---|---|
| **Ollama** (modelos de IA) | seu computador | 11434 | sim |
| **Backend** FastAPI (chat, RAG, banco SQLite) | seu computador | 8000 | sim |
| **Interface** Next.js | seu computador (`npm run dev`/`start`) **ou** Vercel | 3000 | sim |
| **Agente local** (leitura do computador) | seu computador | 8765 | opcional |

Todos escutam apenas em `127.0.0.1`. A interface publicada na Vercel conversa com o backend
através do **seu navegador** (`http://localhost:8000`), nunca a partir dos servidores da Vercel.

## 2. Pré-requisitos

| Item | Versão testada | Observação |
|---|---|---|
| Python | 3.11+ (testado em 3.13) | backend e agente |
| Node.js | 20+ (testado em 22) | interface |
| Ollama | 0.40+ | https://ollama.com/download (Windows, macOS, Linux) |
| Git | qualquer | |

### Hardware e modelos

| Perfil | Modelo de chat | Download | RAM livre | Latência medida* |
|---|---|---|---|---|
| Recomendado | `qwen2.5:7b` (Apache-2.0) | ~4,7 GB | ~8 GB (ou GPU com 6 GB+ de VRAM) | mediana 12,8 s |
| Leve | `qwen2.5:1.5b` (Apache-2.0) | ~1,0 GB | ~3 GB | mediana 3,0 s |
| Mínimo (testes) | `qwen2.5:0.5b` (Apache-2.0) | ~0,4 GB | ~1,5 GB | mediana 1,3 s — qualidade baixa |

| Embeddings | Download | Licença | Observação |
|---|---|---|---|
| `bge-m3` (padrão) | ~1,2 GB | MIT | multilíngue; separa bem perguntas relevantes/irrelevantes em português |
| `nomic-embed-text` | ~275 MB | Apache-2.0 | mais leve; em português separou mal (ver `docs/avaliacao`) |

\* Medido em CPU de 4 núcleos, sem GPU, 15 GB de RAM, com a avaliação `backend/eval`. Com GPU as respostas são várias vezes mais rápidas.

Evite `qwen2.5:3b`: sua licença (Qwen Research) não permite uso comercial. Alternativas válidas: `llama3.2:3b`
(Llama 3.2 Community License), `gemma2:2b` (Gemma Terms). Confira sempre a licença na página do modelo.

## 3. Modelo local (Ollama)

```bash
ollama pull qwen2.5:7b
```

```bash
ollama pull bge-m3
```

Verifique: `ollama list` deve mostrar os dois. O Ollama inicia sozinho no Windows/macOS; no Linux use
`ollama serve` (ou o serviço do systemd). Ele escuta em `http://127.0.0.1:11434`.

**Alternativa sem Ollama (llama.cpp):** baixe um GGUF e inicie
`llama-server -m modelo.gguf --port 8080 --embeddings`; depois, em Configurações → IA local, escolha
"OpenAI-compatível local" e o endereço `http://127.0.0.1:8080`. LM Studio funciona da mesma forma.

## 4. Backend

```bash
cd backend
python -m venv venv
```

Ative o ambiente — Windows: `venv\Scripts\activate` · macOS/Linux: `source venv/bin/activate` (fish: `source venv/bin/activate.fish`).

```bash
pip install -r requirements.txt
```

```bash
cp .env.example .env
```

(no Windows: `copy .env.example .env`). Ajuste o `.env` se necessário e inicie:

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Na primeira execução o banco `backend/data/saite.db` é criado e as migrações são aplicadas. Documentação
interativa da API: http://127.0.0.1:8000/docs.

### Variáveis de ambiente (`backend/.env`)

| Variável | Padrão | Função |
|---|---|---|
| `SAITE_DATA_DIR` | `./data` | Banco SQLite e arquivos originais importados |
| `SAITE_API_TOKEN` | vazio | Se definido, toda rota `/api` exige `Authorization: Bearer <token>`. **Defina-o se a porta for exposta além de localhost.** |
| `SAITE_CORS_ORIGINS` | `http://localhost:3000,https://saite-agent.vercel.app` | Origens que podem chamar a API pelo navegador |
| `SAITE_LLM_PROVIDER` | `ollama` | `ollama` ou `openai_compatible` |
| `SAITE_LLM_BASE_URL` | `http://127.0.0.1:11434` | Endereço do runtime |
| `SAITE_CHAT_MODEL` | `qwen2.5:7b` | Modelo de chat padrão |
| `SAITE_EMBED_MODEL` | `bge-m3` | Modelo de embeddings padrão |
| `SAITE_LLM_API_KEY` | vazio | Só para servidores locais que exigem chave própria (não é chave da OpenAI) |
| `SAITE_AGENT_URL` | `http://127.0.0.1:8765` | Endereço do agente local |
| `SAITE_AGENT_TOKEN` | vazio | Token do agente (`python -m saite_agent token`) |
| `SAITE_MAX_UPLOAD_MB` | `25` | Limite de upload |
| `SAITE_MAX_URL_MB` | `5` | Limite de download de páginas |

Modelo, endereço do runtime, temperatura, contexto e parâmetros de RAG também podem ser alterados pela
interface (Configurações → IA local); esses valores ficam no banco e têm precedência sobre o `.env`.

## 5. Agente local do computador (opcional)

```bash
cd agent
python -m venv .venv
```

Ative (`.venv\Scripts\activate` no Windows ou `source .venv/bin/activate`) e instale:

```bash
pip install -r requirements.txt
```

Autorize ao menos uma pasta e pegue o token:

```bash
python -m saite_agent roots add "C:\Users\voce\Documents"
```

```bash
python -m saite_agent token
```

Cole o token em `SAITE_AGENT_TOKEN` no `backend/.env`, reinicie o backend e inicie o agente:

```bash
python -m saite_agent serve
```

Permissões detalhadas e ferramentas: `agent/README.md`. Tudo também pode ser gerenciado em Configurações → Agente local.

## 6. Interface

```bash
cd frontend
npm install
```

```bash
npm run dev
```

Abra http://localhost:3000. Para produção local: `npm run build` e `npm run start`.

Se o backend não estiver em `http://localhost:8000`, ajuste em Configurações → Conexão (fica salvo no
navegador) ou defina `NEXT_PUBLIC_API_URL` antes do build.

### Usando a interface publicada (Vercel)

1. Rode Ollama + backend (e, se quiser, o agente) no computador.
2. Garanta que `https://saite-agent.vercel.app` está em `SAITE_CORS_ORIGINS` (já é o padrão).
3. Abra o site. Navegadores Chromium podem pedir permissão de **acesso à rede local** na primeira vez — aceite.
   O backend responde ao *preflight* com `Access-Control-Allow-Private-Network: true`.
4. Recomenda-se definir `SAITE_API_TOKEN` e informá-lo em Configurações → Conexão.

Para publicar uma nova versão da interface, faça o deploy da pasta `frontend/` na Vercel normalmente; não há
variáveis secretas no frontend. O backend **não** deve ser hospedado no Render/Vercel: ele precisa estar na
mesma máquina que o Ollama, os arquivos e o agente.

## 7. Testes

```bash
cd backend && pip install -r requirements-dev.txt && python -m pytest
```

```bash
cd agent && pip install pytest && python -m pytest
```

```bash
cd frontend && npm run lint && npm run typecheck && npm run build
```

Testes de interface (com Ollama, backend, agente e `npm run start` rodando):

```bash
cd frontend && npm run test:e2e -- --screens ../docs/screenshots
```

Avaliação de qualidade do RAG com o modelo real:

```bash
cd backend && python -m eval.rag_eval --chat-model qwen2.5:7b --embed-model bge-m3
```

## 8. Backup e recuperação

- **Tudo o que importa está em `backend/data/`** (`saite.db` + `files/`). Pare o backend e copie a pasta.
  Para restaurar, coloque a cópia no lugar e inicie o backend.
- Exportação lógica: Configurações → Dados → *Exportar* (JSON com projetos, conversas, mensagens, memórias e
  catálogo de documentos). *Importar* adiciona registros ausentes sem sobrescrever os existentes.
- Permissões do agente: `~/.saite-agent/config.json` (contém o token — proteja como senha).
- Após trocar o modelo de embeddings, use *Reindexar* na aba Aprender.

## 9. Solução de problemas

| Sintoma | Causa provável | Solução |
|---|---|---|
| "Backend local indisponível" | backend parado ou endereço errado | inicie o `uvicorn`; confira Configurações → Conexão |
| "Runtime de IA não está respondendo" | Ollama parado | `ollama serve`; confira o endereço em Configurações |
| "Modelo de chat não instalado" | modelo não baixado | `ollama pull <modelo>` ou escolha um instalado |
| Documento "Indexado só para busca por palavras" | modelo de embeddings ausente | `ollama pull bge-m3` e *Reprocessar*/*Reindexar* |
| "Nenhum texto encontrado no PDF" | PDF digitalizado (imagem) | OCR ainda não suportado: exporte com texto |
| Site da Vercel não conecta ao localhost | permissão de rede local negada / CORS | aceite a permissão; inclua a origem em `SAITE_CORS_ORIGINS` |
| 401 nas requisições | `SAITE_API_TOKEN` definido | informe o mesmo token em Configurações → Conexão |
| "Agente local desconectado" | agente parado ou token diferente | `python -m saite_agent serve`; copie o token para o `.env` |
| Respostas lentas | CPU sem GPU / modelo grande | use `qwen2.5:1.5b` ou uma GPU; reduza a janela de contexto |
| Documento preso "Na fila" após reiniciar | processamento interrompido | ao iniciar o backend ele vira "Erro"; use *Reprocessar* |
