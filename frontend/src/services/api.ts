"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/* ============================================================
TIPOS
============================================================ */

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  summary: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface ChatResponse {
  response: string;
}

/* ============================================================
CRIAR CONVERSA
============================================================ */

export async function createConversation(): Promise<Conversation> {
  const response = await fetch(`${API_URL}/api/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao criar conversa: ${response.status}`);
  }

  const data = await response.json();

  const conversations = await getConversations();

  const conversation = conversations.find(
    (item) => item.id === data.conversation_id,
  );

  if (!conversation) {
    throw new Error("Conversa criada, mas não encontrada no histórico.");
  }

  return conversation;
}

/* ============================================================
LISTAR CONVERSAS
============================================================ */

export async function getConversations(): Promise<Conversation[]> {
  const response = await fetch(`${API_URL}/api/conversations`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar conversas: ${response.status}`);
  }

  const data = await response.json();

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.conversations)) {
    return data.conversations;
  }

  if (Array.isArray(data.data)) {
    return data.data;
  }

  console.error("Formato inesperado da API:", data);

  return [];
}

/* ============================================================
BUSCAR MENSAGENS DE UMA CONVERSA
============================================================ */

export async function getMessages(conversationId: string): Promise<Message[]> {
  const response = await fetch(
    `${API_URL}/api/conversations/${conversationId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Erro ao buscar mensagens: ${response.status}`);
  }

  const data = await response.json();

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.messages)) {
    return data.messages;
  }

  if (Array.isArray(data.data)) {
    return data.data;
  }

  console.error("Formato inesperado das mensagens:", data);

  return [];
}

/* ============================================================
ENVIAR MENSAGEM
============================================================ */

export async function sendMessage(
  conversationId: string,
  message: string,
): Promise<string> {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      conversation_id: conversationId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Erro na API: ${response.status}`);
  }

  const data: ChatResponse = await response.json();

  return data.response;
}

/* ============================================================
   RENOMEAR CONVERSA
============================================================ */

export async function updateConversation(
  conversationId: string,
  title: string,
) {
  const response = await fetch(
    `${API_URL}/api/conversations/${conversationId}?title=${encodeURIComponent(title)}`,
    {
      method: "PUT",
    },
  );

  return response;
}

/* ============================================================
DELETAR CONVERSA
============================================================ */

export async function deleteConversation(conversationId: string) {
  const response = await fetch(
    `${API_URL}/api/conversations/${conversationId}`,
    {
      method: "DELETE",
    },
  );

  return response;
}
