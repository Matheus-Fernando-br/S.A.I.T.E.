"use client";

import {
  Archive,
  Bot,
  FolderKanban,
  GraduationCap,
  History,
  LoaderCircle,
  MessageCircle,
  MessageSquare,
  Monitor,
  Moon,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Pin,
  Plus,
  Settings,
  Sun,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useApp } from "@/components/AppProvider";
import { useTheme } from "@/components/ThemeProvider";
import { StatusDot } from "@/components/ui/States";
import { useConversationActions } from "@/components/useConversationActions";
import { cx } from "@/lib/format";
import { Conversation, getConversations } from "@/services/api";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { label: "Chat", href: "/", icon: MessageSquare },
  { label: "Aprender", href: "/aprender", icon: GraduationCap },
  { label: "Projetos", href: "/projetos", icon: FolderKanban },
  { label: "Histórico", href: "/historico", icon: History },
  { label: "Configurações", href: "/configuracoes", icon: Settings },
];

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const { connection, agent, historyVersion, bumpHistory, mobileNavOpen, setMobileNavOpen } = useApp();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeConversationId = pathname === "/" ? searchParams.get("c") : null;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState(false);
  const [openConversationMenu, setOpenConversationMenu] = useState<string | null>(null);

  const isDark = theme === "dark";
  // No mobile a barra é uma gaveta e sempre aparece expandida.
  const expanded = isOpen || mobileNavOpen;

  const { actions, dialogs } = useConversationActions((updated, removedId) => {
    if (removedId && removedId === activeConversationId) router.push("/");
    bumpHistory();
  });

  /* ============================================================
     FECHAR MENU CONVERSA AO CLICAR FORA / ESC
  ============================================================ */

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (openConversationMenu && !target.closest("[data-conversation-menu]")) {
        setOpenConversationMenu(null);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenConversationMenu(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [openConversationMenu]);

  /* ============================================================
     CARREGAR HISTÓRICO
  ============================================================ */

  useEffect(() => {
    let cancelled = false;

    async function loadConversations() {
      try {
        const data = await getConversations({ allProjects: true, limit: 40 });
        if (!cancelled) {
          setConversations(data);
          setHistoryError(false);
        }
      } catch {
        if (!cancelled) {
          setConversations([]);
          setHistoryError(true);
        }
      } finally {
        if (!cancelled) setIsLoadingHistory(false);
      }
    }

    void loadConversations();
    return () => {
      cancelled = true;
    };
  }, [historyVersion, connection.state]);

  // Fecha a gaveta mobile ao navegar.
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname, searchParams, setMobileNavOpen]);

  const pinned = conversations.filter((conversation) => conversation.pinned);
  const recent = conversations.filter((conversation) => !conversation.pinned);

  function renderConversation(conversation: Conversation) {
    const active = conversation.id === activeConversationId;
    const busy = actions.busyId === conversation.id;
    const Icon = conversation.pinned ? Pin : MessageCircle;
    return (
      <li key={conversation.id} className="group relative" data-conversation-menu>
        <Link
          href={`/?c=${conversation.id}`}
          aria-current={active ? "page" : undefined}
          onClick={() => setOpenConversationMenu(null)}
          className={cx(
            "flex h-9 w-full items-center gap-2.5 rounded-lg pl-3 pr-9 text-[13px] transition-colors duration-150",
            active
              ? "bg-[var(--sidebar-active)] text-[var(--foreground)]"
              : "text-[var(--foreground-secondary)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)]",
          )}
        >
          {busy ? (
            <LoaderCircle size={14} className="shrink-0 animate-spin" aria-hidden />
          ) : (
            <Icon size={14} strokeWidth={1.8} className="shrink-0 text-[var(--foreground-muted)]" aria-hidden />
          )}
          <span className="min-w-0 flex-1 truncate">{conversation.title}</span>
          {conversation.project_name && (
            <span className="max-w-[64px] shrink-0 truncate rounded bg-[var(--background-tertiary)] px-1.5 text-[10px] text-[var(--foreground-muted)]">
              {conversation.project_name}
            </span>
          )}
        </Link>

        <button
          type="button"
          aria-label={`Opções da conversa ${conversation.title}`}
          aria-haspopup="menu"
          aria-expanded={openConversationMenu === conversation.id}
          onClick={() => setOpenConversationMenu((current) => (current === conversation.id ? null : conversation.id))}
          className={cx(
            "absolute right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[var(--foreground-muted)] transition-opacity duration-150 hover:bg-[var(--background-tertiary)] hover:text-[var(--foreground)] focus-visible:opacity-100",
            openConversationMenu === conversation.id ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        >
          <MoreHorizontal size={16} strokeWidth={2} />
        </button>

        {openConversationMenu === conversation.id && (
          <div
            role="menu"
            className="animate-pop-in absolute right-1 top-9 z-50 w-44 overflow-hidden rounded-xl border border-[var(--sidebar-border)] bg-[var(--background-secondary)] p-1 shadow-[var(--shadow-md)]"
          >
            {[
              { label: conversation.pinned ? "Desafixar" : "Fixar", icon: Pin, run: () => actions.togglePin(conversation) },
              { label: "Renomear", icon: Pencil, run: () => actions.rename(conversation) },
              { label: "Arquivar", icon: Archive, run: () => actions.toggleArchive(conversation) },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpenConversationMenu(null);
                  void item.run();
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)]"
              >
                <item.icon size={14} strokeWidth={1.8} />
                {item.label}
              </button>
            ))}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpenConversationMenu(null);
                actions.remove(conversation);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs text-[var(--danger)] transition-colors hover:bg-[var(--danger)]/10"
            >
              <Trash2 size={14} strokeWidth={1.8} />
              Excluir
            </button>
          </div>
        )}
      </li>
    );
  }

  /* ============================================================
     STATUS REAL (IA LOCAL + AGENTE)
  ============================================================ */

  const ai =
    connection.state === "online"
      ? connection.ai.online
        ? connection.ai.chat_model_installed
          ? { state: "online" as const, label: connection.ai.chat_model }
          : { state: "warning" as const, label: "Modelo não instalado" }
        : { state: "offline" as const, label: "Runtime offline" }
      : connection.state === "loading"
        ? { state: "loading" as const, label: "Verificando…" }
        : { state: "offline" as const, label: "Backend offline" };

  const agentState = connection.state === "loading"
    ? { state: "loading" as const, label: "Verificando…" }
    : !agent
    ? { state: "offline" as const, label: "Indisponível" }
    : !agent.connected
      ? { state: "offline" as const, label: "Desconectado" }
      : agent.paused
        ? { state: "warning" as const, label: "Pausado" }
        : { state: "online" as const, label: "Conectado" };

  return (
    <>
      {/* Fundo da gaveta mobile */}
      {mobileNavOpen && (
        <div className="animate-fade-in fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMobileNavOpen(false)} aria-hidden />
      )}

      <aside
        aria-label="Navegação principal"
        className={cx(
          "z-50 flex h-dvh shrink-0 flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar-background)]",
          "transition-[width] duration-300 ease-[var(--ease-out)]",
          // Mobile: gaveta sobreposta; desktop: coluna recolhível.
          mobileNavOpen ? "animate-slide-in-left fixed inset-y-0 left-0 w-72" : "hidden lg:flex",
          !mobileNavOpen && (isOpen ? "w-64" : "w-[72px]"),
        )}
      >
        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className={cx("flex h-16 shrink-0 items-center px-4", expanded ? "justify-between" : "justify-center")}>
          {expanded && (
            <Link href="/" className="flex items-center gap-2" aria-label="S.A.I.T.E. — início">
              <Image src="/brand/logo-mark.png" alt="" width={30} height={30} className="h-[30px] w-[30px]" priority />
              <Image src="/brand/title.png" alt="S.A.I.T.E." width={104} height={19} className="h-[19px] w-auto" priority />
            </Link>
          )}
          <button
            onClick={mobileNavOpen ? () => setMobileNavOpen(false) : onToggle}
            aria-label={mobileNavOpen ? "Fechar menu" : isOpen ? "Recolher menu" : "Expandir menu"}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)]"
          >
            {mobileNavOpen ? <X size={19} /> : isOpen ? <PanelLeftClose size={19} strokeWidth={1.8} /> : <PanelLeftOpen size={19} strokeWidth={1.8} />}
          </button>
        </div>

        {/* =====================================================
            NOVA CONVERSA + MENU
        ====================================================== */}
        <nav className="flex min-h-0 flex-1 flex-col px-3 pb-3">
          <Link
            href="/"
            title="Nova conversa"
            className={cx(
              "group mb-3 flex h-10 shrink-0 items-center rounded-xl bg-[var(--accent)] text-sm font-medium text-[var(--accent-foreground)] shadow-[var(--shadow-sm)] transition-[background-color,transform] duration-150 hover:bg-[var(--accent-hover)] active:scale-[0.98]",
              expanded ? "gap-2.5 px-3" : "justify-center",
            )}
          >
            <Plus size={18} strokeWidth={2.2} className="shrink-0 transition-transform duration-200 group-hover:rotate-90" />
            {expanded && <span>Nova conversa</span>}
          </Link>

          <ul className="flex flex-col gap-0.5">
            {menuItems.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    title={expanded ? undefined : item.label}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      "relative flex h-10 items-center rounded-xl text-sm transition-colors duration-150",
                      expanded ? "gap-3 px-3" : "justify-center",
                      active
                        ? "bg-[var(--sidebar-active)] font-medium text-[var(--foreground)]"
                        : "text-[var(--foreground-secondary)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)]",
                    )}
                  >
                    {active && <span className="absolute left-0 top-2 h-6 w-[3px] rounded-r-full bg-[var(--accent)]" aria-hidden />}
                    <item.icon size={18} strokeWidth={1.8} className={cx("shrink-0", active && "text-[var(--accent)]")} />
                    {expanded && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* =====================================================
              HISTÓRICO REAL
          ====================================================== */}
          {expanded && (
            <div className="mt-4 min-h-0 flex-1 overflow-y-auto border-t border-[var(--sidebar-border)] pt-3">
              {isLoadingHistory ? (
                <div className="flex flex-col gap-1.5 px-1" role="status" aria-label="Carregando conversas">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="skeleton h-7" style={{ opacity: 1 - index * 0.2 }} />
                  ))}
                </div>
              ) : historyError ? (
                <p className="px-3 py-2 text-xs leading-5 text-[var(--foreground-muted)]">
                  Histórico indisponível enquanto o backend estiver offline.
                </p>
              ) : conversations.length === 0 ? (
                <p className="px-3 py-2 text-xs leading-5 text-[var(--foreground-muted)]">
                  Suas conversas aparecerão aqui.
                </p>
              ) : (
                <>
                  {pinned.length > 0 && (
                    <>
                      <h2 className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                        Fixadas
                      </h2>
                      <ul className="mb-3 flex flex-col gap-0.5">{pinned.map(renderConversation)}</ul>
                    </>
                  )}
                  <h2 className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                    Recentes
                  </h2>
                  <ul className="flex flex-col gap-0.5">{recent.map(renderConversation)}</ul>
                  {recent.length === 0 && <p className="px-3 py-1 text-xs text-[var(--foreground-muted)]">Sem conversas recentes.</p>}
                </>
              )}
            </div>
          )}
        </nav>

        {/* =====================================================
            ESTADO DA IA LOCAL E DO AGENTE
        ====================================================== */}
        <div className="shrink-0 px-3 pb-2">
          <Link
            href="/configuracoes"
            title={`IA local: ${ai.label} · Agente: ${agentState.label}`}
            className={cx(
              "flex flex-col gap-2 rounded-xl border border-[var(--sidebar-border)] bg-[var(--background-tertiary)] text-xs transition-colors hover:border-[var(--border-hover)]",
              expanded ? "p-3" : "items-center p-2.5",
            )}
          >
            {expanded ? (
              <>
                <span className="flex items-center gap-2">
                  <Bot size={14} className="shrink-0 text-[var(--foreground-secondary)]" aria-hidden />
                  <span className="text-[var(--foreground-secondary)]">IA local</span>
                  <span className="ml-auto flex min-w-0 items-center gap-1.5 font-medium text-[var(--foreground)]">
                    <StatusDot state={ai.state} />
                    <span className="truncate">{ai.label}</span>
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <Monitor size={14} className="shrink-0 text-[var(--foreground-secondary)]" aria-hidden />
                  <span className="text-[var(--foreground-secondary)]">Agente</span>
                  <span className="ml-auto flex min-w-0 items-center gap-1.5 font-medium text-[var(--foreground)]">
                    <StatusDot state={agentState.state} />
                    <span className="truncate">{agentState.label}</span>
                  </span>
                </span>
              </>
            ) : (
              <>
                <StatusDot state={ai.state} />
                <StatusDot state={agentState.state} />
              </>
            )}
          </Link>
        </div>

        {/* =====================================================
            THEME
        ====================================================== */}
        <div className="shrink-0 border-t border-[var(--sidebar-border)] p-3">
          <button
            onClick={toggleTheme}
            type="button"
            aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
            title={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
            className={cx(
              "group flex h-10 w-full items-center rounded-xl text-sm text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)]",
              expanded ? "gap-3 px-3" : "justify-center",
            )}
          >
            {isDark ? (
              <Moon size={18} strokeWidth={1.8} className="shrink-0 transition-transform duration-300 group-hover:-rotate-12" />
            ) : (
              <Sun size={18} strokeWidth={1.8} className="shrink-0 transition-transform duration-300 group-hover:rotate-45" />
            )}
            {expanded && <span>{isDark ? "Modo escuro" : "Modo claro"}</span>}
          </button>
        </div>
      </aside>
      {dialogs}
    </>
  );
}
