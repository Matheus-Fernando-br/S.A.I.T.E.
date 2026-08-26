# 🤖 SAITE — Superior Advanced Intelligence Technological Entity

> Agente pessoal de Inteligência Artificial multiplataforma, desenvolvido inicialmente para Web e futuramente expandido para Mobile e Desktop.

---

# 🚨 CONTEXTO PARA CONTINUIDADE DO DESENVOLVIMENTO

## IMPORTANTE

Este projeto está sendo desenvolvido de forma incremental.

Ao continuar o desenvolvimento em outra conversa, considere este README como a **fonte principal de contexto técnico do projeto**.

Não recrie o projeto do zero.

Não altere a stack sem necessidade.

Não substitua arquivos que já funcionam sem antes verificar a arquitetura existente.

A prioridade é **continuar exatamente de onde o projeto parou**, evoluindo a arquitetura de forma organizada.

---

# 📌 VISÃO DO PROJETO

O SAITE será um agente pessoal de IA.

A primeira versão está sendo desenvolvida para Web.

Futuramente:

                SAITE
                  │
        ┌─────────┼─────────┐
        │         │         │
       WEB      MOBILE    DESKTOP
        │         │         │
        └─────────┼─────────┘
                  │
               BACKEND
                  │
               AI AGENT
                  │
       ┌──────────┼──────────┐
       │          │          │
      LLM       MEMORY      TOOLS

A ideia não é criar apenas um chatbot.

O SAITE deverá ser um agente capaz de:

- Conversar com o usuário
- Ter personalidade própria
- Ter avatar personalizável
- Utilizar voz
- Pesquisar na Internet
- Analisar currículos
- Analisar arquivos
- Consultar informações do computador
- Ter memória
- Utilizar ferramentas
- Evoluir para automações
- Funcionar em Web, Mobile e Desktop

---

# 🎯 OBJETIVO

Criar um assistente pessoal de IA com arquitetura modular.

Exemplo:

> "Como está meu computador?"

O agente poderá:

Usuário
↓
SAITE
↓
Entende a solicitação
↓
PC Monitor Tool
↓
CPU
RAM
DISCO
PROCESSOS
↓
LLM
↓
Resposta contextualizada

Outro exemplo:

> "Analise meu currículo e diga o que preciso melhorar."

Usuário
↓
Upload do currículo
↓
CV Tool
↓
Extração do conteúdo
↓
Agent
↓
LLM
↓
Análise

---

# 🧠 CONCEITO DO AGENTE

O SAITE deverá utilizar arquitetura:

Agent + LLM + Memory + Tools

O agente será responsável por interpretar a solicitação e decidir quais recursos utilizar.

Arquitetura planejada:

                    USER
                     │
                     ▼
                 FRONTEND
                     │
                     ▼
                  FASTAPI
                     │
                     ▼
                    AGENT
                     │
          ┌──────────┼──────────┐
          │          │          │
          ▼          ▼          ▼
         LLM       MEMORY      TOOLS
                                │
                  ┌─────────────┼─────────────┐
                  │             │             │
                  ▼             ▼             ▼
                 PC           SEARCH          CV
                  │             │             │
                  ▼             ▼             ▼
              Computer       Internet      Documents

---

# 🛠️ STACK DEFINIDA

## Frontend

Next.js
React
TypeScript
Tailwind CSS
Lucide React

## Backend

Python
FastAPI
Pydantic
Uvicorn
python-dotenv

## Banco de dados

PostgreSQL
Supabase

## Mobile

Planejado:

React Native
Expo

## Desktop

Planejado:

Tauri

## IA

A camada de IA deverá ser abstraída.

Possíveis provedores:

OpenAI
Anthropic
Google
Modelos locais

A escolha definitiva do modelo ainda não foi feita.

---

# 📂 ESTRUTURA ATUAL DO PROJETO

Estrutura atual:

SAITE/
│
├── frontend/
│
│ ├── src/
│ │ │
│ │ ├── app/
│ │ │ ├── page.tsx
│ │ │ ├── layout.tsx
│ │ │ └── globals.css
│ │ │
│ │ ├── components/
│ │ │ ├── Sidebar.tsx
│ │ │ ├── Header.tsx
│ │ │ ├── Chat.tsx
│ │ │ ├── ChatInput.tsx
│ │ │ ├── AIAvatar.tsx
│ │ │ └── PCStatus.tsx
│ │ │
│ │ ├── services/
│ │ │ └── api.ts
│ │ │
│ │ └── types/
│ │
│ ├── public/
│ ├── package.json
│ ├── package-lock.json
│ ├── .env.local
│ └── ...
│
├── backend/
│ │
│ ├── app/
│ │ │
│ │ ├── **init**.py
│ │ │
│ │ ├── main.py
│ │ │
│ │ ├── api/
│ │ │ ├── **init**.py
│ │ │ │
│ │ │ └── routes/
│ │ │ ├── **init**.py
│ │ │ └── chat.py
│ │ │
│ │ ├── core/
│ │ │ ├── **init**.py
│ │ │ └── config.py
│ │ │
│ │ ├── schemas/
│ │ │ ├── **init**.py
│ │ │ └── chat.py
│ │ │
│ │ └── services/
│ │ ├── **init**.py
│ │ └── agent.py
│ │
│ ├── requirements.txt
│ ├── .env
│ └── .gitignore
│
└── README.md

---

# 🟢 O QUE JÁ FOI FEITO

## 1. Frontend criado

Foi utilizado:

bash
npx create-next-app@latest frontend

Configurações escolhidas:

TypeScript: SIM

ESLint: SIM

React Compiler: NÃO

Tailwind CSS: SIM

src directory: SIM

App Router: SIM

Import alias: SIM

O projeto foi criado com sucesso.

Versão utilizada durante o desenvolvimento inicial:

Next.js 16.3.1

---

# 2. Lucide React instalado

Foi executado:

bash
npm install lucide-react

A biblioteca será utilizada para ícones da interface.

---

# 3. Frontend funcionando

O frontend já executa:

bash
npm run dev

URL:

http://localhost:3000

---

# 4. Backend criado

Foi criado:

backend/

Com Python + FastAPI.

---

# 5. Ambiente virtual Python

O backend utiliza:

backend/venv/

O venv NÃO deve ser commitado.

Está no .gitignore.

---

# 6. Dependências do backend

Instaladas:

fastapi
uvicorn
python-dotenv

As dependências são registradas em:

backend/requirements.txt

---

# 7. FastAPI funcionando

O backend executa:

bash
uvicorn app.main:app --reload

URL:

http://localhost:8000

---

# 8. Endpoint principal

Foi criado:

http
POST /api/chat

Exemplo:

json
{
"message": "Olá Athena"
}

Resposta atual:

json
{
"response": "Recebi sua mensagem: 'Olá Athena'. Meu sistema de IA ainda está sendo configurado."
}

Essa resposta ainda é simulada.

O próximo objetivo é substituir essa resposta pelo modelo de IA real.

---

# 9. Documentação FastAPI

A documentação automática está disponível em:

http://localhost:8000/docs

---

# 10. Health Check

Existe:

http
GET /

Resposta:

json
{
"message": "AI Agent API",
"status": "online",
"version": "0.1.0"
}

Também existe:

http
GET /health

Resposta:

json
{
"status": "healthy"
}

---

# 🔌 CONEXÃO FRONTEND → BACKEND

Foi criada:

frontend/src/services/api.ts

Conteúdo conceitual:

typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function sendMessage(message: string): Promise<string> {
const response = await fetch(${API_URL}/api/chat, {
method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      message,
    }),

});

if (!response.ok) {
throw new Error(Erro na API: ${response.status});
}

const data = await response.json();

return data.response;
}

---

# 🌐 ENV FRONTEND

Arquivo:

frontend/.env.local

Conteúdo atual:

env
NEXT_PUBLIC_API_URL=http://localhost:8000

---

# 🐍 ENV BACKEND

Arquivo:

backend/.env

Atualmente:

env
APP_ENV=development

Futuramente poderá conter:

env
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_KEY=

Nunca colocar chaves secretas no Git.

---

# 🧩 BACKEND ATUAL

## app/main.py

Responsável por:

- Criar aplicação FastAPI
- Configurar CORS
- Registrar rotas
- Health check

Arquitetura:

main.py
│
▼
chat router

---

# 📡 app/api/routes/chat.py

Responsável pela rota:

http
POST /api/chat

Ela recebe:

json
{
"message": "..."
}

e chama:

python
agent_service.process_message(...)

---

# 📋 app/schemas/chat.py

Define os modelos:

python
ChatRequest
ChatResponse

Request:

python
class ChatRequest(BaseModel):
message: str

Response:

python
class ChatResponse(BaseModel):
response: str

---

# 🧠 app/services/agent.py

Atualmente existe:

python
class AgentService:

Com:

python
async def process_message(
self,
message: str
) -> str:

Neste momento ele apenas retorna uma resposta simulada.

---

# 🚧 PRÓXIMO PASSO PRINCIPAL

O próximo passo do projeto é:

# INTEGRAR O PRIMEIRO MODELO DE IA

A arquitetura NÃO deve colocar a API da IA diretamente em:

chat.py

Não fazer:

chat.py
↓
OpenAI

O correto será:

chat.py
↓
AgentService
↓
LLMService
↓
LLM

Estrutura planejada:

backend/app/

├── services/
│ ├── agent.py
│ ├── llm.py
│ └── memory.py
│
└── tools/

---

# 🧠 ARQUITETURA FUTURA DO AGENT

O objetivo:

AgentService
│
├── recebe mensagem
│
├── analisa contexto
│
├── recupera memória
│
├── decide se precisa de ferramenta
│
├── executa ferramenta
│
├── envia contexto para LLM
│
└── retorna resposta

---

# 🔧 TOOLS FUTURAS

## PC Monitor

tools/
└── pc/
├── cpu.py
├── memory.py
├── disk.py
├── processes.py
└── system.py

Funções planejadas:

CPU
RAM
DISCO
PROCESSOS
SISTEMA OPERACIONAL
GPU
BATERIA
REDE
TEMPERATURA

---

# 🔎 Web Search

tools/
└── search/
└── web.py

Permitir:

Pesquisa
Notícias
Documentação
Sites
Informações atuais

---

# 📄 CV Tool

tools/
└── cv/
├── parser.py
└── analyzer.py

Possíveis funcionalidades:

PDF
DOCX
Extração de texto
Análise
Skills
Experiência
Formação
ATS
Compatibilidade com vaga
Sugestões

---

# 📁 File Tool

Futuramente:

tools/
└── files/
└── manager.py

Permitirá ao agente trabalhar com arquivos autorizados.

---

# 🎙️ VOICE TOOL

Futuramente:

Speech-to-Text
Text-to-Speech

Fluxo:

Microfone
↓
Speech-to-Text
↓
SAITE
↓
Agent
↓
LLM
↓
Text-to-Speech
↓
Áudio

---

# 💾 BANCO DE DADOS

Foi decidido utilizar:

Supabase

com:

PostgreSQL

Motivos:

- PostgreSQL
- Autenticação
- Storage
- APIs
- Facilidade de integração
- Escalabilidade
- Bom suporte para aplicações Web/Mobile

---

# 🗃️ BANCO FUTURO

Tabelas planejadas:

users
ai_profiles
conversations
messages
memories
documents
cv_analyses
settings

---

# 🤖 PERFIS DE IA

O usuário deverá conseguir criar agentes personalizados.

Exemplo:

Nome:
Athena

Avatar:
Personalizado

Personalidade:
Objetiva, inteligente e organizada

Voz:
Personalizável

System Prompt:
Personalizável

Ferramentas:
✓ Pesquisa
✓ PC
✓ Currículo
✓ Arquivos

Futuramente:

Athena
Jarvis
Dev Assistant
Study Assistant
Personal Assistant

---

# 💻 DESKTOP

Para desktop, a ideia é utilizar:

Tauri

A aplicação Desktop terá um agente local.

Isso permitirá acessar recursos que o navegador não consegue acessar diretamente.

Arquitetura:

Tauri
│
├── Interface
│
└── Local Agent
│
├── CPU
├── RAM
├── Disk
├── Processes
└── OS

---

# 📱 MOBILE

Planejado:

React Native
Expo

A aplicação mobile utilizará o mesmo backend.

React Native
│
▼
FastAPI
│
▼
SAITE Agent

---

# 🌐 WEB

Frontend atual:

Next.js

URL de desenvolvimento:

http://localhost:3000

---

# 🔐 SEGURANÇA

O projeto deverá implementar:

- Autenticação
- Autorização
- CORS
- Rate limiting
- Validação de entrada
- Proteção de API Keys
- Controle de ferramentas
- Permissões do agente
- Segurança de arquivos
- Segurança do agente local

Principalmente no Desktop:

> O agente nunca deverá possuir acesso irrestrito ao sistema operacional.

Ferramentas sensíveis deverão utilizar permissões.

---

# 🔄 EXECUTAR O PROJETO

## FRONTEND

Terminal 1:

bash
cd SAITE/frontend

npm install

npm run dev

Abrir:

http://localhost:3000

---

# BACKEND

Terminal 2:

bash
cd SAITE/backend

python3 -m venv venv

source venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload

Backend:

http://localhost:8000

Docs:

http://localhost:8000/docs

---

# 🪟 WINDOWS

Backend:

powershell
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload

Frontend:

powershell
cd frontend

npm install

npm run dev

---

# 🔄 DESENVOLVIMENTO EM OUTRO COMPUTADOR

O projeto deverá ser versionado utilizando Git.

Após clonar:

bash
git clone <REPOSITORY>
cd SAITE

Frontend:

bash
cd frontend
npm install

Backend:

bash
cd ../backend

python3 -m venv venv

source venv/bin/activate

pip install -r requirements.txt

Arquivos .env devem ser configurados separadamente em cada máquina.

---

# 🚫 NÃO VERSIONAR

Nunca enviar para o Git:

node_modules/
venv/
.env
.env.local
**pycache**/

---

# 🗺️ ROADMAP

## FASE 1 — Fundação

- [x] Criar Next.js
- [x] Configurar TypeScript
- [x] Configurar Tailwind
- [x] Criar interface
- [x] Criar chat
- [x] Criar avatar
- [x] Criar botão de microfone
- [x] Criar painel de PC
- [x] Criar FastAPI
- [x] Criar endpoint /api/chat
- [x] Criar AgentService
- [x] Conectar frontend ao backend

---

# FASE 2 — IA

- [ ] Criar LLMService
- [ ] Integrar modelo de IA
- [ ] Criar system prompt
- [ ] Criar contexto
- [ ] Streaming
- [ ] Tratamento de erros
- [ ] Limites de tokens
- [ ] Controle de custos

---

# FASE 3 — MEMÓRIA

- [ ] Criar Supabase
- [ ] Criar autenticação
- [ ] Criar usuários
- [ ] Criar conversas
- [ ] Criar mensagens
- [ ] Criar memória
- [ ] Criar perfis de IA

---

# FASE 4 — TOOLS

- [ ] PC Monitor
- [ ] Web Search
- [ ] CV
- [ ] Files
- [ ] Voice
- [ ] Tool Registry
- [ ] Sistema de permissões

---

# FASE 5 — CURRÍCULO

- [ ] Upload PDF
- [ ] Upload DOCX
- [ ] Parser
- [ ] Análise
- [ ] ATS
- [ ] Comparação com vaga
- [ ] Recomendações

---

# FASE 6 — VOZ

- [ ] Speech-to-Text
- [ ] Text-to-Speech
- [ ] Streaming de áudio
- [ ] Seleção de voz
- [ ] Conversação por voz

---

# FASE 7 — DESKTOP

- [ ] Tauri
- [ ] Agente local
- [ ] CPU
- [ ] RAM
- [ ] Disco
- [ ] Processos
- [ ] GPU
- [ ] Bateria
- [ ] Rede
- [ ] Permissões

---

# FASE 8 — MOBILE

- [ ] React Native
- [ ] Expo
- [ ] Login
- [ ] Chat
- [ ] Memória
- [ ] Voz
- [ ] Histórico
- [ ] Android
- [ ] iOS

---

# 📊 STATUS ATUAL

Projeto: SAITE

Versão: 0.1.0

Frontend:
🟢 Next.js
🟢 React
🟢 TypeScript
🟢 Tailwind
🟢 Lucide
🟢 Interface inicial
🟢 Chat
🟢 Comunicação com API

Backend:
🟢 Python
🟢 FastAPI
🟢 Uvicorn
🟢 CORS
🟢 API /chat
🟢 AgentService
🟢 Schemas

IA:
🔴 Modelo ainda não integrado

Banco:
🔴 Supabase ainda não configurado

Memória:
🔴 Ainda não implementada

Tools:
🔴 Ainda não implementadas

Voz:
🔴 Ainda não implementada

Desktop:
🔴 Ainda não implementado

Mobile:
🔴 Ainda não implementado

---

# 📍 PONTO EXATO ONDE O DESENVOLVIMENTO PAROU

O projeto atualmente possui:

Frontend Next.js
│
│ POST /api/chat
▼
Backend FastAPI
│
▼
AgentService
│
▼
Resposta simulada

O próximo passo é:

Frontend
│
▼
FastAPI
│
▼
AgentService
│
▼
LLMService ← PRÓXIMO PASSO
│
▼
Modelo de IA

Depois:

Agent
│
├── LLM
├── Memory
└── Tools

---

# ⚠️ REGRAS PARA CONTINUAR O PROJETO

Ao continuar o desenvolvimento:

1. Não recriar o projeto.
2. Não trocar Next.js sem necessidade.
3. Não trocar FastAPI sem necessidade.
4. Manter TypeScript no frontend.
5. Manter Python no backend.
6. Manter separação entre Routes, Schemas e Services.
7. Não colocar lógica de IA diretamente nas rotas.
8. Não colocar API Keys no frontend.
9. Não colocar API Keys no Git.
10. Manter o AgentService separado do LLM.
11. Criar Tools como módulos independentes.
12. Priorizar código organizado e escalável.
13. Reutilizar lógica entre Web, Mobile e Desktop sempre que possível.
14. Evitar arquivos gigantes.
15. Antes de criar uma nova funcionalidade, verificar se ela pertence ao frontend, backend, service, tool ou database.

---

# 🧭 PRINCÍPIO ARQUITETURAL

O SAITE deverá evoluir nesta direção:

                   SAITE
                     │
                  CLIENTS
                     │
        ┌────────────┼────────────┐
        │            │            │
       WEB         MOBILE       DESKTOP
        │            │            │
        └────────────┼────────────┘
                     │
                    API
                     │
                  FASTAPI
                     │
                   AGENT
                     │
       ┌─────────────┼─────────────┐
       │             │             │
      LLM          MEMORY         TOOLS
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
             PC                   WEB                   CV
              │                    │                    │
           SYSTEM              SEARCH              DOCUMENTS

---

# 🚀 VISÃO DE LONGO PRAZO

O SAITE deverá deixar de ser apenas uma interface de chat e se tornar um **agente pessoal multiplataforma**.

A visão final é:

                        🤖 SAITE
                           │
             ┌─────────────┼─────────────┐
             │             │             │
            WEB          MOBILE       DESKTOP
             │             │             │
             └─────────────┼─────────────┘
                           │
                         AGENT
                           │
             ┌─────────────┼─────────────┐
             │             │             │
            LLM          MEMORY         TOOLS
                                         │
                    ┌────────┬───────────┼─────────┐
                    │        │           │         │
                   PC      SEARCH       CV       FILES
                    │        │           │         │
                    └────────┴───────────┴─────────┘

O objetivo final é criar uma plataforma onde o usuário possa conversar naturalmente com o SAITE e permitir que ele utilize ferramentas autorizadas para compreender, pesquisar, analisar e auxiliar em diferentes tarefas.

---

# 👨‍💻 STATUS

**SAITE — MVP em desenvolvimento**

Versão:

0.1.0

Próxima entrega:

Integração do LLM

Depois:

Memória + Supabase + Tools

---

# 🤖 SAITE

### Smart AI Technology & Intelligent Environment

> Um agente pessoal de IA desenvolvido para começar na Web e evoluir para um ecossistema multiplataforma.

### Para continuar na nova conversa

Quando abrir a nova conversa, eu recomendo **anexar/colar este README e mandar uma mensagem curta assim**:

> **"Este é o README/contexto completo do meu projeto SAITE. Quero continuar exatamente do ponto em que paramos. Leia toda a arquitetura, o que já foi implementado e o roadmap. Não recrie nada que já existe. O próximo passo é integrar o LLM ao AgentService criando uma arquitetura Agent → LLMService, mantendo o projeto organizado e escalável. Primeiro analise o contexto e depois me conduza passo a passo, fornecendo os códigos completos dos arquivos que precisarem ser criados ou alterados."**

Isso deixa bem explícito para a próxima conversa **onde estamos e qual é o próximo passo**, sem precisar reconstruir todo o histórico.
