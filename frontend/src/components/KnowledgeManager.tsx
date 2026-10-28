"use client";

import {
  CircleAlert,
  CircleCheck,
  FileText,
  Globe,
  Link2,
  LoaderCircle,
  RefreshCw,
  Square,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { DragEvent, FormEvent, useCallback, useEffect, useRef, useState } from "react";

import Button from "@/components/ui/Button";
import Dialog, { ConfirmDialog } from "@/components/ui/Dialog";
import { EmptyState, ErrorState, inputClass, SkeletonRows } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { cx, errorMessage, formatBytes, formatDateTime, formatRelative } from "@/lib/format";
import {
  cancelDocument,
  deleteDocument,
  DocumentChunk,
  getDocument,
  getDocuments,
  importUrl,
  KnowledgeDocument,
  reprocessDocument,
  Scope,
  uploadDocument,
} from "@/services/api";

const ACCEPT = ".pdf,.txt,.md,.markdown,.csv,.html,.htm,.docx,.xlsx";

const STATUS = {
  pending: { label: "Na fila", tone: "text-[var(--foreground-muted)]" },
  processing: { label: "Processando", tone: "text-[var(--accent)]" },
  ready: { label: "Indexado", tone: "text-[var(--success)]" },
  error: { label: "Erro", tone: "text-[var(--danger)]" },
};

interface KnowledgeManagerProps {
  scope: Exclude<Scope, "conversation">;
  projectId?: string | null;
  onChanged?: () => void;
}

export default function KnowledgeManager({ scope, projectId = null, onChanged }: KnowledgeManagerProps) {
  const { notify } = useToast();
  const [documents, setDocuments] = useState<KnowledgeDocument[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [url, setUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [detail, setDetail] = useState<{ document: KnowledgeDocument; chunks: DocumentChunk[] } | null>(null);
  const [removing, setRemoving] = useState<KnowledgeDocument | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      setDocuments(await getDocuments({ scope, projectId }));
      setLoadError(null);
    } catch (error) {
      setLoadError(errorMessage(error));
    }
  }, [scope, projectId]);

  useEffect(() => {
    const first = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(first);
  }, [load]);

  // Atualiza enquanto houver documentos na fila/processando (estado real do backend).
  const busy = documents?.some((document) => document.status === "pending" || document.status === "processing");
  useEffect(() => {
    if (!busy) return;
    const timer = window.setInterval(() => void load(), 1500);
    return () => window.clearInterval(timer);
  }, [busy, load]);

  // Avisa quando um documento termina (para atualizar contadores da página).
  const previousBusy = useRef(false);
  useEffect(() => {
    if (previousBusy.current && !busy) onChanged?.();
    previousBusy.current = Boolean(busy);
  }, [busy, onChanged]);

  async function upload(files: File[]) {
    setUploading((count) => count + files.length);
    for (const file of files) {
      try {
        const { created } = await uploadDocument(file, scope, { projectId });
        notify(created ? "success" : "info", created ? `"${file.name}" enviado para processamento.` : `"${file.name}" já estava na base.`);
      } catch (error) {
        notify("error", `${file.name}: ${errorMessage(error)}`);
      } finally {
        setUploading((count) => count - 1);
      }
    }
    await load();
    onChanged?.();
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    setDragging(false);
    const files = Array.from(event.dataTransfer.files);
    if (files.length) void upload(files);
  }

  async function submitUrl(event: FormEvent) {
    event.preventDefault();
    if (!url.trim()) return;
    setImporting(true);
    try {
      const { created } = await importUrl(url.trim(), scope, { projectId });
      notify(created ? "success" : "info", created ? "Link adicionado. Capturando conteúdo…" : "Este link já está na base.");
      setUrl("");
      await load();
    } catch (error) {
      notify("error", errorMessage(error));
    } finally {
      setImporting(false);
    }
  }

  async function act(document: KnowledgeDocument, action: "reprocess" | "cancel") {
    try {
      if (action === "reprocess") await reprocessDocument(document.id);
      else await cancelDocument(document.id);
      await load();
    } catch (error) {
      notify("error", errorMessage(error));
    }
  }

  async function openDetail(document: KnowledgeDocument) {
    try {
      setDetail(await getDocument(document.id));
    } catch (error) {
      notify("error", errorMessage(error));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ENTRADA: ARQUIVOS + LINKS */}
      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cx(
            "group flex min-h-[132px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-6 text-center transition-[border-color,background-color] duration-200",
            dragging
              ? "border-[var(--accent)] bg-[var(--accent-soft)]"
              : "border-[var(--border)] bg-[var(--background-secondary)] hover:border-[var(--accent)]",
          )}
        >
          {uploading > 0 ? (
            <LoaderCircle size={24} className="animate-spin text-[var(--accent)]" aria-hidden />
          ) : (
            <UploadCloud
              size={24}
              className="text-[var(--foreground-muted)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:text-[var(--accent)]"
              aria-hidden
            />
          )}
          <span className="text-sm font-medium text-[var(--foreground)]">
            {uploading > 0 ? `Enviando ${uploading} arquivo(s)…` : "Arraste arquivos ou clique para escolher"}
          </span>
          <span className="text-xs text-[var(--foreground-muted)]">PDF, DOCX, TXT, MD, CSV, XLSX, HTML · até 25 MB</span>
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept={ACCEPT}
          className="hidden"
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            event.target.value = "";
            if (files.length) void upload(files);
          }}
        />

        <form
          onSubmit={submitUrl}
          className="flex flex-col justify-center gap-2.5 rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)] p-4"
        >
          <label htmlFor={`url-${scope}`} className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
            <Link2 size={16} className="text-[var(--accent)]" aria-hidden /> Aprender com um link
          </label>
          <div className="flex gap-2">
            <input
              id={`url-${scope}`}
              type="url"
              inputMode="url"
              required
              placeholder="https://…"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              className={inputClass}
            />
            <Button type="submit" variant="primary" loading={importing} disabled={!url.trim()}>
              Importar
            </Button>
          </div>
          <p className="text-xs leading-5 text-[var(--foreground-muted)]">
            Só páginas públicas. Endereços internos/privados são bloqueados e páginas com login não são contornadas.
          </p>
        </form>
      </div>

      {/* LISTA */}
      {loadError ? (
        <ErrorState message="Não foi possível carregar os documentos." hint={loadError} />
      ) : documents === null ? (
        <SkeletonRows rows={3} />
      ) : documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nenhum conteúdo ainda"
          description={
            scope === "project"
              ? "Documentos adicionados aqui só são consultados em conversas deste projeto."
              : "Documentos e links adicionados aqui ficam disponíveis em todas as conversas."
          }
        />
      ) : (
        <ul className="flex flex-col divide-y divide-[var(--border)] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)]">
          {documents.map((document) => {
            const status = STATUS[document.status];
            const inProgress = document.status === "pending" || document.status === "processing";
            const Icon = document.source_type === "url" ? Globe : FileText;
            return (
              <li key={document.id} className="animate-fade-in flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--background-tertiary)] text-[var(--foreground-secondary)]">
                    <Icon size={17} aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => void openDetail(document)}
                      className="block max-w-full truncate text-left text-sm font-medium text-[var(--foreground)] hover:text-[var(--accent)] hover:underline"
                    >
                      {document.name}
                    </button>
                    <p className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-[var(--foreground-muted)]">
                      <span className={cx("inline-flex items-center gap-1 font-medium", status.tone)}>
                        {inProgress && <LoaderCircle size={11} className="animate-spin" aria-hidden />}
                        {document.status === "ready" && <CircleCheck size={11} aria-hidden />}
                        {document.status === "error" && <CircleAlert size={11} aria-hidden />}
                        {status.label}
                      </span>
                      {document.status === "ready" && <span>{document.chunk_count} trecho(s)</span>}
                      {document.size_bytes > 0 && <span>{formatBytes(document.size_bytes)}</span>}
                      <span title={formatDateTime(document.created_at)}>{formatRelative(document.created_at)}</span>
                      {document.url && <span className="max-w-[260px] truncate">{document.url}</span>}
                    </p>
                    {inProgress && <div className="progress-indeterminate mt-2 h-1 w-full max-w-xs rounded-full bg-[var(--background-tertiary)]" />}
                    {document.error && (
                      <p
                        className={cx(
                          "mt-1.5 text-xs leading-5",
                          document.status === "error" ? "text-[var(--danger)]" : "text-[var(--warning)]",
                        )}
                      >
                        {document.error}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 gap-1 self-end sm:self-center">
                  {inProgress ? (
                    <Button size="sm" variant="ghost" onClick={() => void act(document, "cancel")} title="Cancelar processamento">
                      <Square size={12} /> Cancelar
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => void act(document, "reprocess")}
                      title={document.source_type === "url" ? "Capturar a página novamente" : "Processar de novo"}
                    >
                      <RefreshCw size={12} /> {document.source_type === "url" ? "Atualizar" : "Reprocessar"}
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => setRemoving(document)} aria-label={`Remover ${document.name}`}>
                    <Trash2 size={13} className="text-[var(--danger)]" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={removing !== null}
        title="Remover da base de conhecimento?"
        description={
          <>
            <strong>{removing?.name}</strong>, seus trechos indexados e o arquivo original guardado serão apagados. A IA deixará
            de usar este conteúdo.
          </>
        }
        confirmLabel="Remover"
        danger
        onClose={() => setRemoving(null)}
        onConfirm={async () => {
          if (!removing) return;
          try {
            await deleteDocument(removing.id);
            notify("success", "Documento removido da base.");
            await load();
            onChanged?.();
          } catch (error) {
            notify("error", errorMessage(error));
            throw error;
          }
        }}
      />

      <Dialog
        open={detail !== null}
        title={detail?.document.name ?? ""}
        description={
          detail && (
            <span className="flex flex-wrap gap-x-3 text-xs">
              <span>{STATUS[detail.document.status].label}</span>
              <span>{detail.document.chunk_count} trecho(s)</span>
              <span>{detail.document.char_count.toLocaleString("pt-BR")} caracteres</span>
              <span>Embeddings: {detail.document.embed_model ?? "não gerados (só busca por palavras)"}</span>
              <span>Versão {detail.document.version}</span>
              {detail.document.fetched_at && <span>Capturado {formatDateTime(detail.document.fetched_at)}</span>}
            </span>
          )
        }
        onClose={() => setDetail(null)}
        size="lg"
      >
        {detail && detail.chunks.length === 0 ? (
          <p className="text-sm text-[var(--foreground-secondary)]">Nenhum trecho indexado.</p>
        ) : (
          <ol className="flex flex-col gap-2">
            {detail?.chunks.map((chunk) => (
              <li key={chunk.id} className="rounded-xl border border-[var(--border)] p-3">
                <p className="mb-1 text-[11px] font-medium text-[var(--foreground-muted)]">
                  #{chunk.ord + 1} {chunk.location && `· ${chunk.location}`}
                </p>
                <p className="line-clamp-6 whitespace-pre-wrap text-xs leading-5 text-[var(--foreground-secondary)]">{chunk.content}</p>
              </li>
            ))}
          </ol>
        )}
      </Dialog>
    </div>
  );
}
