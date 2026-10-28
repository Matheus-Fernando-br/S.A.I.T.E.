import { Fragment, ReactNode } from "react";

/**
 * Renderizador mínimo de Markdown para respostas do modelo.
 * Gera elementos React (nunca HTML bruto), então conteúdo vindo do modelo ou
 * de documentos não consegue injetar scripts. Suporta parágrafos, títulos,
 * listas, blocos de código, código inline, negrito, itálico e citações [n].
 */

function inline(text: string, keyPrefix: string, onCite?: (n: number) => void): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(`[^`\n]+`|\*\*[^*\n]+\*\*|\*[^*\n]+\*|\[(\d+(?:\s*,\s*\d+)*)\])/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let index = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${index++}`;
    if (token.startsWith("`")) {
      nodes.push(
        <code key={key} className="rounded-md bg-[var(--background-tertiary)] px-1.5 py-0.5 font-mono text-[0.85em]">
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("**")) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*")) {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    } else if (match[2] && onCite) {
      const numbers = match[2].split(/\s*,\s*/).map(Number);
      nodes.push(
        <Fragment key={key}>
          {numbers.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onCite(n)}
              aria-label={`Ver fonte ${n}`}
              className="mx-0.5 inline-flex h-[1.15rem] min-w-[1.15rem] -translate-y-px items-center justify-center rounded-md bg-[var(--accent-soft)] px-1 align-middle text-[0.7rem] font-semibold text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
            >
              {n}
            </button>
          ))}
        </Fragment>,
      );
    } else {
      nodes.push(token);
    }
    last = match.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export default function Markdown({ text, onCite }: { text: string; onCite?: (n: number) => void }) {
  const blocks: ReactNode[] = [];
  const lines = text.split("\n");
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim().startsWith("```")) {
      const language = line.trim().slice(3).trim();
      const code: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        code.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push(
        <pre
          key={key++}
          className="my-3 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--background-tertiary)] p-3.5 text-[0.82rem] leading-6"
        >
          {language && <div className="mb-2 text-[0.7rem] uppercase tracking-wide text-[var(--foreground-muted)]">{language}</div>}
          <code className="font-mono">{code.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      blocks.push(
        <p key={key++} className="mb-1.5 mt-4 font-semibold first:mt-0">
          {inline(heading[2], `h${key}`, onCite)}
        </p>,
      );
      i += 1;
      continue;
    }

    if (/^\s*([-*•]|\d+[.)])\s+/.test(line)) {
      const ordered = /^\s*\d+[.)]/.test(line);
      const items: string[] = [];
      while (i < lines.length && /^\s*([-*•]|\d+[.)])\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*([-*•]|\d+[.)])\s+/, ""));
        i += 1;
      }
      const List = ordered ? "ol" : "ul";
      blocks.push(
        <List key={key++} className={`my-2 space-y-1 pl-5 ${ordered ? "list-decimal" : "list-disc"} marker:text-[var(--foreground-muted)]`}>
          {items.map((item, index) => (
            <li key={index}>{inline(item, `l${key}-${index}`, onCite)}</li>
          ))}
        </List>,
      );
      continue;
    }

    if (!line.trim()) {
      i += 1;
      continue;
    }

    const paragraph: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("```") &&
      !/^(#{1,4})\s+/.test(lines[i]) &&
      !/^\s*([-*•]|\d+[.)])\s+/.test(lines[i])
    ) {
      paragraph.push(lines[i]);
      i += 1;
    }
    blocks.push(
      <p key={key++} className="my-2 first:mt-0 last:mb-0">
        {paragraph.map((part, index) => (
          <Fragment key={index}>
            {index > 0 && <br />}
            {inline(part, `p${key}-${index}`, onCite)}
          </Fragment>
        ))}
      </p>,
    );
  }

  return <>{blocks}</>;
}
