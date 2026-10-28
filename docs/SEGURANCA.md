# Segurança e privacidade

## Modelo de ameaça

Uso pessoal, um usuário, tudo na própria máquina. Ameaças consideradas:

1. Outros sites abertos no navegador tentando chamar `localhost`.
2. Outros dispositivos da rede local, se uma porta for exposta por engano.
3. Conteúdo malicioso em documentos ou páginas (prompt injection, arquivos malformados).
4. O próprio modelo pedindo ações indevidas (alucinação ou injeção).
5. URLs apontando para serviços internos (SSRF).
6. Vazamento de dados em logs, exportações ou commits.

## Controles implementados

| Área | Controle | Onde |
|---|---|---|
| Exposição de rede | backend, agente e Ollama em `127.0.0.1`; agente recusa outro host sem `SAITE_AGENT_ALLOW_REMOTE=1` | `INSTALACAO.md`, `agent/saite_agent/__main__.py` |
| Autenticação | token Bearer opcional no backend (`hmac.compare_digest`); token obrigatório e próprio no agente (arquivo com permissão 600) | `app/core/security.py`, `agent/saite_agent/server.py` |
| Navegador | CORS restrito às origens configuradas, sem credenciais; `Access-Control-Allow-Private-Network` só para essas origens | `app/main.py`, `test_private_network_access_preflight` |
| Limites | taxa no chat (30/min) e na ingestão (60/min); agente 60 chamadas/min e timeout por ferramenta; tamanho de upload/URL; tamanho de mensagem e campos | `security.py`, schemas Pydantic |
| Uploads | extensão + assinatura real, *zip bomb*, binário disfarçado, nome higienizado, gravação só em `data/files` | `knowledge/extract.py`, `service.py` |
| SSRF | só http/https em portas web, sem credenciais na URL, todos os IPs resolvidos precisam ser públicos, conexão fixada no IP validado (anti-*rebinding*), redirecionamentos revalidados, limites de tempo/tamanho/tipo | `knowledge/urlfetch.py`, `tests/test_urls.py` |
| SQL | consultas parametrizadas; busca LIKE com curingas escapados; termos FTS entre aspas | serviços, `test_fts_query_syntax_is_neutralized` |
| Isolamento | filtro de escopo aplicado na consulta SQL antes do modelo; memórias e instruções por projeto | `retrieval.py`, `test_project_context_does_not_leak` |
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

- **Prompt injection não é eliminável**: um documento malicioso pode induzir o modelo a responder errado ou a
  pedir ferramentas. Mitigação: as ferramentas são de leitura, limitadas às pastas autorizadas e só existem
  quando o usuário liga "Usar computador". Não autorize pastas com dados que não deseja expor ao modelo.
- **Sem token, qualquer processo local** pode chamar o backend em `127.0.0.1:8000`. Em máquinas compartilhadas,
  defina `SAITE_API_TOKEN`.
- **Dados em repouso não são criptografados** pelo S.A.I.T.E.; use a criptografia de disco do sistema (BitLocker, FileVault, LUKS).
- O token da interface fica no `localStorage` do navegador; qualquer extensão maliciosa no navegador poderia lê-lo.
- Limites de taxa são em memória e por processo (adequado para uso pessoal).
- Licenças: Qwen2.5 7B/1.5B/0.5B (Apache-2.0), bge-m3 (MIT), nomic-embed-text (Apache-2.0). `qwen2.5:3b` usa licença
  de pesquisa (não comercial) e não é recomendado. pypdf (BSD), python-docx (MIT), openpyxl (MIT), FastAPI (MIT), psutil (BSD).
