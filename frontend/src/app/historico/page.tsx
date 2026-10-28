"use client";

import { Archive, ArchiveRestore, History, MessageCircle, Pencil, Pin, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useApp } from "@/components/AppProvider";
import Button from "@/components/ui/Button";
import { EmptyState, ErrorState, inputClass, PageHeader, SkeletonRows } from "@/components/ui/States";
import { useConversationActions } from "@/components/useConversationActions";
import { cx, errorMessage, formatDateTime, formatRelative } from "@/lib/format";
import { Conversation, getConversations } from "@/services/api";

export default function HistoryPage() {
  const { bumpHistory, historyVersion } = useApp();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [archived, setArchived] = useState(false);
  const [conversations, setConversations] = useState<Conversation[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  const { actions, dialogs } = useConversationActions(() => {
    bumpHistory();
    setReload((value) => value + 1);
  });

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getConversations({ allProjects: true, archived, query: debounced || undefined, limit: 300 });
        if (!cancelled) {
          setConversations(data);
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) setError(errorMessage(loadError));
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [debounced, archived, reload, historyVersion]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex max-w-4xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
        <PageHeader
          title="Histórico"
          description="Todas as conversas, gerais e de projetos. A busca procura nos títulos e no conteúdo das mensagens."
        />

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" aria-hidden />
            <label htmlFor="history-search" className="sr-only">
              Pesquisar no histórico
            </label>
            <input
              id="history-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Pesquisar conversas…"
              className={`${inputClass} pl-9`}
            />
          </div>
          <div role="tablist" aria-label="Filtro" className="flex rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] p-1">
            {[
              { label: "Ativas", value: false },
              { label: "Arquivadas", value: true },
            ].map((tab) => (
              <button
                key={tab.label}
                type="button"
                role="tab"
                aria-selected={archived === tab.value}
                onClick={() => setArchived(tab.value)}
                className={cx(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-150",
                  archived === tab.value
                    ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "text-[var(--foreground-secondary)] hover:text-[var(--foreground)]",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <ErrorState message="Não foi possível carregar o histórico." hint={error} />
        ) : conversations === null ? (
          <SkeletonRows rows={5} />
        ) : conversations.length === 0 ? (
          <EmptyState
            icon={debounced ? Search : History}
            title={debounced ? "Nada encontrado" : archived ? "Nenhuma conversa arquivada" : "Nenhuma conversa ainda"}
            description={debounced ? `Nenhuma conversa contém “${debounced}”.` : undefined}
          />
        ) : (
          <ul className="flex flex-col divide-y divide-[var(--border)] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)]">
            {conversations.map((conversation) => (
              <li key={conversation.id} className="animate-fade-in flex items-center gap-3 px-4 py-3">
                <Link href={`/?c=${conversation.id}`} className="group flex min-w-0 flex-1 items-center gap-3">
                  {conversation.pinned ? (
                    <Pin size={15} className="shrink-0 text-[var(--accent)]" aria-label="Fixada" />
                  ) : (
                    <MessageCircle size={15} className="shrink-0 text-[var(--foreground-muted)]" aria-hidden />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--accent)]">
                      {conversation.title}
                    </span>
                    <span className="mt-0.5 flex gap-2 text-xs text-[var(--foreground-muted)]">
                      <span title={formatDateTime(conversation.updated_at)}>{formatRelative(conversation.updated_at)}</span>
                      {conversation.project_name && <span>· {conversation.project_name}</span>}
                    </span>
                  </span>
                </Link>
                <div className="flex shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => void actions.togglePin(conversation)} aria-label={conversation.pinned ? "Desafixar" : "Fixar"} title={conversation.pinned ? "Desafixar" : "Fixar"}>
                    <Pin size={13} />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => actions.rename(conversation)} aria-label="Renomear" title="Renomear">
                    <Pencil size={13} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => void actions.toggleArchive(conversation)}
                    aria-label={conversation.archived ? "Restaurar" : "Arquivar"}
                    title={conversation.archived ? "Restaurar" : "Arquivar"}
                  >
                    {conversation.archived ? <ArchiveRestore size={13} /> : <Archive size={13} />}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => actions.remove(conversation)} aria-label="Excluir" title="Excluir">
                    <Trash2 size={13} className="text-[var(--danger)]" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {dialogs}
    </div>
  );
}
