import { ReactNode } from "react";
import { CircleAlert, LucideIcon } from "lucide-react";

import { cx } from "@/lib/format";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="animate-fade-up flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] px-6 py-12 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
        <Icon size={20} aria-hidden />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-[var(--foreground)]">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm leading-6 text-[var(--foreground-secondary)]">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, hint, action }: { message: string; hint?: string; action?: ReactNode }) {
  return (
    <div
      role="alert"
      className="animate-fade-up flex items-start gap-3 rounded-xl border border-[var(--danger)]/25 bg-[var(--danger)]/[0.06] p-4"
    >
      <CircleAlert size={18} className="mt-0.5 shrink-0 text-[var(--danger)]" aria-hidden />
      <div className="min-w-0 flex-1 text-sm">
        <p className="font-medium text-[var(--foreground)]">{message}</p>
        {hint && <p className="mt-1 leading-6 text-[var(--foreground-secondary)]">{hint}</p>}
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}

export function SkeletonRows({ rows = 3, className }: { rows?: number; className?: string }) {
  return (
    <div className={cx("flex flex-col gap-2", className)} aria-hidden>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="skeleton h-10" style={{ opacity: 1 - index * 0.2 }} />
      ))}
    </div>
  );
}

export function StatusDot({ state }: { state: "online" | "offline" | "warning" | "loading" }) {
  const color = {
    online: "bg-[var(--success)]",
    offline: "bg-[var(--danger)]",
    warning: "bg-[var(--warning)]",
    loading: "bg-[var(--foreground-muted)]",
  }[state];
  return (
    <span className="relative inline-flex h-2 w-2 shrink-0" aria-hidden>
      {state === "online" && (
        <span className={`absolute inset-0 rounded-full ${color} opacity-40 motion-safe:animate-ping`} style={{ animationIterationCount: 2 }} />
      )}
      <span className={`relative inline-flex h-2 w-2 rounded-full ${color}`} />
    </span>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)]">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={cx(
        "rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)] p-5 shadow-[var(--shadow-sm)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

export const inputClass =
  "w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--foreground-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]";
