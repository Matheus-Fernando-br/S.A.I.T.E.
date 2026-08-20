"use client";

import { FormEvent, useState } from "react";
import { Mic, Send, AudioLines } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    onSend(message);
    setMessage("");
  }

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
        {/* INPUT */}
        <form
          onSubmit={handleSubmit}
          className="
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
          {/* CAMPO */}
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Converse com Athena..."
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
            title="Falar com Athena"
          >
            <Mic size={19} strokeWidth={1.8} />
          </button>

          {/* ENVIAR */}
          <button
            type="submit"
            disabled={!message.trim()}
            className="
              flex h-10 w-10
              shrink-0
              items-center justify-center
              rounded-xl
              bg-[var(--foreground)]
              text-[var(--background)]
              transition-all duration-200
              hover:scale-105
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
            title="Enviar mensagem"
          >
            <Send size={17} strokeWidth={2} />
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
