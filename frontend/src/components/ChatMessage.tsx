"use client";

import {
  BookmarkPlus,
  Check,
  ChevronDown,
  CircleAlert,
  Copy,
  ExternalLink,
  FileText,
  Info,
  Monitor,
  RotateCcw,
  X,
} from "lucide-react";
import { useState } from "react";

import AIAvatar from "@/components/AIAvatar";
import Markdown from "@/components/ui/Markdown";
import { cx } from "@/lib/format";
import { Citation, ToolCallLog } from "@/services/api";

export interface ChatItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  status: "complete" | "partial" | "error" | "streaming";
  citations: Citation[];
  toolCalls: ToolCallLog[];
  model?: string | null;
  hint?: string;
  notices?: string[];
}

const TOOL_LABELS: Record<string, string> = {
  system_info: "Informações do sistema",
  disk_usage: "Uso de disco",
  list_directory: "Listar pasta",
  search_files: "Procurar arquivos",
  file_metadata: "Metadados de arquivo",
  read_text_file: "Ler arquivo de texto",
  list_processes: "Processos em execução",
};

const SCOPE_LABELS = { global: "Global", project: "Projeto", conversation: "Conversa" };

interface ChatMessageProps {
  message: ChatItem;
  onRetry?: () => void;
  onRemember?: (content: string) => void;
}

export default function ChatMessage({ message, onRetry, onRemember }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [highlight, setHighlight] = useState<number | null>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* área de transferência indisponível */
    }
  }

  function showSource(n: number) {
    setSourcesOpen(true);
    setHighlight(n);
    window.setTimeout(() => {
      document.getElementById(`fonte-${message.id}-${n}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 50);
  }

  if (message.role === "user") {
    return (
      <div className="animate-fade-up group flex flex-col items-end gap-1">
        <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-[var(--chat-user-background)] px-4 py-2.5 text-sm leading-6 text-[var(--chat-user-foreground)] sm:max-w-[75%]">
          {message.content}
        </div>
        {onRemember && (
          <div className="flex gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => onRemember(message.content)}
              className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] text-[var(--foreground-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)]"
            >
              <BookmarkPlus size={13} /> Lembrar isto
            </button>
          </div>
        )}
      </div>
    );
  }

  const streaming = message.status === "streaming";
  const cited = message.citations.filter((citation) => citation.cited);
  const showNoSources = message.status === "complete" && message.citations.length === 0;

  return (
    <div className="animate-fade-up flex gap-3">
      <AIAvatar size="sm" active={streaming} />

      <div className="min-w-0 flex-1">
        {message.toolCalls.length > 0 && (
          <ul className="mb-2 flex flex-wrap gap-1.5" aria-label="Consultas ao computador">
            {message.toolCalls.map((call, index) => (
              <li
                key={index}
                title={call.error ?? JSON.stringify(call.arguments)}
                className={cx(
                  "animate-pop-in inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px]",
                  call.ok
                    ? "border-[var(--border)] text-[var(--foreground-secondary)]"
                    : "border-[var(--danger)]/30 text-[var(--danger)]",
                )}
              >
                <Monitor size={12} aria-hidden />
                {TOOL_LABELS[call.name] ?? call.name}
                {call.ok ? <Check size={12} aria-label="concluída" /> : <X size={12} aria-label="recusada" />}
              </li>
            ))}
          </ul>
        )}

        {message.notices?.map((notice) => (
          <p key={notice} className="mb-2 flex items-center gap-1.5 text-xs text-[var(--warning)]">
            <Info size={13} aria-hidden /> {notice}
          </p>
        ))}

        <div
          className={cx(
            "rounded-2xl rounded-tl-md border px-4 py-3 text-sm leading-7",
            message.status === "error"
              ? "border-[var(--danger)]/30 bg-[var(--danger)]/[0.05] text-[var(--foreground)]"
              : "border-[var(--border)] bg-[var(--chat-ai-background)] text-[var(--chat-ai-foreground)] shadow-[var(--shadow-sm)]",
          )}
        >
          {message.status === "error" ? (
            <div className="flex items-start gap-2.5">
              <CircleAlert size={17} className="mt-1 shrink-0 text-[var(--danger)]" aria-hidden />
              <div>
                <p className="font-medium">{message.content || "Não foi possível gerar a resposta."}</p>
                {message.hint && <p className="mt-1 text-[13px] leading-6 text-[var(--foreground-secondary)]">{message.hint}</p>}
              </div>
            </div>
          ) : message.content ? (
            <div className={cx("break-words", streaming && "streaming-caret")}>
              <Markdown text={message.content} onCite={message.citations.length ? showSource : undefined} />
            </div>
          ) : (
            <span className="flex h-7 items-center gap-1" role="status" aria-label="Gerando resposta">
              {[0, 1, 2].map((index) => (
                <span
                  key={index}
                  className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--foreground-muted)]"
                  style={{ animationDelay: `${index * 160}ms` }}
                />
              ))}
            </span>
          )}

          {message.status === "partial" && (
            <p className="mt-2 text-xs text-[var(--foreground-muted)]">Geração interrompida — resposta parcial salva.</p>
          )}
        </div>

        {/* Rodapé: fontes, aviso de ausência de fontes e ações */}
        {!streaming && (
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[var(--foreground-muted)]">
            {message.citations.length > 0 && (
              <button
                type="button"
                onClick={() => setSourcesOpen((open) => !open)}
                aria-expanded={sourcesOpen}
                className="flex items-center gap-1 rounded-md px-1 py-0.5 font-medium text-[var(--accent)] hover:bg-[var(--accent-soft)]"
              >
                <FileText size={12} aria-hidden />
                {cited.length > 0
                  ? `${cited.length} fonte(s) citada(s) · ${message.citations.length} consultada(s)`
                  : `${message.citations.length} trecho(s) consultado(s), nenhum citado`}
                <ChevronDown size={12} className={cx("transition-transform duration-200", sourcesOpen && "rotate-180")} />
              </button>
            )}
            {showNoSources && (
              <span className="flex items-center gap-1" title="Nenhum trecho dos seus documentos foi recuperado para esta pergunta.">
                <Info size={12} aria-hidden /> Sem fontes dos seus documentos — resposta baseada no modelo
              </span>
            )}
            {message.model && <span>{message.model}</span>}
            {message.content && message.status !== "error" && (
              <button
                type="button"
                onClick={copy}
                className="flex items-center gap-1 rounded-md px-1 py-0.5 hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)]"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copiado" : "Copiar"}
              </button>
            )}
            {onRetry && (message.status === "error" || message.status === "partial") && (
              <button
                type="button"
                onClick={onRetry}
                className="flex items-center gap-1 rounded-md px-1 py-0.5 hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)]"
              >
                <RotateCcw size={12} /> Tentar novamente
              </button>
            )}
          </div>
        )}

        {sourcesOpen && message.citations.length > 0 && (
          <ol className="animate-fade-up mt-2 flex flex-col gap-1.5">
            {message.citations.map((citation) => (
              <li
                key={citation.n}
                id={`fonte-${message.id}-${citation.n}`}
                className={cx(
                  "rounded-xl border p-3 text-xs transition-colors duration-300",
                  highlight === citation.n
                    ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                    : "border-[var(--border)] bg-[var(--background-secondary)]",
                )}
              >
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span
                    className={cx(
                      "inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-[10px] font-semibold",
                      citation.cited
                        ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                        : "bg-[var(--background-tertiary)] text-[var(--foreground-secondary)]",
                    )}
                  >
                    {citation.n}
                  </span>
                  <span className="font-medium text-[var(--foreground)]">{citation.document_name}</span>
                  {citation.location && <span className="text-[var(--foreground-muted)]">{citation.location}</span>}
                  <span className="rounded bg-[var(--background-tertiary)] px-1.5 text-[10px] text-[var(--foreground-muted)]">
                    {SCOPE_LABELS[citation.scope]}
                  </span>
                  {citation.url && (
                    <a
                      href={citation.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="ml-auto inline-flex items-center gap-1 text-[var(--accent)] hover:underline"
                    >
                      Abrir <ExternalLink size={11} aria-hidden />
                    </a>
                  )}
                </div>
                <p className="mt-1.5 line-clamp-3 leading-5 text-[var(--foreground-secondary)]">{citation.snippet}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
