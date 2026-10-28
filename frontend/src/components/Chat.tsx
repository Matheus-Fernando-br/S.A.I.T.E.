"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleAlert, FolderKanban, RefreshCw, Settings } from "lucide-react";

import ChatInput from "./ChatInput";
import ChatMessage, { ChatItem } from "./ChatMessage";

import { useApp } from "@/components/AppProvider";
import { useTheme } from "@/components/ThemeProvider";
import Button from "@/components/ui/Button";
import { ErrorState, SkeletonRows } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { errorMessage } from "@/lib/format";
import {
  ApiError,
  Conversation,
  createConversation,
  createMemory,
  deleteDocument,
  getConversation,
  getDocuments,
  getProject,
  KnowledgeDocument,
  Message,
  Project,
  streamChat,
  uploadDocument,
} from "@/services/api";

interface ChatProps {
  conversationId: string | null;
  /** Projeto para uma conversa nova (parâmetro ?p= da URL). */
  projectId: string | null;
}

function toItem(message: Message): ChatItem {
  return {
    id: message.id,
    role: message.role === "user" ? "user" : "assistant",
    content: message.content,
    status: message.status,
    citations: message.citations ?? [],
    toolCalls: message.tool_calls ?? [],
    model: message.role === "assistant" ? message.model : null,
  };
}

const SUGGESTIONS = [
  { text: "Me ajude a organizar minhas tarefas da semana", computer: false },
  { text: "Explique de forma simples como funciona RAG", computer: false },
  { text: "Escreva um e-mail profissional curto pedindo uma reunião", computer: false },
  { text: "Quanto espaço livre tenho nos meus discos?", computer: true },
];

export default function Chat({ conversationId, projectId }: ChatProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const { notify } = useToast();
  const { connection, agent, refreshStatus, bumpHistory } = useApp();

  const [items, setItems] = useState<ChatItem[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [attachments, setAttachments] = useState<KnowledgeDocument[]>([]);
  const [useComputer, setUseComputer] = useState(false);
  const [liveStatus, setLiveStatus] = useState("");

  const activeIdRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);

  const effectiveProjectId = conversation?.project_id ?? projectId;
  const computerAvailable = Boolean(agent?.connected && !agent.paused);

  /* ============================================================
     CARREGAR CONVERSA (ou preparar uma nova)
  ============================================================ */

  useEffect(() => {
    // A própria tela acabou de criar esta conversa: não recarrega no meio do streaming.
    if (conversationId && conversationId === activeIdRef.current) return;

    let cancelled = false;
    abortRef.current?.abort();

    async function load() {
      activeIdRef.current = conversationId;
      setItems([]);
      setAttachments([]);
      setLoadError(null);
      setConversation(null);

      if (!conversationId) {
        setProject(projectId ? await getProject(projectId).catch(() => null) : null);
        return;
      }

      setIsLoading(true);
      try {
        const [data, documents] = await Promise.all([
          getConversation(conversationId),
          getDocuments({ scope: "conversation", conversationId }),
        ]);
        if (cancelled) return;
        setConversation(data.conversation);
        setItems(data.messages.filter((message) => message.role !== "tool").map(toItem));
        setAttachments(documents);
        setProject(data.conversation.project_id ? await getProject(data.conversation.project_id).catch(() => null) : null);
        stickToBottomRef.current = true;
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof ApiError && error.status === 404 ? "Esta conversa não existe mais." : errorMessage(error));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [conversationId, projectId]);

  // Interrompe uma geração em andamento ao sair da tela.
  useEffect(() => () => abortRef.current?.abort(), []);

  /* ============================================================
     ACOMPANHAR PROCESSAMENTO DOS ANEXOS
  ============================================================ */

  const processing = attachments.some((document) => document.status === "pending" || document.status === "processing");

  useEffect(() => {
    const id = activeIdRef.current;
    if (!processing || !id) return;
    const timer = window.setInterval(async () => {
      try {
        setAttachments(await getDocuments({ scope: "conversation", conversationId: id }));
      } catch {
        /* nova tentativa no próximo ciclo */
      }
    }, 1500);
    return () => window.clearInterval(timer);
  }, [processing]);

  /* ============================================================
     ROLAGEM: acompanha o fim enquanto o usuário não rolar para cima
  ============================================================ */

  useEffect(() => {
    const element = scrollRef.current;
    if (element && stickToBottomRef.current) {
      element.scrollTop = element.scrollHeight;
    }
  }, [items]);

  function handleScroll() {
    const element = scrollRef.current;
    if (!element) return;
    stickToBottomRef.current = element.scrollHeight - element.scrollTop - element.clientHeight < 120;
  }

  /* ============================================================
     CONVERSA ATIVA (cria na primeira mensagem/anexo)
  ============================================================ */

  const ensureConversation = useCallback(async (): Promise<string> => {
    if (activeIdRef.current) return activeIdRef.current;
    const created = await createConversation(projectId);
    activeIdRef.current = created.id;
    setConversation(created);
    router.replace(`/?c=${created.id}`, { scroll: false });
    bumpHistory();
    return created.id;
  }, [projectId, router, bumpHistory]);

  /* ============================================================
     ENVIAR MENSAGEM (streaming)
  ============================================================ */

  async function handleSendMessage(text: string, computerForThisMessage = useComputer) {
    if (!text.trim() || isStreaming) return;

    let id: string;
    try {
      id = await ensureConversation();
    } catch (error) {
      notify("error", errorMessage(error), error instanceof ApiError ? error.hint : undefined);
      return;
    }

    const stamp = Date.now();
    const userId = `local-user-${stamp}`;
    const assistantId = `local-assistant-${stamp}`;
    stickToBottomRef.current = true;
    setItems((current) => [
      ...current,
      { id: userId, role: "user", content: text, status: "complete", citations: [], toolCalls: [] },
      { id: assistantId, role: "assistant", content: "", status: "streaming", citations: [], toolCalls: [] },
    ]);

    const update = (change: (item: ChatItem) => ChatItem) =>
      setItems((current) => current.map((item) => (item.id === assistantId ? change(item) : item)));

    const controller = new AbortController();
    abortRef.current = controller;
    setIsStreaming(true);
    setLiveStatus("Gerando resposta…");

    try {
      await streamChat(id, text, { useComputer: computerForThisMessage, signal: controller.signal }, (event) => {
        switch (event.type) {
          case "start":
            update((item) => ({ ...item, citations: event.data.citations, model: event.data.model }));
            if (event.data.conversation.title !== conversation?.title) {
              setConversation(event.data.conversation);
              bumpHistory();
            }
            break;
          case "notice":
            update((item) => ({ ...item, notices: [...(item.notices ?? []), event.data.message] }));
            break;
          case "tool":
            update((item) => ({ ...item, toolCalls: [...item.toolCalls, event.data] }));
            break;
          case "token":
            update((item) => ({ ...item, content: item.content + event.data.text }));
            break;
          case "done":
            update((item) => ({ ...toItem(event.data.assistant_message), notices: item.notices }));
            setLiveStatus("Resposta concluída.");
            break;
          case "error":
            update((item) => ({ ...item, status: "error", content: event.data.message, hint: event.data.hint }));
            setLiveStatus("A resposta falhou.");
            void refreshStatus();
            break;
        }
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        update((item) =>
          item.content
            ? { ...item, status: "partial" }
            : { ...item, status: "error", content: "Geração cancelada antes de qualquer resposta." },
        );
        setLiveStatus("Geração interrompida.");
      } else {
        update((item) => ({
          ...item,
          status: "error",
          content: errorMessage(error),
          hint: error instanceof ApiError ? error.hint : undefined,
        }));
        void refreshStatus();
      }
    } finally {
      // Conexão encerrada sem "done"/"error": o que chegou fica como parcial.
      update((item) =>
        item.status === "streaming"
          ? item.content
            ? { ...item, status: "partial" }
            : { ...item, status: "error", content: "A conexão com o backend foi interrompida." }
          : item,
      );
      setIsStreaming(false);
      abortRef.current = null;
    }
  }

  function handleRetry(index: number) {
    const previousUser = [...items.slice(0, index)].reverse().find((item) => item.role === "user");
    if (previousUser) void handleSendMessage(previousUser.content);
  }

  async function handleRemember(content: string) {
    try {
      await createMemory(content.slice(0, 1000), effectiveProjectId);
      notify("success", "Memória salva.", "Veja ou remova em Configurações → Memórias.");
    } catch (error) {
      notify("error", errorMessage(error));
    }
  }

  /* ============================================================
     ANEXOS DA CONVERSA
  ============================================================ */

  async function handleAttach(files: File[]) {
    let id: string;
    try {
      id = await ensureConversation();
    } catch (error) {
      notify("error", errorMessage(error));
      return;
    }
    for (const file of files) {
      try {
        const { document, created } = await uploadDocument(file, "conversation", { conversationId: id });
        if (!created) notify("info", `"${file.name}" já estava anexado.`);
        setAttachments((current) => [document, ...current.filter((item) => item.id !== document.id)]);
      } catch (error) {
        notify("error", `${file.name}: ${errorMessage(error)}`);
      }
    }
  }

  async function handleRemoveAttachment(document: KnowledgeDocument) {
    try {
      await deleteDocument(document.id);
      setAttachments((current) => current.filter((item) => item.id !== document.id));
    } catch (error) {
      notify("error", errorMessage(error));
    }
  }

  /* ============================================================
     ESTADO DO RUNTIME
  ============================================================ */

  const backendOffline = connection.state === "backend-offline";
  const ai = connection.state === "online" ? connection.ai : null;
  const runtimeIssue = ai && (!ai.online ? "offline" : !ai.chat_model_installed ? "model" : null);

  const isEmpty = !isLoading && !loadError && items.length === 0;

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* CABEÇALHO DA CONVERSA */}
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-[var(--border)] px-4 sm:px-6">
        <h1 className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--foreground)]">
          {conversation?.title ?? (project ? `Nova conversa em ${project.name}` : "Nova conversa")}
        </h1>
        {project && (
          <Link
            href={`/projetos?id=${project.id}`}
            className="flex max-w-[40%] items-center gap-1.5 rounded-lg border border-[var(--border)] px-2 py-1 text-xs text-[var(--foreground-secondary)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--foreground)]"
          >
            <FolderKanban size={13} aria-hidden />
            <span className="truncate">{project.name}</span>
          </Link>
        )}
        {ai && (
          <Link
            href="/configuracoes"
            title={`Modelo: ${ai.chat_model}`}
            className="hidden items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)] sm:flex"
          >
            {ai.chat_model}
          </Link>
        )}
      </div>

      {/* BANNERS DE ESTADO REAL */}
      {(backendOffline || runtimeIssue) && (
        <div className="shrink-0 px-4 pt-3 sm:px-6">
          <div className="mx-auto max-w-3xl">
            {backendOffline ? (
              <ErrorState
                message="Backend local indisponível"
                hint={connection.error.hint ?? connection.error.message}
                action={
                  <Button size="sm" onClick={() => void refreshStatus()}>
                    <RefreshCw size={13} /> Verificar novamente
                  </Button>
                }
              />
            ) : (
              <div
                role="status"
                className="animate-fade-up flex items-start gap-3 rounded-xl border border-[var(--warning)]/30 bg-[var(--warning)]/[0.07] p-3.5 text-sm"
              >
                <CircleAlert size={17} className="mt-0.5 shrink-0 text-[var(--warning)]" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[var(--foreground)]">
                    {runtimeIssue === "offline" ? "O runtime de IA local não está respondendo" : "Modelo de chat não instalado"}
                  </p>
                  <p className="mt-0.5 text-[13px] leading-6 text-[var(--foreground-secondary)]">{ai?.hint ?? ai?.error}</p>
                </div>
                <Link
                  href="/configuracoes"
                  className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-[var(--accent)] hover:bg-[var(--accent-soft)]"
                >
                  <Settings size={13} /> Configurar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONTEÚDO */}
      <div ref={scrollRef} onScroll={handleScroll} className="min-h-0 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6" role="status" aria-label="Carregando conversa">
            <SkeletonRows rows={4} />
          </div>
        ) : loadError ? (
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
            <ErrorState
              message={loadError}
              action={
                <Link href="/" className="text-sm font-medium text-[var(--accent)] hover:underline">
                  Começar uma nova conversa
                </Link>
              }
            />
          </div>
        ) : isEmpty ? (
          <div className="flex min-h-full flex-col items-center justify-center px-6 py-10">
            <Image
              src={theme === "dark" ? "/brand/logo-full-light-text.png" : "/brand/logo-full-dark-text.png"}
              alt="S.A.I.T.E. — Superior Advanced Intelligence Technological Entity"
              width={560}
              height={727}
              priority
              className="animate-fade-in h-40 w-auto object-contain drop-shadow-[0_0_24px_var(--accent-glow)] sm:h-48"
            />

            <h2 className="animate-fade-up mt-6 text-center text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
              {project ? `Pronto para trabalhar em ${project.name}` : "Como posso ajudar?"}
            </h2>

            <p className="animate-fade-up mt-3 max-w-md text-center text-sm leading-6 text-[var(--foreground-secondary)]">
              {project
                ? "Esta conversa usa as instruções, documentos e memórias deste projeto, além do conhecimento global."
                : "Converse, consulte o que você ensinou na aba Aprender ou anexe arquivos a esta conversa."}
            </p>

            <div className="mt-8 grid w-full max-w-xl grid-cols-1 gap-2.5 sm:grid-cols-2">
              {SUGGESTIONS.filter((suggestion) => !suggestion.computer || computerAvailable).map((suggestion, index) => (
                <button
                  key={suggestion.text}
                  type="button"
                  onClick={() => void handleSendMessage(suggestion.text, suggestion.computer || useComputer)}
                  disabled={isStreaming || backendOffline}
                  style={{ animationDelay: `${80 + index * 40}ms` }}
                  className="animate-fade-up rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] px-4 py-3 text-left text-[13px] leading-5 text-[var(--foreground-secondary)] shadow-[var(--shadow-sm)] transition-[border-color,color,transform] duration-150 hover:-translate-y-px hover:border-[var(--accent)] hover:text-[var(--foreground)] disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {suggestion.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
            {items.map((item, index) => (
              <ChatMessage
                key={item.id}
                message={item}
                onRetry={item.role === "assistant" && !isStreaming ? () => handleRetry(index) : undefined}
                onRemember={item.role === "user" ? handleRemember : undefined}
              />
            ))}
          </div>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {liveStatus}
      </p>

      {/* INPUT */}
      <ChatInput
        onSend={(text) => void handleSendMessage(text)}
        onStop={() => abortRef.current?.abort()}
        onAttach={(files) => void handleAttach(files)}
        onRemoveAttachment={(document) => void handleRemoveAttachment(document)}
        attachments={attachments}
        isStreaming={isStreaming}
        disabled={backendOffline || Boolean(loadError)}
        disabledReason={backendOffline ? "Backend local offline" : "Conversa indisponível"}
        useComputer={useComputer && computerAvailable}
        onUseComputerChange={setUseComputer}
        computerAvailable={computerAvailable}
        computerHint={agent?.paused ? "Agente pausado nas permissões" : agent?.error ? "Agente local desconectado" : undefined}
      />
    </div>
  );
}
