# S.A.I.T.E. — interface

Next.js 16 (App Router) + React 19 + Tailwind CSS 4 + lucide-react.

| Rota | Tela |
|---|---|
| `/` | Chat (`?c=<conversa>`, `?p=<projeto>` para nova conversa em um projeto) |
| `/aprender` | Base de conhecimento global |
| `/projetos` | Projetos (`?id=<projeto>` abre o detalhe) |
| `/historico` | Histórico e busca |
| `/configuracoes` | Conexão, IA local, agente, memórias e dados |

A interface só conversa com o backend local (`NEXT_PUBLIC_API_URL`, padrão `http://localhost:8000`, ajustável em
Configurações → Conexão). Não há segredos no frontend.

```bash
npm install
npm run dev          # desenvolvimento
npm run lint && npm run typecheck && npm run build
npm run test:e2e -- --screens ../docs/screenshots   # requer backend, Ollama e `npm run start`
```

Estrutura: `src/app` (páginas), `src/components` (telas e `ui/` com botão, diálogo, toast, estados, Markdown),
`src/services/api.ts` (cliente da API e SSE), `src/lib/format.ts`. Tokens de design e animações em
`src/app/globals.css` (respeitam `prefers-reduced-motion`). Recursos de marca otimizados em `public/brand/`.
