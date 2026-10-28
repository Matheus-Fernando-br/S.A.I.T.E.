"use client";

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { CircleAlert, CircleCheck, Info, X } from "lucide-react";

type ToastKind = "success" | "error" | "info";

interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
  hint?: string;
}

interface ToastContextValue {
  notify: (kind: ToastKind, message: string, hint?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const icons = { success: CircleCheck, error: CircleAlert, info: Info };
const colors = {
  success: "text-[var(--success)]",
  error: "text-[var(--danger)]",
  info: "text-[var(--accent)]",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    (kind: ToastKind, message: string, hint?: string) => {
      const id = Date.now() + Math.random();
      setToasts((current) => [...current.slice(-3), { id, kind, message, hint }]);
      window.setTimeout(() => dismiss(id), kind === "error" ? 8000 : 4000);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[200] flex w-[min(92vw,380px)] flex-col gap-2"
        role="region"
        aria-label="Notificações"
      >
        {toasts.map((toast) => {
          const Icon = icons[toast.kind];
          return (
            <div
              key={toast.id}
              role={toast.kind === "error" ? "alert" : "status"}
              className="animate-pop-in pointer-events-auto flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] p-3.5 shadow-[var(--shadow-md)]"
            >
              <Icon size={18} className={`mt-0.5 shrink-0 ${colors[toast.kind]}`} aria-hidden />
              <div className="min-w-0 flex-1 text-sm">
                <p className="text-[var(--foreground)]">{toast.message}</p>
                {toast.hint && <p className="mt-1 text-xs leading-5 text-[var(--foreground-secondary)]">{toast.hint}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Fechar notificação"
                className="rounded-md p-0.5 text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast deve ser usado dentro de ToastProvider");
  return context;
}
