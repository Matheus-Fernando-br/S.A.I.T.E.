"use client";

import { useState } from "react";
import AIAvatar from "./AIAvatar";
import ChatInput from "./ChatInput";
import { sendMessage } from "@/services/api";

interface Message {
  id: string;
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
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };

    setMessages((current) => [...current, userMessage]);

    setIsLoading(true);

    try {
      const response = await sendMessage(message);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
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
    <main
      className="
        flex h-screen min-w-0 flex-1
        flex-col
        bg-[var(--background)]
        transition-colors duration-200
      "
    >
      {/* CHAT CONTENT */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div
            className="
              flex h-full flex-col
              items-center justify-center
              px-6
            "
          >
            <AIAvatar size="lg" />

            <h1
              className="
                mt-6
                text-3xl
                font-semibold
                tracking-tight
                text-[var(--foreground)]
              "
            >
              Como posso ajudar?
            </h1>

            <p
              className="
                mt-3 max-w-md
                text-center
                text-sm leading-6
                text-[var(--foreground-secondary)]
              "
            >
              Converse comigo, pesquise informações, analise documentos ou
              explore seus projetos.
            </p>

            <div
              className="
                mt-8 grid w-full
                max-w-xl grid-cols-2 gap-3
              "
            >
              {[
                "Analise meu currículo",
                "Pesquise sobre IA",
                "Me ajude a programar",
                "Quero aprender algo",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSendMessage(suggestion)}
                  disabled={isLoading}
                  className="
                    rounded-xl
                    border
                    border-[var(--border)]
                    bg-[var(--background-secondary)]
                    px-4 py-3
                    text-left text-xs
                    text-[var(--foreground-secondary)]
                    transition
                    hover:border-[var(--border-hover)]
                    hover:bg-[var(--background-tertiary)]
                    hover:text-[var(--foreground)]
                    disabled:opacity-50
                  "
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="
              mx-auto max-w-3xl
              space-y-6
              px-6 py-8
            "
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`
                  flex gap-3
                  ${message.role === "user" ? "justify-end" : "justify-start"}
                `}
              >
                {message.role === "assistant" && <AIAvatar size="sm" />}

                <div
                  className={`
                    max-w-[75%]
                    rounded-2xl
                    px-4 py-3
                    text-sm leading-6
                    ${
                      message.role === "user"
                        ? "bg-[var(--chat-user-background)] text-[var(--chat-user-foreground)]"
                        : "border border-[var(--border)] bg-[var(--chat-ai-background)] text-[var(--chat-ai-foreground)]"
                    }
                  `}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div
                className="
                  flex items-center gap-3
                "
              >
                <AIAvatar size="sm" />

                <div
                  className="
                    rounded-2xl
                    border
                    border-[var(--border)]
                    bg-[var(--chat-ai-background)]
                    px-4 py-3
                  "
                >
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--foreground-muted)]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--foreground-muted)] [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--foreground-muted)] [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div
                className="
                  rounded-xl
                  border border-[var(--danger)]/20
                  bg-[var(--danger)]/5
                  px-4 py-3
                  text-xs
                  text-[var(--danger)]
                "
              >
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* INPUT */}
      <ChatInput onSend={handleSendMessage} />
    </main>
  );
}
