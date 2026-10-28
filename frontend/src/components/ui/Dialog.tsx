"use client";

import { ReactNode, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import Button from "./Button";

interface DialogProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  onClose: () => void;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}

const widths = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-3xl" };

/** Diálogo modal acessível: foco inicial, Esc para fechar, foco preso e devolvido ao fechar. */
export default function Dialog({ open, title, description, onClose, children, footer, size = "md" }: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const focusable = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
    (panel?.querySelector<HTMLElement>("[data-autofocus]") ?? focusable()[0])?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      } else if (event.key === "Tab") {
        const items = focusable();
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div
        className="animate-fade-in absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={`animate-pop-in relative flex max-h-[90vh] w-full ${widths[size]} flex-col overflow-hidden rounded-t-2xl border border-[var(--border)] bg-[var(--background-secondary)] shadow-[var(--shadow-lg)] sm:rounded-2xl`}
      >
        <div className="flex items-start justify-between gap-4 px-5 pb-2 pt-5">
          <div>
            <h2 id={titleId} className="text-base font-semibold text-[var(--foreground)]">
              {title}
            </h2>
            {description && (
              <div id={descriptionId} className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
                {description}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="-mr-1 rounded-lg p-1.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)]"
          >
            <X size={18} />
          </button>
        </div>
        {children && <div className="overflow-y-auto px-5 py-3">{children}</div>}
        {footer && (
          <div className="flex flex-wrap justify-end gap-2 border-t border-[var(--border)] px-5 py-4">{footer}</div>
        )}
      </div>
    </div>,
    document.body,
  );
}

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  danger?: boolean;
  /** Se definido, o usuário precisa digitar exatamente este texto para confirmar. */
  requireText?: string;
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  danger = false,
  requireText,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const blocked = requireText !== undefined && typed !== requireText;

  async function confirm() {
    if (blocked) return;
    setBusy(true);
    try {
      await onConfirm();
      setTyped("");
      onClose();
    } catch {
      // Mantém o diálogo aberto; quem chamou já informou o erro.
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      title={title}
      description={description}
      onClose={() => {
        setTyped("");
        onClose();
      }}
      size="sm"
      footer={
        <>
          <Button onClick={onClose} disabled={busy}>
            Cancelar
          </Button>
          <Button variant={danger ? "danger" : "primary"} onClick={confirm} loading={busy} disabled={blocked}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {requireText !== undefined && (
        <label className="block text-sm text-[var(--foreground-secondary)]">
          Digite <strong className="text-[var(--foreground)]">{requireText}</strong> para confirmar:
          <input
            data-autofocus
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && void confirm()}
            className="mt-2 w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
          />
        </label>
      )}
    </Dialog>
  );
}

interface PromptDialogProps {
  open: boolean;
  title: string;
  label: string;
  initialValue?: string;
  confirmLabel?: string;
  maxLength?: number;
  onSubmit: (value: string) => Promise<void> | void;
  onClose: () => void;
}

export function PromptDialog({
  open,
  title,
  label,
  initialValue = "",
  confirmLabel = "Salvar",
  maxLength = 200,
  onSubmit,
  onClose,
}: PromptDialogProps) {
  const [value, setValue] = useState(initialValue);
  const [busy, setBusy] = useState(false);
  const [lastInitial, setLastInitial] = useState(initialValue);

  // Reinicia o campo quando o diálogo é reaberto com outro valor inicial.
  if (initialValue !== lastInitial) {
    setLastInitial(initialValue);
    setValue(initialValue);
  }

  async function submit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    setBusy(true);
    try {
      await onSubmit(trimmed);
      onClose();
    } catch {
      // Mantém o diálogo aberto; quem chamou já informou o erro.
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      title={title}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button onClick={onClose} disabled={busy}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={submit} loading={busy} disabled={!value.trim()}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <label className="block text-sm text-[var(--foreground-secondary)]">
        {label}
        <input
          data-autofocus
          value={value}
          maxLength={maxLength}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && void submit()}
          className="mt-2 w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
        />
      </label>
    </Dialog>
  );
}
