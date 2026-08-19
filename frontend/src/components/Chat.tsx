"use client";

import { useState } from "react";
import AIAvatar from "./AIAvatar";
import ChatInput from "./ChatInput";
import { sendMessage } from "@/services/api";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  async function handleSendMessage(message: string) {
    if (!message.trim() || isLoading) {
      return;
    }

    setError(null);

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: message,
    };

    setMessages((current) => [...current, userMessage]);

    setIsLoading(true);

    try {
      const response = await sendMessage(message);

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: response,
      };

      setMessages((current) => [...current, assistantMessage]);
    } catch (error) {
      console.error(error);

      setError("Não foi possível conectar ao servidor.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-6">
            <AIAvatar size="lg" />

            <h1 className="mt-6 text-2xl font-semibold">Como posso ajudar?</h1>

            <p className="mt-2 max-w-md text-center text-sm leading-6 text-zinc-500">
              Converse comigo, analise seu currículo, pesquise informações ou
              consulte seu computador.
            </p>

            <div className="mt-8 grid max-w-xl grid-cols-2 gap-3">
              {[
                "Analise meu currículo",
                "Como está meu PC?",
                "Pesquise sobre IA",
                "Me ajude a programar",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSendMessage(suggestion)}
                  disabled={isLoading}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-left text-xs text-zinc-400 transition hover:border-white/15 hover:bg-white/[0.05] hover:text-white disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && <AIAvatar size="sm" />}

                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "bg-white text-black"
                      : "border border-white/[0.08] bg-white/[0.03] text-zinc-300"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-3">
                <AIAvatar size="sm" />

                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-500" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-500 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-500 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-400">
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      <ChatInput onSend={handleSendMessage} />
    </div>
  );
}
