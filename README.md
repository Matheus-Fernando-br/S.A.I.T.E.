# 🤖 S.A.I.T.E. — Superior Advanced Intelligence Technological Entity

> IA pessoal na nuvem, **sincronizada em todos os seus dispositivos**: conversa, aprende com seus arquivos e
> links, organiza projetos independentes e responde citando as fontes. Celular e computador hoje; apps, `.exe`
> e TV depois — todos usando o mesmo backend e o mesmo banco de dados.

![Tela inicial](docs/screenshots/01-inicio-escuro.png)

## Arquitetura

```
Celular / Computador / (futuro: app, .exe, TV)
        │  HTTPS + login (sessão por dispositivo)
        ▼
Interface Next.js — Vercel (saite-agent.vercel.app)
        │  HTTPS
        ▼
Backend FastAPI — Render (s-a-i-t-e.onrender.com)
        ├──► PostgreSQL — Supabase (conversas, projetos, documentos, índice de busca, memórias)
        └──► Provedor de IA compatível com OpenAI (padrão: Gemini; Groq/OpenRouter/Ollama como opção)
```

Detalhes: [docs/ARQUITETURA.md](docs/ARQUITETURA.md) · Implantação e uso: [docs/INSTALACAO.md](docs/INSTALACAO.md) ·
Segurança: [docs/SEGURANCA.md](docs/SEGURANCA.md).

## O que funciona

| Área | O que faz |
|---|---|
| **Login e sincronização** | Uma senha do dono; cada dispositivo guarda sua sessão; tudo fica no mesmo banco na nuvem |
| **Chat** | Conversas persistentes com histórico como contexto, respostas em *streaming*, botão Parar, fixar/renomear/arquivar/excluir, anexos só daquela conversa |
| **Aprender** | Importa PDF, DOCX, TXT, MD, CSV, XLSX, HTML e links públicos; extrai, divide em trechos, gera embeddings e indexa |
| **Respostas com fontes** | Busca híbrida (palavras + semântica) filtrada por escopo; cita `[n]` com documento e página/seção; avisa quando nenhuma fonte foi usada |
| **Projetos** | Instruções, documentos, memórias e conversas próprios; o contexto de um projeto não vaza para outro |
| **Histórico** | Busca por título e conteúdo; conversas arquivadas |
| **Configurações** | Estado real da IA, modelo, memórias, exportação/importação, sair do dispositivo |

## Para colocar no ar

O banco (Supabase, projeto `saite`) já está criado e o Render já tem as variáveis não secretas. Falta cadastrar no
Render três segredos — `DATABASE_URL`, `SAITE_LLM_API_KEY` e `SAITE_ACCESS_PASSWORD` — e publicar o código na
`main`. Passo a passo: [docs/INSTALACAO.md](docs/INSTALACAO.md).

## Estrutura

```
backend/   API FastAPI (app/), testes com PostgreSQL (tests/), avaliação de RAG (eval/)
frontend/  Interface Next.js 16 + React 19 + Tailwind 4 (src/), testes ponta a ponta (e2e/)
agent/     Agente local do computador (para a futura versão desktop)
docs/      Arquitetura, implantação, segurança, avaliações, capturas e relatório técnico
```

## Qualidade verificada

| Verificação | Resultado |
|---|---|
| Backend (`pytest`, PostgreSQL real) | 88 testes aprovados |
| Agente local (`pytest`) | 17 testes aprovados |
| Interface (lint, tipos, build) | sem erros |
| Ponta a ponta (Playwright + axe, stack igual à produção) | 15/15, incluindo login, sincronização entre dois dispositivos e logout |
| Avaliação de RAG | recuperação 100%, fidelidade 100% (modelos e corpus em `docs/avaliacao`) |

## Limitações atuais

- Planos gratuitos: o Render dorme após 15 min sem uso (primeira abertura ~1 min); o Supabase pausa projetos
  parados por 7 dias; os provedores de IA têm cotas.
- O provedor de IA na nuvem recebe o texto das conversas e trechos de documentos usados nas respostas.
- Acesso ao computador ainda não está disponível na versão na nuvem (virá com o app para Windows).
- Um único dono (senha única); contas separadas por pessoa ficam para quando houver vários usuários.
- Sem OCR para PDFs digitalizados e sem voz.

## Roadmap

App para Windows (`.exe`, Tauri) com o agente local conectado ao backend na nuvem; app mobile; app para TV;
contas multiusuário (Supabase Auth); OCR; voz; índice vetorial dedicado (pgvector) para grandes volumes.
