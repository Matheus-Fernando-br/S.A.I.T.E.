"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { ArrowUp, CircleAlert, FileText, LoaderCircle, Monitor, Paperclip, Plus, Square, X } from "lucide-react";

import { cx } from "@/lib/format";
import { KnowledgeDocument } from "@/services/api";

const ACCEPT = ".pdf,.txt,.md,.markdown,.csv,.html,.htm,.docx,.xlsx";

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  onAttach: (files: File[]) => void;
  onRemoveAttachment: (document: KnowledgeDocument) => void;
  attachments: KnowledgeDocument[];
  isStreaming: boolean;
  disabled?: boolean;
  disabledReason?: string;
  useComputer: boolean;
  onUseComputerChange: (value: boolean) => void;
  computerAvailable: boolean;
  computerHint?: string;
}

export default function ChatInput({
  onSend,
  onStop,
  onAttach,
  onRemoveAttachment,
  attachments,
  isStreaming,
  disabled = false,
  disabledReason,
  useComputer,
  onUseComputerChange,
  computerAvailable,
  computerHint,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Altura automática do campo (até ~8 linhas).
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [message]);

  // Fecha o menu se clicar fora dele ou apertar Esc
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    function handleKey(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") setIsMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  function submit() {
    if (!message.trim() || isStreaming || disabled) return;
    onSend(message.trim());
    setMessage("");
    setIsMenuOpen(false);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    submit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <div className="bg-gradient-to-t from-[var(--background)] via-[var(--background)] to-transparent px-3 pb-3 pt-2 sm:px-5 sm:pb-4">
      <div className="mx-auto max-w-3xl">
        {attachments.length > 0 && (
          <ul className="mb-2 flex flex-wrap gap-1.5" aria-label="Arquivos anexados a esta conversa">
            {attachments.map((document) => (
              <li
                key={document.id}
                title={document.error ?? undefined}
                className={cx(
                  "animate-pop-in flex max-w-[240px] items-center gap-1.5 rounded-lg border bg-[var(--background-secondary)] py-1 pl-2 pr-1 text-xs",
                  document.status === "error" ? "border-[var(--danger)]/40" : "border-[var(--border)]",
                )}
              >
                {document.status === "ready" ? (
                  <FileText size={13} className="shrink-0 text-[var(--accent)]" aria-hidden />
                ) : document.status === "error" ? (
                  <CircleAlert size={13} className="shrink-0 text-[var(--danger)]" aria-hidden />
                ) : (
                  <LoaderCircle size={13} className="shrink-0 animate-spin text-[var(--foreground-muted)]" aria-hidden />
                )}
                <span className="truncate text-[var(--foreground-secondary)]">{document.name}</span>
                <span className="sr-only">
                  {document.status === "ready" ? "pronto" : document.status === "error" ? `erro: ${document.error}` : "processando"}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveAttachment(document)}
                  aria-label={`Remover ${document.name}`}
                  className="rounded p-0.5 text-[var(--foreground-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)]"
                >
                  <X size={12} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <form
          onSubmit={handleSubmit}
          className={cx(
            "relative flex items-end gap-1.5 rounded-2xl border bg-[var(--input-background)] p-1.5 shadow-[var(--shadow-md)] transition-[border-color,box-shadow] duration-200",
            "border-[var(--input-border)] focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_3px_var(--accent-soft),var(--shadow-md)]",
          )}
        >
          {/* BOTÃO "+" E MENU */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label="Anexar e ferramentas"
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
              className={cx(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[var(--foreground-secondary)] transition-[background-color,color,transform] duration-200 hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)]",
                isMenuOpen && "rotate-45 bg-[var(--sidebar-hover)] text-[var(--foreground)]",
              )}
            >
              <Plus size={19} strokeWidth={2} />
            </button>

            {isMenuOpen && (
              <div
                role="menu"
                className="animate-pop-in absolute bottom-12 left-0 z-50 flex w-64 flex-col gap-0.5 rounded-2xl border border-[var(--sidebar-border)] bg-[var(--background-secondary)] p-1.5 shadow-[var(--shadow-lg)]"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsMenuOpen(false);
                    fileRef.current?.click();
                  }}
                  className="flex items-start gap-3 rounded-xl px-3 py-2.5 text-left text-xs text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)]"
                >
                  <Paperclip size={16} strokeWidth={1.8} className="mt-0.5 shrink-0" />
                  <span>
                    <span className="block font-medium text-[var(--foreground)]">Anexar arquivos</span>
                    Usados apenas nesta conversa (PDF, DOCX, TXT, MD, CSV, XLSX, HTML)
                  </span>
                </button>
                <button
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={useComputer}
                  disabled={!computerAvailable}
                  onClick={() => onUseComputerChange(!useComputer)}
                  className="flex items-start gap-3 rounded-xl px-3 py-2.5 text-left text-xs text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)] disabled:opacity-50"
                >
                  <Monitor size={16} strokeWidth={1.8} className="mt-0.5 shrink-0" />
                  <span className="flex-1">
                    <span className="block font-medium text-[var(--foreground)]">Usar computador</span>
                    {computerAvailable
                      ? "Permite consultas de leitura ao agente local, dentro das permissões"
                      : computerHint || "Agente local desconectado"}
                  </span>
                  <span
                    className={cx(
                      "mt-0.5 flex h-4 w-7 shrink-0 items-center rounded-full p-0.5 transition-colors",
                      useComputer ? "bg-[var(--accent)]" : "bg-[var(--border-hover)]",
                    )}
                    aria-hidden
                  >
                    <span
                      className={cx(
                        "h-3 w-3 rounded-full bg-white shadow transition-transform duration-200",
                        useComputer && "translate-x-3",
                      )}
                    />
                  </span>
                </button>
              </div>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            multiple
            accept={ACCEPT}
            className="hidden"
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              if (files.length) onAttach(files);
              event.target.value = "";
            }}
          />

          {/* CAMPO */}
          <label htmlFor="chat-message" className="sr-only">
            Mensagem para a IA
          </label>
          <textarea
            id="chat-message"
            ref={textareaRef}
            rows={1}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? disabledReason : "Converse com SAITE…"}
            disabled={disabled}
            maxLength={10000}
            className="max-h-[200px] min-w-0 flex-1 resize-none bg-transparent px-2 py-2.5 text-sm leading-6 text-[var(--foreground)] outline-none placeholder:text-[var(--foreground-muted)] disabled:cursor-not-allowed"
          />

          {useComputer && (
            <button
              type="button"
              onClick={() => onUseComputerChange(false)}
              title="Acesso ao computador ativado para as próximas mensagens. Clique para desativar."
              className="animate-pop-in mb-1.5 hidden h-7 shrink-0 items-center gap-1 rounded-lg bg-[var(--accent-soft)] px-2 text-[11px] font-medium text-[var(--accent)] sm:flex"
            >
              <Monitor size={12} /> Computador <X size={11} />
            </button>
          )}

          {/* ENVIAR / PARAR */}
          {isStreaming ? (
            <button
              type="button"
              onClick={onStop}
              aria-label="Parar geração"
              title="Parar geração"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--foreground)] text-[var(--background)] transition-transform duration-150 active:scale-95"
            >
              <Square size={14} fill="currentColor" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!message.trim() || disabled}
              aria-label="Enviar mensagem"
              title="Enviar (Enter)"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] transition-[transform,opacity,background-color] duration-150 hover:bg-[var(--accent-hover)] active:scale-95 disabled:opacity-30"
            >
              <ArrowUp size={19} strokeWidth={2.2} />
            </button>
          )}
        </form>

        {/* AVISO */}
        <p className="mt-2 text-center text-[11px] text-[var(--foreground-muted)]">
          IA local: pode cometer erros. Verifique informações importantes. Enter envia · Shift+Enter quebra linha.
        </p>
      </div>
    </div>
  );
}
