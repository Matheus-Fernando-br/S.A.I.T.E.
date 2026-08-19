"use client";

import { FormEvent, useState } from "react";
import { Mic, Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!message.trim()) return;

    onSend(message);
    setMessage("");
  }

  return (
    <div className="border-t border-white/[0.06] p-5">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-3xl items-center gap-2 rounded-2xl border border-white/10 bg-[#111218] p-2 shadow-2xl"
      >
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Converse com Athena..."
          className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-600"
        />

        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-white/[0.06] hover:text-white"
          title="Falar"
        >
          <Mic size={19} />
        </button>

        <button
          type="submit"
          disabled={!message.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-30"
          title="Enviar"
        >
          <Send size={18} />
        </button>
      </form>

      <p className="mt-3 text-center text-[10px] text-zinc-600">
        A IA pode cometer erros. Verifique informações importantes.
      </p>
    </div>
  );
}
