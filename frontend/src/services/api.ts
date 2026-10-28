"use client";

/* ============================================================
CONEXÃO

O backend roda na máquina do usuário. O endereço padrão vem de
NEXT_PUBLIC_API_URL e pode ser trocado em Configurações → Conexão
(guardado só neste navegador, junto com o token opcional).
============================================================ */

const DEFAULT_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const CONNECTION_KEY = "saite-connection";

export interface ConnectionSettings {
  apiUrl: string;
  token: string;
}

export function getConnection(): ConnectionSettings {
  if (typeof window === "undefined") {
    return { apiUrl: DEFAULT_API_URL, token: "" };
  }
  try {
    const saved = JSON.parse(localStorage.getItem(CONNECTION_KEY) || "{}");
    return {
      apiUrl: (saved.apiUrl || DEFAULT_API_URL).replace(/\/+$/, ""),
      token: saved.token || "",
    };
  } catch {
    return { apiUrl: DEFAULT_API_URL, token: "" };
  }
}

export function saveConnection(settings: ConnectionSettings) {
  localStorage.setItem(
    CONNECTION_KEY,
    JSON.stringify({
      apiUrl: settings.apiUrl.trim().replace(/\/+$/, ""),
      token: settings.token.trim(),
    }),
  );
}

/* ============================================================
ERROS
============================================================ */

export class ApiError extends Error {
  status: number;
  hint?: string;
  code?: string;

  constructor(message: string, status: number, hint?: string, code?: string) {
    super(message);
    this.status = status;
    this.hint = hint;
    this.code = code;
  }
}

function networkError(): ApiError {
  return new ApiError(
    `Não foi possível conectar ao backend em ${getConnection().apiUrl}.`,
    0,
    "Inicie o backend local (uvicorn app.main:app) ou ajuste o endereço em Configurações → Conexão.",
    "NetworkError",
  );
}

function authHeaders(): Record<string, string> {
  const { token } = getConnection();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${getConnection().apiUrl}${path}`, {
      ...init,
      cache: "no-store",
      headers: {
        ...(init.body && !(init.body instanceof FormData)
          ? { "Content-Type": "application/json" }
          : {}),
        ...authHeaders(),
        ...init.headers,
      },
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    throw networkError();
  }

  if (!response.ok) {
    let detail = `Erro ${response.status}`;
    let hint: string | undefined;
    let code: string | undefined;
    try {
      const data = await response.json();
      if (typeof data.detail === "string") {
        detail = data.detail;
      } else if (Array.isArray(data.detail)) {
        detail = "Dados inválidos: verifique os campos enviados.";
      }
      hint = data.hint || undefined;
      code = data.code || undefined;
    } catch {
      /* resposta sem JSON */
    }
    throw new ApiError(detail, response.status, hint, code);
  }

  return response.json() as Promise<T>;
}

const json = (body: unknown) => JSON.stringify(body);

/* ============================================================
TIPOS
============================================================ */

export interface Conversation {
  id: string;
  project_id: string | null;
  project_name?: string | null;
  title: string;
  pinned: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
  fix: boolean;
}

export interface Citation {
  n: number;
  chunk_id: number;
  document_id: string;
  document_name: string;
  location: string;
  url: string | null;
  scope: "global" | "project" | "conversation";
  snippet: string;
  score: number;
  similarity: number | null;
  cited?: boolean;
}

export interface ToolCallLog {
  name: string;
  arguments: Record<string, unknown>;
  ok: boolean;
  error: string | null;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "tool";
  content: string;
  status: "complete" | "partial" | "error";
  model: string | null;
  citations: Citation[];
  tool_calls: ToolCallLog[];
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  instructions: string;
  archived: number | boolean;
  created_at: string;
  updated_at: string;
  conversation_count?: number;
  document_count?: number;
}

export type Scope = "global" | "project" | "conversation";

export interface KnowledgeDocument {
  id: string;
  scope: Scope;
  project_id: string | null;
  project_name?: string | null;
  conversation_id: string | null;
  source_type: "file" | "url";
  name: string;
  mime: string;
  size_bytes: number;
  url: string | null;
  status: "pending" | "processing" | "ready" | "error";
  error: string | null;
  chunk_count: number;
  char_count: number;
  embed_model: string | null;
  version: number;
  fetched_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentChunk {
  id: number;
  ord: number;
  location: string;
  content: string;
  embedded: number | boolean;
}

export interface KnowledgeStats {
  documents: number;
  chunks: number;
  ready: number;
  errors: number;
  processing: number;
  stale: number;
}

export interface Memory {
  id: string;
  project_id: string | null;
  project_name?: string | null;
  content: string;
  created_at: string;
}

export interface ModelInfo {
  name: string;
  size_bytes: number | null;
  family: string | null;
  parameter_size: string | null;
  quantization: string | null;
  capabilities: string[];
}

export interface AIStatus {
  provider: string;
  base_url: string;
  chat_model: string;
  embed_model: string;
  online: boolean;
  version: string | null;
  error: string | null;
  hint: string | null;
  models: ModelInfo[];
  chat_model_installed: boolean;
  embed_model_installed: boolean;
}

export interface AISettings {
  llm_provider: "ollama" | "openai_compatible";
  llm_base_url: string;
  chat_model: string;
  embed_model: string;
  temperature: number;
  num_ctx: number;
  history_messages: number;
  rag_top_k: number;
  rag_min_similarity: number;
  agent_url: string;
  assistant_name: string;
}

export interface AgentStatus {
  connected: boolean;
  error?: string;
  hint?: string;
  version?: string;
  paused?: boolean;
  allowed_roots?: string[];
  tools?: Record<string, boolean>;
  sensitive_tools?: string[];
  limits?: Record<string, number>;
}

export interface AuditEntry {
  at: string;
  tool: string;
  arguments: Record<string, string>;
  ok: boolean;
  error: string | null;
  duration_ms: number;
}

export interface ActivityEntry {
  id: number;
  created_at: string;
  project_id: string | null;
  action: string;
  detail: Record<string, unknown>;
}

/* ============================================================
SAÚDE
============================================================ */

export async function getHealth() {
  return request<{ status: string; version: string; auth_required: boolean }>(
    "/health",
  );
}

/* ============================================================
CONVERSAS
============================================================ */

export async function createConversation(
  projectId?: string | null,
): Promise<Conversation> {
  const data = await request<{ conversation: Conversation }>(
    "/api/conversations",
    { method: "POST", body: json(projectId ? { project_id: projectId } : {}) },
  );
  return data.conversation;
}

export async function getConversations(
  options: {
    projectId?: string | null;
    allProjects?: boolean;
    archived?: boolean;
    query?: string;
    limit?: number;
  } = {},
): Promise<Conversation[]> {
  const params = new URLSearchParams();
  if (options.projectId) params.set("project_id", options.projectId);
  if (options.allProjects) params.set("all_projects", "true");
  if (options.archived) params.set("archived", "true");
  if (options.query) params.set("q", options.query);
  if (options.limit) params.set("limit", String(options.limit));
  const data = await request<{ conversations: Conversation[] }>(
    `/api/conversations?${params}`,
  );
  return data.conversations;
}

export async function getConversation(conversationId: string) {
  return request<{ conversation: Conversation; messages: Message[] }>(
    `/api/conversations/${conversationId}`,
  );
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  return (await getConversation(conversationId)).messages;
}

export async function updateConversation(
  conversationId: string,
  changes: Partial<Pick<Conversation, "title" | "pinned" | "archived">>,
): Promise<Conversation> {
  return request<Conversation>(`/api/conversations/${conversationId}`, {
    method: "PATCH",
    body: json(changes),
  });
}

export async function updateConversationFix(
  conversationId: string,
  fix: boolean,
) {
  return updateConversation(conversationId, { pinned: fix });
}

export async function deleteConversation(conversationId: string) {
  return request(`/api/conversations/${conversationId}`, { method: "DELETE" });
}

/* ============================================================
CHAT (streaming)
============================================================ */

export type ChatEvent =
  | {
      type: "start";
      data: {
        user_message: Message;
        conversation: Conversation;
        citations: Citation[];
        retrieval: {
          vector: boolean;
          lexical: boolean;
          error: string | null;
          count: number;
          ms: number;
        };
        model: string;
        tools: string[];
      };
    }
  | { type: "token"; data: { text: string } }
  | { type: "notice"; data: { message: string } }
  | { type: "tool"; data: ToolCallLog }
  | { type: "done"; data: { assistant_message: Message; ms: number } }
  | {
      type: "error";
      data: {
        message: string;
        hint?: string;
        code?: string;
        assistant_message?: Message;
      };
    };

/**
 * Envia uma mensagem e entrega os eventos SSE conforme chegam.
 * Cancelar o `signal` interrompe a geração; o backend guarda o texto parcial.
 */
export async function streamChat(
  conversationId: string,
  message: string,
  options: { useComputer?: boolean; signal?: AbortSignal },
  onEvent: (event: ChatEvent) => void,
): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${getConnection().apiUrl}/api/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: json({
        conversation_id: conversationId,
        message,
        use_computer: Boolean(options.useComputer),
      }),
      signal: options.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    throw networkError();
  }

  if (!response.ok || !response.body) {
    let detail = `Erro ${response.status}`;
    try {
      detail = (await response.json()).detail || detail;
    } catch {
      /* sem JSON */
    }
    throw new ApiError(detail, response.status);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let separator = buffer.indexOf("\n\n");
    while (separator !== -1) {
      const block = buffer.slice(0, separator);
      buffer = buffer.slice(separator + 2);
      separator = buffer.indexOf("\n\n");

      let type = "message";
      let data = "";
      for (const line of block.split("\n")) {
        if (line.startsWith("event: ")) type = line.slice(7);
        else if (line.startsWith("data: ")) data += line.slice(6);
      }
      if (data) {
        onEvent({ type, data: JSON.parse(data) } as ChatEvent);
      }
    }
  }
}

/* ============================================================
PROJETOS
============================================================ */

export async function getProjects(includeArchived = false) {
  const data = await request<{ projects: Project[] }>(
    `/api/projects${includeArchived ? "?include_archived=true" : ""}`,
  );
  return data.projects;
}

export async function getProject(projectId: string) {
  return request<Project>(`/api/projects/${projectId}`);
}

export async function createProject(input: {
  name: string;
  description?: string;
  instructions?: string;
}) {
  return request<Project>("/api/projects", {
    method: "POST",
    body: json(input),
  });
}

export async function updateProject(
  projectId: string,
  changes: Partial<
    Pick<Project, "name" | "description" | "instructions"> & {
      archived: boolean;
    }
  >,
) {
  return request<Project>(`/api/projects/${projectId}`, {
    method: "PATCH",
    body: json(changes),
  });
}

export async function deleteProject(projectId: string, confirmName: string) {
  return request<{ removed: { conversations: number; documents: number } }>(
    `/api/projects/${projectId}/delete`,
    { method: "POST", body: json({ confirm_name: confirmName }) },
  );
}

export async function getProjectActivity(projectId: string) {
  const data = await request<{ activity: ActivityEntry[] }>(
    `/api/projects/${projectId}/activity`,
  );
  return data.activity;
}

/* ============================================================
CONHECIMENTO (APRENDER)
============================================================ */

export async function getKnowledgeStats() {
  return request<KnowledgeStats>("/api/knowledge/stats");
}

export async function getDocuments(
  filter: {
    scope?: Scope;
    projectId?: string | null;
    conversationId?: string | null;
  } = {},
) {
  const params = new URLSearchParams();
  if (filter.scope) params.set("scope", filter.scope);
  if (filter.projectId) params.set("project_id", filter.projectId);
  if (filter.conversationId)
    params.set("conversation_id", filter.conversationId);
  const data = await request<{ documents: KnowledgeDocument[] }>(
    `/api/knowledge/documents?${params}`,
  );
  return data.documents;
}

export async function getDocument(documentId: string) {
  return request<{ document: KnowledgeDocument; chunks: DocumentChunk[] }>(
    `/api/knowledge/documents/${documentId}`,
  );
}

export async function uploadDocument(
  file: File,
  scope: Scope,
  target: { projectId?: string | null; conversationId?: string | null } = {},
) {
  const form = new FormData();
  form.append("file", file);
  form.append("scope", scope);
  if (target.projectId) form.append("project_id", target.projectId);
  if (target.conversationId)
    form.append("conversation_id", target.conversationId);
  return request<{ document: KnowledgeDocument; created: boolean }>(
    "/api/knowledge/documents",
    { method: "POST", body: form },
  );
}

export async function importUrl(
  url: string,
  scope: Scope,
  target: { projectId?: string | null; conversationId?: string | null } = {},
) {
  return request<{ document: KnowledgeDocument; created: boolean }>(
    "/api/knowledge/urls",
    {
      method: "POST",
      body: json({
        url,
        scope,
        project_id: target.projectId || null,
        conversation_id: target.conversationId || null,
      }),
    },
  );
}

export async function reprocessDocument(documentId: string) {
  return request<{ document: KnowledgeDocument }>(
    `/api/knowledge/documents/${documentId}/reprocess`,
    { method: "POST" },
  );
}

export async function cancelDocument(documentId: string) {
  return request(`/api/knowledge/documents/${documentId}/cancel`, {
    method: "POST",
  });
}

export async function deleteDocument(documentId: string) {
  return request(`/api/knowledge/documents/${documentId}`, {
    method: "DELETE",
  });
}

export async function reindexKnowledge() {
  return request<{ scheduled: number }>("/api/knowledge/reindex", {
    method: "POST",
  });
}

export async function searchKnowledge(
  query: string,
  context: { projectId?: string | null } = {},
) {
  return request<{
    results: (Citation & { content: string })[];
    info: { vector: boolean; lexical: boolean; error: string | null };
  }>("/api/knowledge/search", {
    method: "POST",
    body: json({ query, project_id: context.projectId || null }),
  });
}

/* ============================================================
MEMÓRIAS
============================================================ */

export async function getMemories() {
  return (await request<{ memories: Memory[] }>("/api/memories")).memories;
}

export async function createMemory(content: string, projectId?: string | null) {
  return request<Memory>("/api/memories", {
    method: "POST",
    body: json({ content, project_id: projectId || null }),
  });
}

export async function deleteMemory(memoryId: string) {
  return request(`/api/memories/${memoryId}`, { method: "DELETE" });
}

/* ============================================================
IA LOCAL
============================================================ */

export async function getAIStatus() {
  return request<AIStatus>("/api/ai/status");
}

export async function getAISettings() {
  return request<AISettings>("/api/ai/settings");
}

export async function updateAISettings(changes: Partial<AISettings>) {
  return request<AISettings>("/api/ai/settings", {
    method: "PUT",
    body: json(changes),
  });
}

export async function resetAISettings() {
  return request<AISettings>("/api/ai/settings/reset", { method: "POST" });
}

export async function testModel() {
  return request<{ ok: boolean; model: string; reply: string; ms: number }>(
    "/api/ai/test",
    { method: "POST" },
  );
}

/* ============================================================
AGENTE LOCAL (COMPUTADOR)
============================================================ */

export async function getAgentStatus() {
  return request<AgentStatus>("/api/computer/status");
}

export async function updateAgentPermissions(changes: {
  allowed_roots?: string[];
  tools?: Record<string, boolean>;
  paused?: boolean;
}) {
  return request<AgentStatus>("/api/computer/permissions", {
    method: "PUT",
    body: json(changes),
  });
}

export async function getAgentAudit(limit = 50) {
  return (
    await request<{ entries: AuditEntry[] }>(
      `/api/computer/audit?limit=${limit}`,
    )
  ).entries;
}

export interface SystemInfo {
  collected_at: string;
  os: string;
  os_release: string;
  hostname: string;
  cpu_logical: number;
  cpu_percent?: number;
  memory_total_bytes?: number;
  memory_used_bytes?: number;
  memory_percent?: number;
  uptime_seconds?: number;
}

export interface DiskInfo {
  collected_at: string;
  disks: {
    mountpoint: string;
    total_bytes: number;
    used_bytes: number;
    free_bytes: number;
    percent: number | null;
  }[];
}

export async function getSystemInfo() {
  return request<SystemInfo>("/api/computer/tools/system_info", {
    method: "POST",
    body: json({}),
  });
}

export async function getDiskUsage() {
  return request<DiskInfo>("/api/computer/tools/disk_usage", {
    method: "POST",
    body: json({}),
  });
}

/* ============================================================
DADOS
============================================================ */

export async function exportData(): Promise<Blob> {
  let response: Response;
  try {
    response = await fetch(`${getConnection().apiUrl}/api/data/export`, {
      headers: authHeaders(),
    });
  } catch {
    throw networkError();
  }
  if (!response.ok) {
    throw new ApiError(`Erro ${response.status}`, response.status);
  }
  return response.blob();
}

export async function importData(payload: unknown) {
  return request<{ inserted: Record<string, number> }>("/api/data/import", {
    method: "POST",
    body: json(payload),
  });
}

export async function getActivity(limit = 50) {
  return (
    await request<{ activity: ActivityEntry[] }>(
      `/api/data/activity?limit=${limit}`,
    )
  ).activity;
}
