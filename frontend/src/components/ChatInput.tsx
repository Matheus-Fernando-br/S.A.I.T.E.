"use client";

import { FormEvent, useState, useRef, useEffect } from "react";
import {
  Mic,
  Send,
  AudioLines,
  Plus,
  Paperclip,
  HardDrive,
  Ellipsis,
  ChevronRight,
} from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    onSend(message);
    setMessage("");
    setIsMenuOpen(false);
  }

  // Fecha o menu se clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="
        border-t
        border-[var(--border)]
        bg-[var(--background)]
        px-5 pb-5 pt-4
      "
    >
      {/* LINHA PRINCIPAL: INPUT CENTRALIZADO + BOTÃO DE VOZ À DIREITA */}
      <div
        className="
          mx-auto
          flex
          max-w-3xl
          items-center
          gap-6
        "
      >
        {/* INPUT COM O BOTÃO "+" À ESQUERDA */}
        <form
          onSubmit={handleSubmit}
          className="
            relative
            flex
            flex-1
            items-center
            gap-2
            rounded-2xl
            border
            border-[var(--input-border)]
            bg-[var(--input-background)]
            p-2
            shadow-lg
            transition-all duration-200
            focus-within:border-[var(--border-hover)]
          "
        >
          {/* BOTÃO "+" E MINI MODAL */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`
                flex h-10 w-10
                shrink-0
                items-center justify-center
                rounded-xl
                text-[var(--foreground-secondary)]
                transition-all duration-200
                hover:bg-[var(--sidebar-hover)]
                hover:text-[var(--foreground)]
                ${isMenuOpen ? "bg-[var(--sidebar-hover)] text-[var(--foreground)] rotate-45" : ""}
              `}
              title="Mais opções"
            >
              <Plus
                size={19}
                strokeWidth={2}
                className="transition-transform duration-200"
              />
            </button>

            {/* MINI MODAL FLUTUANTE */}
            {isMenuOpen && (
              <div
                className="
                  absolute
                  bottom-14
                  left-0
                  z-50
                  w-58
                  flex
                  flex-col
                  gap-1
                  rounded-2xl
                  border
                  border-[var(--sidebar-border)]
                  bg-[var(--background-tertiary)]
                  p-1.5
                  shadow-xl
                  backdrop-blur-md
                  animate-in fade-in zoom-in-95 duration-150
                "
              >
                <button
                  type="button"
                  onClick={() => {
                    alert("Anexar Arquivos clicado");
                    setIsMenuOpen(false);
                  }}
                  className="
                    flex items-center gap-3
                    rounded-xl
                    px-3 py-2.5
                    text-xs
                    text-[var(--foreground-secondary)]
                    transition-all duration-200
                    hover:bg-[var(--sidebar-hover)]
                    hover:text-[var(--foreground)]
                  "
                >
                  <Paperclip size={16} strokeWidth={1.8} />
                  <span>Anexar Arquivos</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    alert("Adicionar do Drive clicado");
                    setIsMenuOpen(false);
                  }}
                  className="
                    flex items-center gap-3
                    rounded-xl
                    px-3 py-2.5
                    text-xs
                    text-[var(--foreground-secondary)]
                    transition-all duration-200
                    hover:bg-[var(--sidebar-hover)]
                    hover:text-[var(--foreground)]
                  "
                >
                  <HardDrive size={16} strokeWidth={1.8} />
                  <span>Adicionar do Drive</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    alert("Mais Ferramentas clicado");
                    setIsMenuOpen(false);
                  }}
                  className="
                    flex items-center gap-3
                    rounded-xl
                    px-3 py-2.5
                    text-xs
                    text-[var(--foreground-secondary)]
                    transition-all duration-200
                    hover:bg-[var(--sidebar-hover)]
                    hover:text-[var(--foreground)]
                  "
                >
                  <Ellipsis size={16} strokeWidth={1.8} />
                  <span>Mais Ferramentas</span>
                  <ChevronRight size={16} strokeWidth={1.8} />
                </button>
              </div>
            )}
          </div>

          {/* CAMPO */}
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Converse com SAITE..."
            className="
              min-w-0
              flex-1
              bg-transparent
              px-3
              py-3
              text-sm
              text-[var(--foreground)]
              outline-none
              placeholder:text-[var(--foreground-muted)]
            "
          />

          {/* MICROFONE (INTERNO DO INPUT) */}
          <button
            type="button"
            className="
              flex h-10 w-10
              shrink-0
              items-center justify-center
              rounded-xl
              text-[var(--foreground-secondary)]
              transition-all duration-200
              hover:bg-[var(--sidebar-hover)]
              hover:text-[var(--foreground)]
            "
            title="Falar com SAITE"
          >
            <Mic size={19} strokeWidth={1.8} />
          </button>

          {/* ENVIAR */}
          <button
            type="submit"
            disabled={!message.trim()}
            className="
              flex h-12 w-12
              shrink-0
              items-center justify-center
              rounded-xl
              bg-[var(--foreground)]
              text-[var(--background)]
              transition-all duration-200
              hover:scale-110
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
            title="Enviar mensagem"
          >
            <Send size={25} strokeWidth={2} />
          </button>
        </form>

        {/* BOTÃO DE CONVERSAR POR VOZ (NA MESMA LINHA, À DIREITA) */}
        <button
          type="button"
          className="
            group
            flex
            shrink-0
            items-center
            gap-2
            rounded-2xl
            border
            border-[var(--input-border)]
            bg-[var(--input-background)]
            px-4
            py-3.5
            text-xs
            font-medium
            text-[var(--foreground-secondary)]
            shadow-lg
            transition-all duration-200
            hover:border-[var(--border-hover)]
            hover:bg-[var(--sidebar-hover)]
            hover:text-[var(--foreground)]
          "
          title="Conversar por voz"
        >
          <AudioLines
            size={20}
            strokeWidth={1.8}
            className="
              transition-transform duration-200
              group-hover:scale-110
            "
          />
          <span className="hidden sm:inline">Voz</span>
        </button>
      </div>

      {/* AVISO */}
      <p
        className="
          mt-2
          text-center
          text-[10px]
          text-[var(--foreground-muted)]
        "
      >
        A IA pode cometer erros. Verifique informações importantes.
      </p>
    </div>
  );
}
