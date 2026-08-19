const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ChatResponse {
  response: string;
}

export async function sendMessage(message: string): Promise<string> {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
    }),
  });

  if (!response.ok) {
    throw new Error(`Erro na API: ${response.status}`);
  }

  const data: ChatResponse = await response.json();

  return data.response;
}
