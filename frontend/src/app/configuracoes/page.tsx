"use client";

import {
  Bot,
  Brain,
  Cpu,
  Database,
  Download,
  FolderPlus,
  HardDrive,
  MemoryStick,
  Monitor,
  Pause,
  Play,
  PlugZap,
  RefreshCw,
  ShieldAlert,
  Trash2,
  Upload,
} from "lucide-react";
import { FormEvent, ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { useApp } from "@/components/AppProvider";
import Button from "@/components/ui/Button";
import { Card, EmptyState, ErrorState, inputClass, PageHeader, StatusDot } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { cx, errorMessage, formatBytes, formatDateTime, formatDuration } from "@/lib/format";
import {
  ActivityEntry,
  AISettings,
  AuditEntry,
  createMemory,
  deleteMemory,
  DiskInfo,
  exportData,
  getActivity,
  getAgentAudit,
  getAISettings,
  getConnection,
  getDiskUsage,
  getHealth,
  getMemories,
  getSystemInfo,
  importData,
  Memory,
  resetAISettings,
  saveConnection,
  SystemInfo,
  testModel,
  updateAgentPermissions,
  updateAISettings,
} from "@/services/api";

const SECTIONS = [
  { id: "conexao", label: "Conexão", icon: PlugZap },
  { id: "ia", label: "IA local", icon: Bot },
  { id: "agente", label: "Agente local", icon: Monitor },
  { id: "memorias", label: "Memórias", icon: Brain },
  { id: "dados", label: "Dados", icon: Database },
];

const TOOL_INFO: Record<string, string> = {
  system_info: "Sistema operacional, CPU, memória e tempo ligado",
  disk_usage: "Espaço livre e usado de cada disco",
  list_directory: "Listar arquivos de uma pasta autorizada",
  search_files: "Procurar arquivos por nome nas pastas autorizadas",
  file_metadata: "Tamanho e datas de um arquivo autorizado",
  read_text_file: "Ler o conteúdo de arquivos de texto autorizados",
  list_processes: "Ver os processos que mais consomem recursos",
};

function Section({ id, title, icon: Icon, children }: { id: string; title: string; icon: typeof Bot; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-6">
      <h2 id={`${id}-title`} className="mb-3 flex items-center gap-2 text-base font-semibold text-[var(--foreground)]">
        <Icon size={17} className="text-[var(--accent)]" aria-hidden /> {title}
      </h2>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm text-[var(--foreground-secondary)]">
      <span className="font-medium text-[var(--foreground)]">{label}</span>
      {children}
      {hint && <span className="text-xs leading-5 text-[var(--foreground-muted)]">{hint}</span>}
    </label>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-[var(--background-tertiary)] px-3 py-2 font-mono text-xs leading-6 text-[var(--foreground)]">
      {children}
    </pre>
  );
}

/* ============================================================
   CONEXÃO COM O BACKEND
============================================================ */

function ConnectionSection() {
  const { notify } = useToast();
  const { refreshStatus } = useApp();
  const [form, setForm] = useState(getConnection);
  const [testing, setTesting] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    saveConnection(form);
    setTesting(true);
    try {
      const health = await getHealth();
      notify("success", `Conectado ao backend ${health.version}.`, health.auth_required ? "Autenticação por token ativa." : undefined);
    } catch (error) {
      notify("error", errorMessage(error));
    } finally {
      setTesting(false);
      void refreshStatus();
    }
  }

  return (
    <Card>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Endereço do backend" hint="O backend roda no seu computador. Padrão: http://localhost:8000">
          <input
            type="url"
            required
            value={form.apiUrl}
            onChange={(event) => setForm({ ...form, apiUrl: event.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Token de acesso (opcional)" hint="Igual a SAITE_API_TOKEN no .env do backend. Guardado só neste navegador.">
          <input
            type="password"
            autoComplete="off"
            value={form.token}
            onChange={(event) => setForm({ ...form, token: event.target.value })}
            className={inputClass}
          />
        </Field>
        <div className="sm:col-span-2 flex justify-end">
          <Button type="submit" variant="primary" loading={testing}>
            Salvar e testar
          </Button>
        </div>
      </form>
    </Card>
  );
}

/* ============================================================
   IA LOCAL
============================================================ */

function AISection() {
  const { notify } = useToast();
  const { connection, refreshStatus } = useApp();
  const [settings, setSettings] = useState<AISettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    if (connection.state !== "online") return;
    let cancelled = false;
    getAISettings()
      .then((data) => !cancelled && setSettings(data))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [connection.state]);

  if (connection.state === "backend-offline") {
    return <ErrorState message="Backend offline" hint="Conecte-se ao backend para configurar a IA local." />;
  }
  if (connection.state === "loading" || !settings) {
    return <div className="skeleton h-48" role="status" aria-label="Carregando" />;
  }

  const ai = connection.ai;
  const installed = ai.models.map((model) => model.name);

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      setSettings(await updateAISettings(settings));
      notify("success", "Configurações da IA salvas.");
      await refreshStatus();
    } catch (error) {
      notify("error", errorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function runTest() {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await testModel();
      setTestResult(`✓ ${result.model} respondeu em ${(result.ms / 1000).toFixed(1)} s: “${result.reply.trim()}”`);
    } catch (error) {
      setTestResult(`✗ ${errorMessage(error)}`);
    } finally {
      setTesting(false);
    }
  }

  const update = <K extends keyof AISettings>(key: K, value: AISettings[K]) => setSettings({ ...settings, [key]: value });

  return (
    <>
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <StatusDot state={ai.online ? (ai.chat_model_installed ? "online" : "warning") : "offline"} />
          <p className="text-sm font-medium text-[var(--foreground)]">
            {ai.online
              ? `${ai.provider === "ollama" ? "Ollama" : "Servidor OpenAI-compatível"} ${ai.version ?? ""} conectado`
              : "Runtime de IA não está respondendo"}
          </p>
          <span className="text-xs text-[var(--foreground-muted)]">{ai.base_url}</span>
          <Button size="sm" variant="ghost" className="ml-auto" onClick={() => void refreshStatus()}>
            <RefreshCw size={13} /> Verificar
          </Button>
        </div>
        {(ai.error || ai.hint) && <p className="mt-2 text-sm leading-6 text-[var(--foreground-secondary)]">{ai.hint ?? ai.error}</p>}

        {!ai.online && (
          <div className="mt-4 flex flex-col gap-2 text-sm text-[var(--foreground-secondary)]">
            <p>Para usar o Ollama (recomendado), instale em https://ollama.com/download e baixe os modelos:</p>
            <Code>{`ollama pull ${settings.chat_model}      # chat (~4,7 GB; requer ~8 GB de RAM)\nollama pull ${settings.embed_model}            # embeddings (~1,2 GB)`}</Code>
          </div>
        )}

        {ai.models.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">Modelos instalados</p>
            <ul className="flex flex-wrap gap-1.5">
              {ai.models.map((model) => (
                <li
                  key={model.name}
                  className={cx(
                    "rounded-lg border px-2 py-1 text-xs",
                    model.name === settings.chat_model || model.name === settings.embed_model || model.name === `${settings.embed_model}:latest`
                      ? "border-[var(--accent)] text-[var(--accent)]"
                      : "border-[var(--border)] text-[var(--foreground-secondary)]",
                  )}
                >
                  {model.name}
                  {model.size_bytes ? <span className="ml-1.5 text-[var(--foreground-muted)]">{formatBytes(model.size_bytes)}</span> : null}
                  {model.capabilities.includes("embedding") && <span className="ml-1.5 text-[var(--foreground-muted)]">embedding</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      <Card>
        <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          <Field label="Provedor">
            <select
              value={settings.llm_provider}
              onChange={(event) => update("llm_provider", event.target.value as AISettings["llm_provider"])}
              className={inputClass}
            >
              <option value="ollama">Ollama</option>
              <option value="openai_compatible">OpenAI-compatível local (llama.cpp, LM Studio)</option>
            </select>
          </Field>
          <Field label="Endereço do runtime" hint="Ollama: http://127.0.0.1:11434 · llama-server: http://127.0.0.1:8080">
            <input value={settings.llm_base_url} onChange={(event) => update("llm_base_url", event.target.value)} className={inputClass} />
          </Field>
          <Field label="Modelo de chat" hint={installed.length ? "Escolha um instalado ou digite outro nome." : undefined}>
            <input list="installed-models" value={settings.chat_model} onChange={(event) => update("chat_model", event.target.value)} className={inputClass} />
          </Field>
          <Field label="Modelo de embeddings" hint="Trocar exige reindexar (aba Aprender).">
            <input list="installed-models" value={settings.embed_model} onChange={(event) => update("embed_model", event.target.value)} className={inputClass} />
          </Field>
          <datalist id="installed-models">
            {installed.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
          <Field label={`Temperatura: ${settings.temperature.toFixed(2)}`} hint="Mais baixa = respostas mais consistentes.">
            <input
              type="range"
              min={0}
              max={1.5}
              step={0.05}
              value={settings.temperature}
              onChange={(event) => update("temperature", Number(event.target.value))}
              className="accent-[var(--accent)]"
            />
          </Field>
          <Field label="Janela de contexto (tokens)">
            <input type="number" min={512} max={262144} step={512} value={settings.num_ctx} onChange={(event) => update("num_ctx", Number(event.target.value))} className={inputClass} />
          </Field>
          <Field label="Mensagens de histórico enviadas">
            <input type="number" min={0} max={200} value={settings.history_messages} onChange={(event) => update("history_messages", Number(event.target.value))} className={inputClass} />
          </Field>
          <Field label="Trechos recuperados por pergunta">
            <input type="number" min={1} max={20} value={settings.rag_top_k} onChange={(event) => update("rag_top_k", Number(event.target.value))} className={inputClass} />
          </Field>
          <Field label="Similaridade mínima" hint="Calibrada para bge-m3 (0,45). Outros modelos podem exigir outro valor.">
            <input type="number" min={0} max={1} step={0.01} value={settings.rag_min_similarity} onChange={(event) => update("rag_min_similarity", Number(event.target.value))} className={inputClass} />
          </Field>
          <Field label="Nome da assistente">
            <input maxLength={60} value={settings.assistant_name} onChange={(event) => update("assistant_name", event.target.value)} className={inputClass} />
          </Field>
          <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
            <Button onClick={() => void runTest()} loading={testing} disabled={!ai.online}>
              Testar modelo
            </Button>
            <Button
              variant="ghost"
              onClick={async () => {
                setSettings(await resetAISettings());
                notify("info", "Padrões restaurados.");
                await refreshStatus();
              }}
            >
              Restaurar padrões
            </Button>
            <Button type="submit" variant="primary" loading={saving} className="ml-auto">
              Salvar
            </Button>
          </div>
          {testResult && <p className="animate-fade-up text-sm text-[var(--foreground-secondary)] sm:col-span-2">{testResult}</p>}
        </form>
      </Card>
    </>
  );
}

/* ============================================================
   AGENTE LOCAL
============================================================ */

function AgentSection() {
  const { notify } = useToast();
  const { agent, refreshStatus, connection } = useApp();
  const [system, setSystem] = useState<SystemInfo | null>(null);
  const [disks, setDisks] = useState<DiskInfo | null>(null);
  const [loadingPc, setLoadingPc] = useState(false);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [newRoot, setNewRoot] = useState("");
  const [busy, setBusy] = useState(false);

  const connected = Boolean(agent?.connected);

  const loadPc = useCallback(async () => {
    setLoadingPc(true);
    try {
      const [info, disk, entries] = await Promise.all([getSystemInfo(), getDiskUsage(), getAgentAudit(30)]);
      setSystem(info);
      setDisks(disk);
      setAudit(entries);
    } catch (error) {
      notify("error", errorMessage(error));
    } finally {
      setLoadingPc(false);
    }
  }, [notify]);

  useEffect(() => {
    if (!connected || agent?.paused) return;
    const first = window.setTimeout(() => void loadPc(), 0);
    return () => window.clearTimeout(first);
  }, [connected, agent?.paused, loadPc]);

  async function change(changes: Parameters<typeof updateAgentPermissions>[0], success: string) {
    setBusy(true);
    try {
      await updateAgentPermissions(changes);
      notify("success", success);
      await refreshStatus();
      setAudit(await getAgentAudit(30).catch(() => audit));
    } catch (error) {
      notify("error", errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  if (connection.state !== "online") {
    return <ErrorState message="Backend offline" hint="O estado do agente é consultado pelo backend." />;
  }

  if (!agent || !connected) {
    return (
      <Card>
        <div className="flex items-center gap-2">
          <StatusDot state="offline" />
          <p className="text-sm font-medium text-[var(--foreground)]">Agente local desconectado</p>
          <Button size="sm" variant="ghost" className="ml-auto" onClick={() => void refreshStatus()}>
            <RefreshCw size={13} /> Verificar
          </Button>
        </div>
        <p className="mt-2 text-sm leading-6 text-[var(--foreground-secondary)]">
          {agent?.error ?? "O agente é um programa separado que roda no seu computador e só permite leituras autorizadas."}
        </p>
        <div className="mt-3 flex flex-col gap-2 text-sm text-[var(--foreground-secondary)]">
          <p>Na pasta <code>agent/</code> do projeto:</p>
          <Code>{`pip install -r requirements.txt\npython -m saite_agent roots add "C:\\Users\\voce\\Documents"\npython -m saite_agent token        # copie para SAITE_AGENT_TOKEN no .env do backend\npython -m saite_agent serve`}</Code>
        </div>
      </Card>
    );
  }

  const roots = agent.allowed_roots ?? [];
  const tools = agent.tools ?? {};
  const sensitive = new Set(agent.sensitive_tools ?? []);

  return (
    <>
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <StatusDot state={agent.paused ? "warning" : "online"} />
          <p className="text-sm font-medium text-[var(--foreground)]">
            Agente {agent.version} {agent.paused ? "pausado — todas as ferramentas bloqueadas" : "conectado"}
          </p>
          <Button
            size="sm"
            variant={agent.paused ? "primary" : "secondary"}
            className="ml-auto"
            loading={busy}
            onClick={() => void change({ paused: !agent.paused }, agent.paused ? "Agente liberado." : "Agente pausado.")}
          >
            {agent.paused ? <Play size={13} /> : <Pause size={13} />} {agent.paused ? "Retomar" : "Pausar tudo"}
          </Button>
        </div>
      </Card>

      {!agent.paused && (
        <Card>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Meu PC agora</h3>
            {system && <span className="text-xs text-[var(--foreground-muted)]">lido em {formatDateTime(system.collected_at)}</span>}
            <Button size="sm" variant="ghost" className="ml-auto" loading={loadingPc} onClick={() => void loadPc()}>
              <RefreshCw size={13} /> Atualizar
            </Button>
          </div>
          {system ? (
            <dl className="mt-3 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-[var(--background-tertiary)] p-3">
                <dt className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)]">
                  <Cpu size={13} aria-hidden /> CPU ({system.cpu_logical} núcleos)
                </dt>
                <dd className="mt-1 text-lg font-semibold tabular-nums">{system.cpu_percent ?? "—"}%</dd>
              </div>
              <div className="rounded-xl bg-[var(--background-tertiary)] p-3">
                <dt className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)]">
                  <MemoryStick size={13} aria-hidden /> Memória
                </dt>
                <dd className="mt-1 text-lg font-semibold tabular-nums">
                  {system.memory_percent ?? "—"}%
                  <span className="ml-1.5 text-xs font-normal text-[var(--foreground-muted)]">
                    {formatBytes(system.memory_used_bytes)} de {formatBytes(system.memory_total_bytes)}
                  </span>
                </dd>
              </div>
              <div className="rounded-xl bg-[var(--background-tertiary)] p-3">
                <dt className="text-xs text-[var(--foreground-muted)]">Sistema</dt>
                <dd className="mt-1 text-sm font-medium">
                  {system.os} {system.os_release}
                  <span className="block text-xs font-normal text-[var(--foreground-muted)]">ligado há {formatDuration(system.uptime_seconds)}</span>
                </dd>
              </div>
              {disks?.disks.map((disk) => (
                <div key={disk.mountpoint} className="rounded-xl bg-[var(--background-tertiary)] p-3 sm:col-span-3">
                  <dt className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)]">
                    <HardDrive size={13} aria-hidden /> {disk.mountpoint}
                    <span className="ml-auto">
                      {formatBytes(disk.free_bytes)} livres de {formatBytes(disk.total_bytes)}
                    </span>
                  </dt>
                  <dd className="mt-2">
                    <div
                      className="h-1.5 overflow-hidden rounded-full bg-[var(--border)]"
                      role="progressbar"
                      aria-label={`Uso de ${disk.mountpoint}`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={disk.percent ?? 0}
                    >
                      <div
                        className={cx("h-full rounded-full transition-[width] duration-500", (disk.percent ?? 0) > 90 ? "bg-[var(--danger)]" : "bg-[var(--accent)]")}
                        style={{ width: `${disk.percent ?? 0}%` }}
                      />
                    </div>
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <div className="skeleton mt-3 h-24" />
          )}
        </Card>
      )}

      <Card>
        <h3 className="text-sm font-semibold text-[var(--foreground)]">Pastas autorizadas</h3>
        <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">
          A IA só lista, procura ou lê arquivos dentro destas pastas. Credenciais (.env, chaves SSH, perfis de navegador) são sempre
          bloqueadas.
        </p>
        <ul className="mt-3 flex flex-col gap-1">
          {roots.length === 0 && <li className="text-sm text-[var(--foreground-secondary)]">Nenhuma pasta autorizada.</li>}
          {roots.map((root) => (
            <li key={root} className="flex items-center gap-2 rounded-lg bg-[var(--background-tertiary)] px-3 py-2 font-mono text-xs">
              <span className="min-w-0 flex-1 truncate">{root}</span>
              <button
                type="button"
                aria-label={`Revogar ${root}`}
                disabled={busy}
                onClick={() => void change({ allowed_roots: roots.filter((item) => item !== root) }, "Acesso revogado.")}
                className="rounded p-1 text-[var(--foreground-muted)] hover:text-[var(--danger)]"
              >
                <Trash2 size={13} />
              </button>
            </li>
          ))}
        </ul>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (!newRoot.trim()) return;
            void change({ allowed_roots: [...roots, newRoot.trim()] }, "Pasta autorizada.").then(() => setNewRoot(""));
          }}
        >
          <label htmlFor="new-root" className="sr-only">
            Caminho absoluto da pasta
          </label>
          <input
            id="new-root"
            value={newRoot}
            onChange={(event) => setNewRoot(event.target.value)}
            placeholder="C:\Users\voce\Documents ou /home/voce/Documentos"
            className={inputClass}
          />
          <Button type="submit" disabled={!newRoot.trim() || busy}>
            <FolderPlus size={14} /> Autorizar
          </Button>
        </form>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-[var(--foreground)]">Ferramentas</h3>
        <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">
          Todas são somente leitura. A IA só as usa quando você ativa “Usar computador” no chat.
        </p>
        <ul className="mt-3 flex flex-col divide-y divide-[var(--border)]">
          {Object.entries(tools).map(([name, enabled]) => (
            <li key={name} className="flex items-center gap-3 py-2.5">
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-sm text-[var(--foreground)]">
                  {TOOL_INFO[name] ?? name}
                  {sensitive.has(name) && (
                    <span className="inline-flex items-center gap-1 rounded bg-[var(--warning)]/15 px-1.5 text-[10px] font-medium text-[var(--warning)]">
                      <ShieldAlert size={10} aria-hidden /> sensível
                    </span>
                  )}
                </p>
                <p className="font-mono text-[11px] text-[var(--foreground-muted)]">{name}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={enabled}
                aria-label={`${enabled ? "Desativar" : "Ativar"} ${TOOL_INFO[name] ?? name}`}
                disabled={busy}
                onClick={() => void change({ tools: { [name]: !enabled } }, `${enabled ? "Desativada" : "Ativada"}: ${name}.`)}
                className={cx(
                  "flex h-6 w-10 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 disabled:opacity-50",
                  enabled ? "bg-[var(--accent)]" : "bg-[var(--border-hover)]",
                )}
              >
                <span className={cx("h-5 w-5 rounded-full bg-white shadow transition-transform duration-200", enabled && "translate-x-4")} />
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-[var(--foreground)]">Registro de operações</h3>
        {audit.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--foreground-secondary)]">Nenhuma operação registrada.</p>
        ) : (
          <ul tabIndex={0} aria-label="Operações do agente" className="mt-2 flex max-h-72 flex-col divide-y divide-[var(--border)] overflow-y-auto text-xs">
            {audit.map((entry, index) => (
              <li key={index} className="flex flex-wrap gap-x-3 py-2">
                <span className="w-32 shrink-0 text-[var(--foreground-muted)]">{formatDateTime(entry.at)}</span>
                <span className={entry.ok ? "text-[var(--foreground)]" : "text-[var(--danger)]"}>{entry.tool}</span>
                <span className="min-w-0 flex-1 truncate font-mono text-[var(--foreground-muted)]">
                  {Object.values(entry.arguments).join(" · ")}
                </span>
                {!entry.ok && <span className="text-[var(--danger)]">{entry.error}</span>}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}

/* ============================================================
   MEMÓRIAS
============================================================ */

function MemoriesSection() {
  const { notify } = useToast();
  const [memories, setMemories] = useState<Memory[] | null>(null);
  const [text, setText] = useState("");

  const load = useCallback(async () => {
    try {
      setMemories(await getMemories());
    } catch {
      setMemories([]);
    }
  }, []);

  useEffect(() => {
    const first = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(first);
  }, [load]);

  return (
    <Card>
      <p className="text-sm leading-6 text-[var(--foreground-secondary)]">
        Memórias são fatos que <strong>você</strong> pede para a IA lembrar. Nada é memorizado automaticamente: o histórico das
        conversas fica separado e a base de conhecimento fica em Aprender. Memórias globais valem em todas as conversas; as de
        projeto, só no projeto.
      </p>
      <form
        className="mt-3 flex gap-2"
        onSubmit={async (event) => {
          event.preventDefault();
          if (!text.trim()) return;
          try {
            await createMemory(text.trim());
            setText("");
            await load();
          } catch (error) {
            notify("error", errorMessage(error));
          }
        }}
      >
        <label htmlFor="memory-text" className="sr-only">
          Nova memória global
        </label>
        <input
          id="memory-text"
          maxLength={1000}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Ex.: Prefiro respostas curtas e em tópicos."
          className={inputClass}
        />
        <Button type="submit" disabled={!text.trim()}>
          Adicionar
        </Button>
      </form>
      {memories && memories.length === 0 ? (
        <div className="mt-4">
          <EmptyState icon={Brain} title="Nenhuma memória" description="Use “Lembrar isto” numa mensagem do chat ou adicione aqui." />
        </div>
      ) : (
        <ul className="mt-3 flex flex-col divide-y divide-[var(--border)]">
          {memories?.map((memory) => (
            <li key={memory.id} className="flex items-start gap-3 py-2.5 text-sm">
              <span className="flex-1 leading-6 text-[var(--foreground)]">{memory.content}</span>
              <span className="shrink-0 rounded bg-[var(--background-tertiary)] px-1.5 py-0.5 text-[10px] text-[var(--foreground-muted)]">
                {memory.project_name ?? "Global"}
              </span>
              <button
                type="button"
                aria-label="Remover memória"
                onClick={async () => {
                  try {
                    await deleteMemory(memory.id);
                    await load();
                  } catch (error) {
                    notify("error", errorMessage(error));
                  }
                }}
                className="rounded p-1 text-[var(--foreground-muted)] hover:text-[var(--danger)]"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/* ============================================================
   DADOS
============================================================ */

function DataSection() {
  const { notify } = useToast();
  const { bumpHistory } = useApp();
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [exporting, setExporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getActivity(30)
      .then(setActivity)
      .catch(() => undefined);
  }, []);

  async function download() {
    setExporting(true);
    try {
      const blob = await exportData();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `saite-export-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      notify("error", errorMessage(error));
    } finally {
      setExporting(false);
    }
  }

  async function upload(file: File) {
    try {
      const { inserted } = await importData(JSON.parse(await file.text()));
      notify(
        "success",
        `Importado: ${inserted.projects} projeto(s), ${inserted.conversations} conversa(s), ${inserted.messages} mensagem(ns), ${inserted.memories} memória(s).`,
      );
      bumpHistory();
    } catch (error) {
      notify("error", error instanceof SyntaxError ? "Arquivo JSON inválido." : errorMessage(error));
    }
  }

  return (
    <Card>
      <p className="text-sm leading-6 text-[var(--foreground-secondary)]">
        Tudo fica no seu computador (pasta <code>backend/data</code>). A exportação inclui projetos, conversas, mensagens,
        memórias e o catálogo de documentos. Para um backup completo, copie também a pasta de dados com o backend parado.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button onClick={() => void download()} loading={exporting}>
          <Download size={14} /> Exportar dados (JSON)
        </Button>
        <Button onClick={() => fileRef.current?.click()}>
          <Upload size={14} /> Importar exportação
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) void upload(file);
          }}
        />
      </div>
      {activity.length > 0 && (
        <>
          <h3 className="mt-5 text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">Atividade recente</h3>
          <ul tabIndex={0} aria-label="Atividade recente" className="mt-2 flex max-h-60 flex-col divide-y divide-[var(--border)] overflow-y-auto text-xs">
            {activity.map((entry) => (
              <li key={entry.id} className="flex gap-3 py-2">
                <span className="w-32 shrink-0 text-[var(--foreground-muted)]">{formatDateTime(entry.created_at)}</span>
                <span className="font-mono text-[var(--foreground-secondary)]">{entry.action}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}

/* ============================================================
   PÁGINA
============================================================ */

export default function SettingsPage() {
  return (
    <div className="h-full overflow-y-auto scroll-smooth">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        <PageHeader title="Configurações" description="Conexão, modelo local, agente do computador, memórias e dados." />

        <nav aria-label="Seções" className="flex flex-wrap gap-1.5">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] px-3 py-1.5 text-xs text-[var(--foreground-secondary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              <section.icon size={13} aria-hidden /> {section.label}
            </a>
          ))}
        </nav>

        <Section id="conexao" title="Conexão" icon={PlugZap}>
          <ConnectionSection />
        </Section>
        <Section id="ia" title="IA local" icon={Bot}>
          <AISection />
        </Section>
        <Section id="agente" title="Agente local do computador" icon={Monitor}>
          <AgentSection />
        </Section>
        <Section id="memorias" title="Memórias" icon={Brain}>
          <MemoriesSection />
        </Section>
        <Section id="dados" title="Dados e backup" icon={Database}>
          <DataSection />
        </Section>
      </div>
    </div>
  );
}
