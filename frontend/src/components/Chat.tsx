"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { History, Settings } from "lucide-react";

import ChatInput from "./ChatInput";
import AIAvatar from "./AIAvatar";

import { createConversation, getMessages, sendMessage } from "@/services/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatProps {
  conversationId: string | null;
  onConversationCreated: (conversationId: string) => void;
}

export default function Chat({
  conversationId,
  onConversationCreated,
}: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carrega as mensagens da conversa selecionada
  useEffect(() => {
    let cancelled = false;

    async function loadMessages() {
      if (!conversationId) {
        setMessages([]);
        return;
      }

      try {
        setError(null);

        const data = await getMessages(conversationId);

        if (!cancelled) {
          setMessages(
            data.map((message) => ({
              id: message.id,
              role: message.role,
              content: message.content,
            })),
          );
        }
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error);

        if (!cancelled) {
          setMessages([]);
          setError("Não foi possível carregar a conversa.");
        }
      }
    }

    void loadMessages();

    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  async function handleSendMessage(message: string) {
    if (!message.trim() || isLoading) {
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      /*
       * Se ainda não existe conversa, cria automaticamente.
       */
      let activeConversationId = conversationId;

      if (!activeConversationId) {
        const conversation = await createConversation();

        activeConversationId = conversation.id;

        onConversationCreated(conversation.id);
      }

      /*
       * Mostra imediatamente a mensagem do usuário na tela.
       */
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: message,
      };

      setMessages((current) => [...current, userMessage]);

      /*
       * Envia para o backend.
       */
      const response = await sendMessage(activeConversationId, message);

      /*
       * Adiciona a resposta da IA.
       */
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response,
      };

      setMessages((current) => [...current, assistantMessage]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);

      setError("Não foi possível conectar ao servidor.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main
      className="
     relative
     flex h-screen min-w-0
     flex-1 flex-col
     bg-[var(--background)]
     transition-colors duration-200
   "
    >
      {/* LOGO */}
      <div
        className="
      absolute
      left-6
      top-5
      z-20
      flex
      items-center
    "
      >
        <Image
          src="/assets/LOGO.png"
          alt="SAITE"
          width={120}
          height={40}
          className="h-12 w-auto object-contain"
        />
      </div>
      {/* AÇÕES */}
      <div
        className="
      absolute
      right-6
      top-5
      z-20
      flex
      items-start
      gap-5
    "
      >
        <button
          type="button"
          title="Histórico"
          className="
        group
        flex
        min-w-[52px]
        flex-col
        items-center
        justify-center
        gap-1.5
        bg-[var(--background)]
        text-[var(--foreground-secondary)]
        transition-all duration-200
        hover:text-[var(--foreground)]
      "
        >
          <History
            size={19}
            strokeWidth={1.8}
            className="transition-transform duration-200 group-hover:scale-110"
          />

          <span className="text-[10px] leading-none">Histórico</span>
        </button>

        <button
          type="button"
          title="Configurações"
          className="
        group
        flex
        min-w-[52px]
        flex-col
        items-center
        justify-center
        gap-1.5
        bg-[var(--background)]
        text-[var(--foreground-secondary)]
        transition-all duration-200
        hover:text-[var(--foreground)]
      "
        >
          <Settings
            size={19}
            strokeWidth={1.8}
            className="transition-transform duration-300 group-hover:rotate-45"
          />

          <span className="text-[10px] leading-none">Config.</span>
        </button>
      </div>
      {/* CONTEÚDO */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div
            className="
          flex h-full
          flex-col
          items-center
          justify-center
          px-6
        "
          >
            <Image
              src="/assets/LOGO+TITULO+SUBTITULO BRANCO.png"
              alt="SAITE"
              width={120}
              height={40}
              className="h-50 w-auto object-contain"
            />

            <h1
              className="
            mt-6
            text-3xl
            font-semibold
            tracking-tight
            text-[var(--foreground)]
          "
            >
              {conversationId
                ? "Como posso ajudar?"
                : "Comece uma nova conversa"}
            </h1>

            <p
              className="
            mt-3
            max-w-md
            text-center
            text-sm
            leading-6
            text-[var(--foreground-secondary)]
          "
            >
              Converse comigo, pesquise informações, analise documentos ou
              explore seus projetos.
            </p>

            <div
              className="
            mt-8
            grid
            w-full
            max-w-xl
            grid-cols-2
            gap-3
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
                  disabled={isLoading || !conversationId}
                  className="
                rounded-xl
                border
                border-[var(--border)]
                bg-[var(--background-secondary)]
                px-4 py-3
                text-left
                text-xs
                text-[var(--foreground-secondary)]
                transition-all duration-200
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
          mx-auto
          max-w-3xl
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
                text-sm
                leading-6
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
              <div className="flex items-center gap-3">
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
              border
              border-[var(--danger)]/20
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
