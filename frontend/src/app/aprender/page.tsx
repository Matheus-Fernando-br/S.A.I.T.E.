"use client";

import { RefreshCw, Search } from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";

import KnowledgeManager from "@/components/KnowledgeManager";
import Button from "@/components/ui/Button";
import { Card, inputClass, PageHeader } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { errorMessage } from "@/lib/format";
import { Citation, getKnowledgeStats, KnowledgeStats, reindexKnowledge, searchKnowledge } from "@/services/api";

export default function LearnPage() {
  const { notify } = useToast();
  const [stats, setStats] = useState<KnowledgeStats | null>(null);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<(Citation & { content: string })[] | null>(null);
  const [searchInfo, setSearchInfo] = useState<{ vector: boolean; error: string | null } | null>(null);
  const [reindexing, setReindexing] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      setStats(await getKnowledgeStats());
    } catch {
      setStats(null);
    }
  }, []);

  useEffect(() => {
    const first = window.setTimeout(() => void loadStats(), 0);
    return () => window.clearTimeout(first);
  }, [loadStats]);

  async function runSearch(event: FormEvent) {
    event.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const data = await searchKnowledge(query.trim());
      setResults(data.results);
      setSearchInfo(data.info);
    } catch (error) {
      notify("error", errorMessage(error));
    } finally {
      setSearching(false);
    }
  }

  async function reindex() {
    setReindexing(true);
    try {
      const { scheduled } = await reindexKnowledge();
      notify("success", `${scheduled} documento(s) enviados para reindexação.`);
      await loadStats();
    } catch (error) {
      notify("error", errorMessage(error));
    } finally {
      setReindexing(false);
    }
  }

  const tiles = stats
    ? [
        { label: "Documentos", value: stats.documents },
        { label: "Indexados", value: stats.ready },
        { label: "Trechos", value: stats.chunks },
        { label: "Em processamento", value: stats.processing },
      ]
    : [];

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        <PageHeader
          title="Aprender"
          description="Ensine a IA com seus arquivos e links. O conteúdo é extraído, dividido em trechos e indexado localmente; nas conversas, os trechos relevantes são recuperados e citados. Isso não altera o modelo — é uma base consultável que você controla."
        />

        {stats && (
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {tiles.map((tile, index) => (
              <div
                key={tile.label}
                style={{ animationDelay: `${index * 40}ms` }}
                className="animate-fade-up rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)] p-4"
              >
                <dt className="text-xs text-[var(--foreground-muted)]">{tile.label}</dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums text-[var(--foreground)]">{tile.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {stats && stats.stale > 0 && (
          <div
            role="status"
            className="animate-fade-up flex flex-col gap-3 rounded-xl border border-[var(--warning)]/30 bg-[var(--warning)]/[0.07] p-4 text-sm sm:flex-row sm:items-center"
          >
            <p className="flex-1 text-[var(--foreground)]">
              {stats.stale} documento(s) foram indexados com outro modelo de embeddings (ou sem embeddings) e só aparecem na busca
              por palavras.
            </p>
            <Button size="sm" variant="primary" loading={reindexing} onClick={() => void reindex()}>
              <RefreshCw size={13} /> Reindexar
            </Button>
          </div>
        )}

        <section aria-labelledby="global-title" className="flex flex-col gap-3">
          <h2 id="global-title" className="text-sm font-semibold text-[var(--foreground)]">
            Conhecimento global
            <span className="ml-2 font-normal text-[var(--foreground-muted)]">
              usado em todas as conversas · conhecimento de projeto fica em Projetos · anexos do chat valem só para a conversa
            </span>
          </h2>
          <KnowledgeManager scope="global" onChanged={loadStats} />
        </section>

        <Card>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
            <Search size={15} className="text-[var(--accent)]" aria-hidden /> Testar recuperação
          </h2>
          <p className="mt-1 text-xs leading-5 text-[var(--foreground-secondary)]">
            Veja quais trechos a IA receberia para uma pergunta (sem gerar resposta). Útil para conferir se um documento foi bem
            indexado.
          </p>
          <form onSubmit={runSearch} className="mt-3 flex gap-2">
            <label htmlFor="search-query" className="sr-only">
              Pergunta de teste
            </label>
            <input
              id="search-query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ex.: qual é o prazo de garantia?"
              className={inputClass}
            />
            <Button type="submit" loading={searching} disabled={!query.trim()}>
              Buscar
            </Button>
          </form>
          {results && (
            <div className="mt-4">
              <p className="mb-2 text-xs text-[var(--foreground-muted)]">
                {results.length} trecho(s) · busca {searchInfo?.vector ? "híbrida (semântica + palavras)" : "só por palavras"}
                {searchInfo?.error && ` · ${searchInfo.error}`}
              </p>
              {results.length === 0 ? (
                <p className="text-sm text-[var(--foreground-secondary)]">
                  Nada relevante encontrado — nesse caso a IA informa que não achou a resposta nos seus documentos.
                </p>
              ) : (
                <ol className="flex flex-col gap-2">
                  {results.map((result) => (
                    <li key={result.chunk_id} className="animate-fade-up rounded-xl border border-[var(--border)] p-3 text-xs">
                      <p className="font-medium text-[var(--foreground)]">
                        [{result.n}] {result.document_name}
                        {result.location && <span className="font-normal text-[var(--foreground-muted)]"> · {result.location}</span>}
                        {result.similarity !== null && (
                          <span className="ml-2 font-normal text-[var(--foreground-muted)]">
                            similaridade {result.similarity.toFixed(2)}
                          </span>
                        )}
                      </p>
                      <p className="mt-1 line-clamp-3 leading-5 text-[var(--foreground-secondary)]">{result.content}</p>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
