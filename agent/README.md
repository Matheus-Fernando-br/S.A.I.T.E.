# Agente local do S.A.I.T.E.

Processo separado que roda **no seu computador** e oferece ao S.A.I.T.E. ferramentas
de leitura do sistema, sempre dentro das permissões que você definir.

- Escuta apenas em `127.0.0.1:8765` (recusa outro endereço sem `SAITE_AGENT_ALLOW_REMOTE=1`).
- Toda requisição (exceto `/health`) exige o token salvo em `~/.saite-agent/config.json`.
- Ferramentas **somente leitura**; não há execução de comandos, exclusão ou escrita de arquivos.
- Nenhuma pasta autorizada por padrão. `read_text_file` e `list_processes` começam desligadas.
- Arquivos de credenciais (`.env`, chaves SSH, `*.pem`, perfis de navegador...) são sempre negados.
- Cada chamada fica registrada em `~/.saite-agent/audit.jsonl` (sem o conteúdo lido).
- `pause` bloqueia tudo imediatamente; remover uma pasta revoga o acesso na hora.

## Instalação (Windows, macOS ou Linux)

```bash
cd agent
python -m venv .venv
# Windows: .venv\Scripts\activate   |   macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
```

## Uso

```bash
python -m saite_agent roots add "C:\Users\voce\Documents"   # ou /home/voce/Documentos
python -m saite_agent tools list
python -m saite_agent tools enable read_text_file           # opcional (sensível)
python -m saite_agent token                                 # copie para SAITE_AGENT_TOKEN do backend
python -m saite_agent serve
```

Outros comandos: `roots list|remove`, `tools disable <nome>`, `pause`, `resume`, `token --rotate`.

## Ferramentas

| Nome | Padrão | O que faz |
|---|---|---|
| `system_info` | ligada | SO, CPU, memória, tempo ligado, bateria |
| `disk_usage` | ligada | Espaço por disco/partição |
| `list_directory` | ligada | Lista uma pasta autorizada |
| `search_files` | ligada | Procura arquivos por nome/extensão nas pastas autorizadas |
| `file_metadata` | ligada | Tamanho e datas de um arquivo autorizado |
| `read_text_file` | **desligada** | Lê arquivo de texto (até 200 KB) |
| `list_processes` | **desligada** | Top 15 processos por CPU/memória (sem linha de comando) |

## Testes

```bash
pip install pytest
python -m pytest
```
