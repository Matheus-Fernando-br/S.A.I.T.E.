"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import Chat from "@/components/Chat";

/**
 * Chat. A conversa ativa fica na URL (?c=<id>) para que possa ser aberta pelo
 * histórico, recarregada ou compartilhada entre abas; ?p=<id> inicia uma
 * conversa nova dentro de um projeto.
 */
function ChatPage() {
  const searchParams = useSearchParams();

  return (
    <Chat
      conversationId={searchParams.get("c")}
      projectId={searchParams.get("p")}
    />
  );
}

export default function Home() {
  return (
    <Suspense>
      <ChatPage />
    </Suspense>
  );
}
