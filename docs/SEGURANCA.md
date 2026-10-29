# Segurança e privacidade

## Modelo de ameaça (versão na nuvem)

Um dono, vários dispositivos; backend público na internet (Render), banco gerenciado (Supabase), IA em provedor
externo. Ameaças consideradas:

1. Qualquer pessoa na internet chamando a API do backend.
2. Acesso direto ao banco pela API REST pública que o Supabase cria automaticamente.
3. Força bruta da senha; roubo de uma sessão em um dispositivo.
4. Conteúdo malicioso em documentos ou páginas (prompt injection, arquivos malformados).
5. URLs apontando para serviços internos da nuvem (SSRF).
6. Vazamento de segredos (chaves, URL do banco) no código, logs ou navegador.

## Controles implementados

| Área | Controle | Onde |
|---|---|---|
| Autenticação | todas as rotas `/api` exigem sessão; login com `SAITE_ACCESS_PASSWORD` (comparação em tempo constante) → sessão HMAC-SHA256 com validade de 90 dias; a chave deriva da senha + URL do banco, então trocar a senha revoga todas as sessões | `app/core/security.py`, `tests/test_security_settings.py` |
| Força bruta | login limitado a 8 tentativas/5 min por IP (usa `X-Forwarded-For` do Render) | `login_limiter`, `test_login_is_rate_limited` |
| Banco | sem acesso pela API pública do Supabase: RLS ligado em todas as tabelas e privilégios de `anon`/`authenticated` revogados (verificado no projeto real); só o backend conecta, pela URL secreta | `migrations/002_lock_down_public_api.sql` |
| Segredos | `DATABASE_URL`, chave de IA e senha só nas variáveis do Render; nunca no frontend, no Git ou em respostas da API | `.env.example`, `settings.py` |
| Navegador | CORS restrito às origens configuradas (site da Vercel e localhost), sem cookies | `app/main.py` |
| Limites | taxa no chat (30/min) e na ingestão (60/min); tamanho de upload (15 MB) e de URL; tamanho de mensagem e campos | `security.py`, schemas Pydantic |
| Agente local | token próprio, somente leitura, pastas autorizadas; desativado na nuvem (o servidor não alcança o computador) | `agent/`, `app/services/computer.py` |
| Uploads | extensão + assinatura real, *zip bomb*, binário disfarçado, nome higienizado, gravação só em `data/files` | `knowledge/extract.py`, `service.py` |
| SSRF | só http/https em portas web, sem credenciais na URL, todos os IPs resolvidos precisam ser públicos, conexão fixada no IP validado (anti-*rebinding*), redirecionamentos revalidados, limites de tempo/tamanho/tipo | `knowledge/urlfetch.py`, `tests/test_urls.py` |
| SQL | consultas parametrizadas; busca LIKE com curingas escapados; termos FTS entre aspas | serviços, `test_fts_query_syntax_is_neutralized` |
| Isolamento | filtro de escopo aplicado na consulta SQL antes do modelo; memórias e instruções por projeto | `retrieval.py`, `test_project_context_does_not_leak` |
| SSRF na nuvem | além das regras abaixo, bloqueia endereços de metadados da nuvem (169.254.169.254) e redes privadas do provedor | `urlfetch.py` |
| Prompt injection | fontes e resultados de ferramentas delimitados e declarados não confiáveis; ferramentas só com opt-in do usuário por mensagem; somente leitura; lista fechada | `services/agent.py` |
| Acesso a arquivos | caminho resolvido (segue links) precisa estar numa pasta autorizada; nunca a raiz do disco; credenciais/perfis de navegador sempre negados; sem pastas ocultas na busca; leitura de texto limitada a 200 KB e desligada por padrão | `agent/saite_agent/tools.py` |
| Processos | lista desligada por padrão; sem linha de comando nem usuário (podem conter segredos) | idem |
| Revogação | pausa imediata; remover pasta/ferramenta vale na próxima chamada | `/permissions` |
| Auditoria | agente: `audit.jsonl` com ferramenta, argumentos curtos, sucesso, duração — sem conteúdo lido; backend: `activity_log` sem conteúdo | — |
| Logs | não registram mensagens nem trechos de documentos | — |
| Segredos | nenhum segredo no frontend nem no Git; `.env.example` sem valores; segredos do backend nunca retornam pela API | `settings.py` |
| Interface | Markdown renderizado como elementos React (sem HTML bruto); links externos com `rel="noopener noreferrer nofollow"` | `ui/Markdown.tsx`, `ChatMessage.tsx` |
| Exclusão | documentos: trechos, índice e original; projeto: exige digitar o nome e remove tudo em cascata | `project.py` |
| Dependências | `npm audit`: 0 (após atualizar Next.js 16.3.1 → 16.4.3, que tinha avisos críticos de RCE/SSRF); `pip-audit`: 0 no backend e no agente | — |

## Riscos residuais e recomendações

- **Privacidade do provedor de IA**: o texto das mensagens e os trechos de documentos usados na resposta são enviados
  ao provedor. No plano gratuito do Gemini, o Google pode usá-los para melhorar seus produtos; para dados sensíveis,
  prefira um plano pago, o Groq ou um modelo local (Ollama) na versão desktop.
- **Senha única**: use uma senha longa e exclusiva; quem a souber acessa todos os dados. Contas separadas
  (Supabase Auth) são o próximo passo quando houver mais de um usuário.
- **Sessão no navegador**: fica no `localStorage`; uma extensão maliciosa poderia lê-la. Use *Sair deste dispositivo*
  em computadores compartilhados e troque a senha se perder um aparelho.
- **Prompt injection** não é eliminável: um documento malicioso pode induzir respostas erradas. Na nuvem não há
  ferramentas que alterem algo fora do próprio S.A.I.T.E.
- **Backups**: exporte os dados periodicamente (Configurações → Dados) ou use `pg_dump`.
- Limites de taxa são em memória, por instância (adequado para uma instância gratuita).
- Licenças: pypdf (BSD), python-docx (MIT), openpyxl (MIT), FastAPI (MIT), psycopg (LGPL, usado como biblioteca),
  psutil (BSD). Termos dos provedores de IA: consulte o provedor escolhido.
