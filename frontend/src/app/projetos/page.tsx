"use client";

import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  Brain,
  FolderKanban,
  MessageCircle,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useCallback, useEffect, useState } from "react";

import { useApp } from "@/components/AppProvider";
import KnowledgeManager from "@/components/KnowledgeManager";
import Button from "@/components/ui/Button";
import Dialog, { ConfirmDialog } from "@/components/ui/Dialog";
import { Card, EmptyState, ErrorState, inputClass, PageHeader, SkeletonRows } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { errorMessage, formatDateTime, formatRelative } from "@/lib/format";
import {
  ActivityEntry,
  ApiError,
  Conversation,
  createMemory,
  createProject,
  deleteMemory,
  deleteProject,
  getConversations,
  getMemories,
  getProject,
  getProjectActivity,
  getProjects,
  Memory,
  Project,
  updateProject,
} from "@/services/api";

/* ============================================================
   LISTA DE PROJETOS
============================================================ */

function ProjectList() {
  const router = useRouter();
  const { notify } = useToast();
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", instructions: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setProjects(await getProjects(showArchived));
      setError(null);
    } catch (loadError) {
      setError(errorMessage(loadError));
    }
  }, [showArchived]);

  useEffect(() => {
    const first = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(first);
  }, [load]);

  async function submit(event?: FormEvent) {
    event?.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const project = await createProject({ ...form, name: form.name.trim() });
      notify("success", "Projeto criado.");
      setCreating(false);
      setForm({ name: "", description: "", instructions: "" });
      router.push(`/projetos?id=${project.id}`);
    } catch (createError) {
      notify("error", errorMessage(createError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader
        title="Projetos"
        description="Espaços independentes com instruções, documentos, memórias e conversas próprios. O contexto de um projeto nunca é usado em outro."
        actions={
          <>
            <Button size="md" variant="ghost" onClick={() => setShowArchived((value) => !value)} aria-pressed={showArchived}>
              <Archive size={15} /> {showArchived ? "Ocultar arquivados" : "Mostrar arquivados"}
            </Button>
            <Button variant="primary" onClick={() => setCreating(true)}>
              <Plus size={16} /> Novo projeto
            </Button>
          </>
        }
      />

      {error ? (
        <ErrorState message="Não foi possível carregar os projetos." hint={error} />
      ) : projects === null ? (
        <SkeletonRows rows={3} />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="Nenhum projeto ainda"
          description="Crie um projeto para separar o contexto de um trabalho, estudo ou assunto pessoal."
          action={
            <Button variant="primary" onClick={() => setCreating(true)}>
              <Plus size={16} /> Criar projeto
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <li key={project.id} className="animate-fade-up" style={{ animationDelay: `${index * 30}ms` }}>
              <Link
                href={`/projetos?id=${project.id}`}
                className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)] p-4 shadow-[var(--shadow-sm)] transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-[var(--shadow-md)]"
              >
                <span className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                    <FolderKanban size={16} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[var(--foreground)]">{project.name}</span>
                  {Boolean(project.archived) && (
                    <span className="rounded bg-[var(--background-tertiary)] px-1.5 py-0.5 text-[10px] text-[var(--foreground-muted)]">
                      arquivado
                    </span>
                  )}
                </span>
                <span className="mt-2 line-clamp-2 min-h-[2.5rem] text-xs leading-5 text-[var(--foreground-secondary)]">
                  {project.description || "Sem descrição."}
                </span>
                <span className="mt-3 flex gap-3 text-[11px] text-[var(--foreground-muted)]">
                  <span>{project.conversation_count ?? 0} conversa(s)</span>
                  <span>{project.document_count ?? 0} documento(s)</span>
                  <span className="ml-auto">{formatRelative(project.updated_at)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Dialog
        open={creating}
        title="Novo projeto"
        onClose={() => setCreating(false)}
        footer={
          <>
            <Button onClick={() => setCreating(false)}>Cancelar</Button>
            <Button variant="primary" loading={saving} disabled={!form.name.trim()} onClick={() => void submit()}>
              Criar
            </Button>
          </>
        }
      >
        <form onSubmit={submit} className="flex flex-col gap-3">
          <ProjectFields form={form} onChange={setForm} />
        </form>
      </Dialog>
    </div>
  );
}

function ProjectFields({
  form,
  onChange,
}: {
  form: { name: string; description: string; instructions: string };
  onChange: (form: { name: string; description: string; instructions: string }) => void;
}) {
  return (
    <>
      <label className="flex flex-col gap-1.5 text-sm text-[var(--foreground-secondary)]">
        Nome
        <input
          data-autofocus
          required
          maxLength={120}
          value={form.name}
          onChange={(event) => onChange({ ...form, name: event.target.value })}
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm text-[var(--foreground-secondary)]">
        Descrição
        <input
          maxLength={2000}
          value={form.description}
          onChange={(event) => onChange({ ...form, description: event.target.value })}
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm text-[var(--foreground-secondary)]">
        Instruções para a IA neste projeto
        <textarea
          rows={5}
          maxLength={8000}
          value={form.instructions}
          placeholder="Ex.: Responda sempre com listas de tarefas e prazos."
          onChange={(event) => onChange({ ...form, instructions: event.target.value })}
          className={`${inputClass} resize-y leading-6`}
        />
      </label>
    </>
  );
}

/* ============================================================
   DETALHE DO PROJETO
============================================================ */

function ProjectDetail({ projectId }: { projectId: string }) {
  const router = useRouter();
  const { notify } = useToast();
  const { bumpHistory } = useApp();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", instructions: "" });
  const [saving, setSaving] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [newMemory, setNewMemory] = useState("");
  const [deleting, setDeleting] = useState(false);

  const loadSide = useCallback(async () => {
    const [conversationList, memoryList, activityList] = await Promise.all([
      getConversations({ projectId, limit: 100 }),
      getMemories(),
      getProjectActivity(projectId),
    ]);
    setConversations(conversationList);
    setMemories(memoryList.filter((memory) => memory.project_id === projectId));
    setActivity(activityList);
  }, [projectId]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getProject(projectId);
        if (cancelled) return;
        setProject(data);
        setForm({ name: data.name, description: data.description, instructions: data.instructions });
        await loadSide();
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof ApiError && loadError.status === 404 ? "Projeto não encontrado." : errorMessage(loadError));
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [projectId, loadSide]);

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <ErrorState
          message={error}
          action={
            <Link href="/projetos" className="text-sm font-medium text-[var(--accent)] hover:underline">
              Voltar para projetos
            </Link>
          }
        />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <SkeletonRows rows={5} />
      </div>
    );
  }

  const dirty =
    form.name !== project.name || form.description !== project.description || form.instructions !== project.instructions;

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const updated = await updateProject(projectId, { ...form, name: form.name.trim() });
      setProject(updated);
      notify("success", "Projeto atualizado.");
      await loadSide();
    } catch (saveError) {
      notify("error", errorMessage(saveError));
    } finally {
      setSaving(false);
    }
  }

  async function toggleArchive() {
    if (!project) return;
    try {
      const updated = await updateProject(projectId, { archived: !project.archived });
      setProject(updated);
      notify("success", updated.archived ? "Projeto arquivado." : "Projeto restaurado.");
    } catch (archiveError) {
      notify("error", errorMessage(archiveError));
    }
  }

  async function addMemory(event: FormEvent) {
    event.preventDefault();
    if (!newMemory.trim()) return;
    try {
      await createMemory(newMemory.trim(), projectId);
      setNewMemory("");
      await loadSide();
    } catch (memoryError) {
      notify("error", errorMessage(memoryError));
    }
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/projetos"
        className="flex w-fit items-center gap-1.5 text-xs text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
      >
        <ArrowLeft size={14} /> Projetos
      </Link>

      <PageHeader
        title={project.name}
        description={project.description || undefined}
        actions={
          <>
            <Button variant="primary" onClick={() => router.push(`/?p=${project.id}`)}>
              <Plus size={16} /> Nova conversa
            </Button>
            <Button onClick={() => void toggleArchive()}>
              {project.archived ? <ArchiveRestore size={15} /> : <Archive size={15} />}
              {project.archived ? "Restaurar" : "Arquivar"}
            </Button>
            <Button variant="ghost" onClick={() => setDeleting(true)} aria-label="Excluir projeto">
              <Trash2 size={15} className="text-[var(--danger)]" />
            </Button>
          </>
        }
      />

      {Boolean(project.archived) && (
        <p role="status" className="rounded-xl bg-[var(--background-tertiary)] px-4 py-3 text-sm text-[var(--foreground-secondary)]">
          Projeto arquivado: continua acessível aqui, mas não aparece na lista principal.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <h2 className="text-sm font-semibold text-[var(--foreground)]">Configuração</h2>
          <form onSubmit={save} className="mt-3 flex flex-col gap-3">
            <ProjectFields form={form} onChange={setForm} />
            <div className="flex justify-end">
              <Button type="submit" variant="primary" loading={saving} disabled={!dirty || !form.name.trim()}>
                Salvar alterações
              </Button>
            </div>
          </form>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
              <MessageCircle size={15} className="text-[var(--accent)]" aria-hidden /> Conversas
            </h2>
            {conversations.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--foreground-secondary)]">Nenhuma conversa neste projeto ainda.</p>
            ) : (
              <ul className="mt-2 flex flex-col">
                {conversations.map((conversation) => (
                  <li key={conversation.id}>
                    <Link
                      href={`/?c=${conversation.id}`}
                      className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-[var(--foreground-secondary)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)]"
                    >
                      <span className="min-w-0 flex-1 truncate">{conversation.title}</span>
                      <span className="shrink-0 text-[11px] text-[var(--foreground-muted)]">{formatRelative(conversation.updated_at)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
              <Brain size={15} className="text-[var(--accent)]" aria-hidden /> Memórias do projeto
            </h2>
            <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">
              Fatos fixos que a IA considera só nas conversas deste projeto.
            </p>
            <ul className="mt-2 flex flex-col gap-1">
              {memories.map((memory) => (
                <li key={memory.id} className="group flex items-start gap-2 rounded-lg px-2 py-1.5 text-sm text-[var(--foreground)] hover:bg-[var(--sidebar-hover)]">
                  <span className="flex-1 leading-6">{memory.content}</span>
                  <button
                    type="button"
                    aria-label="Remover memória"
                    onClick={async () => {
                      await deleteMemory(memory.id).catch((memoryError) => notify("error", errorMessage(memoryError)));
                      await loadSide();
                    }}
                    className="rounded p-1 text-[var(--foreground-muted)] opacity-0 transition-opacity hover:text-[var(--danger)] focus-visible:opacity-100 group-hover:opacity-100"
                  >
                    <Trash2 size={13} />
                  </button>
                </li>
              ))}
            </ul>
            <form onSubmit={addMemory} className="mt-2 flex gap-2">
              <label htmlFor="project-memory" className="sr-only">
                Nova memória do projeto
              </label>
              <input
                id="project-memory"
                maxLength={1000}
                value={newMemory}
                onChange={(event) => setNewMemory(event.target.value)}
                placeholder="Ex.: O prazo final é 30/11."
                className={inputClass}
              />
              <Button type="submit" disabled={!newMemory.trim()}>
                Adicionar
              </Button>
            </form>
          </Card>
        </div>
      </div>

      <section aria-labelledby="project-knowledge" className="flex flex-col gap-3">
        <h2 id="project-knowledge" className="text-sm font-semibold text-[var(--foreground)]">
          Conhecimento do projeto
          <span className="ml-2 font-normal text-[var(--foreground-muted)]">consultado apenas nas conversas deste projeto</span>
        </h2>
        <KnowledgeManager scope="project" projectId={project.id} onChanged={() => void loadSide()} />
      </section>

      <Card>
        <h2 className="text-sm font-semibold text-[var(--foreground)]">Histórico de atividades</h2>
        {activity.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--foreground-secondary)]">Sem atividades registradas.</p>
        ) : (
          <ul className="mt-2 flex flex-col divide-y divide-[var(--border)] text-xs">
            {activity.slice(0, 20).map((entry) => (
              <li key={entry.id} className="flex gap-3 py-2">
                <span className="w-32 shrink-0 text-[var(--foreground-muted)]">{formatDateTime(entry.created_at)}</span>
                <span className="text-[var(--foreground-secondary)]">{describeActivity(entry)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <ConfirmDialog
        open={deleting}
        title="Excluir projeto permanentemente?"
        description={
          <>
            Serão apagados <strong>{project.conversation_count ?? conversations.length}</strong> conversa(s), os documentos e o
            índice deste projeto, as memórias do projeto e os arquivos guardados. Esta ação não pode ser desfeita. Se quiser
            apenas tirar da lista, use <em>Arquivar</em>.
          </>
        }
        requireText={project.name}
        confirmLabel="Excluir projeto"
        danger
        onClose={() => setDeleting(false)}
        onConfirm={async () => {
          try {
            const { removed } = await deleteProject(project.id, project.name);
            notify("success", `Projeto excluído (${removed.conversations} conversa(s), ${removed.documents} documento(s)).`);
            bumpHistory();
            router.push("/projetos");
          } catch (deleteError) {
            notify("error", errorMessage(deleteError));
            throw deleteError;
          }
        }}
      />
    </div>
  );
}

const ACTIONS: Record<string, string> = {
  "project.created": "Projeto criado",
  "project.updated": "Projeto atualizado",
  "document.added": "Documento adicionado",
  "url.added": "Link adicionado",
  "document.indexed": "Documento indexado",
  "document.deleted": "Documento removido",
  "conversation.deleted": "Conversa excluída",
  "memory.created": "Memória adicionada",
  "memory.deleted": "Memória removida",
};

function describeActivity(entry: ActivityEntry): string {
  const label = ACTIONS[entry.action] ?? entry.action;
  const name = (entry.detail.name ?? entry.detail.title ?? entry.detail.host) as string | undefined;
  return name ? `${label}: ${name}` : label;
}

/* ============================================================
   PÁGINA
============================================================ */

function ProjectsPage() {
  const projectId = useSearchParams().get("id");
  return <div className="h-full overflow-y-auto">{projectId ? <ProjectDetail key={projectId} projectId={projectId} /> : <ProjectList />}</div>;
}

export default function Page() {
  return (
    <Suspense>
      <ProjectsPage />
    </Suspense>
  );
}
