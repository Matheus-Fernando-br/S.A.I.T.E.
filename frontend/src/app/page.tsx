"use client";

import { useState } from "react";

import Sidebar from "@/components/Sidebar";
import Chat from "@/components/Chat";

import { createConversation } from "@/services/api";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [conversationId, setConversationId] = useState<string | null>(null);

  const [refreshHistory, setRefreshHistory] = useState(0);

  /**
   * Cria uma nova conversa.
   *
   * O backend já sabe qual é o usuário atual.
   */
  async function handleNewConversation() {
    try {
      const conversation = await createConversation();

      setConversationId(conversation.id);

      setRefreshHistory((value) => value + 1);
    } catch (error) {
      console.error("Erro ao criar conversa:", error);
    }
  }

  /**
   * Seleciona uma conversa existente no histórico.
   */
  function handleSelectConversation(id: string) {
    setConversationId(id);
  }

  /**
   * Chamado pelo Chat quando o usuário envia uma mensagem
   * estando na tela inicial.
   */
  function handleConversationCreated(id: string) {
    setConversationId(id);
    setRefreshHistory((value) => value + 1);
  }

  return (
    <div
      className="
        flex h-screen w-full
        overflow-hidden
        bg-[var(--background)]
      "
    >
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((current) => !current)}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
        refreshHistory={refreshHistory}
      />

      <Chat
        conversationId={conversationId}
        onConversationCreated={handleConversationCreated}
      />
    </div>
  );
}
