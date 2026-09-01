"use client";

import {
  Plus,
  MessageSquare,
  Search,
  FolderKanban,
  GraduationCap,
  Monitor,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  Cpu,
  HardDrive,
  MemoryStick,
  Bot,
  MessageCircle,
} from "lucide-react";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Conversation, getConversations } from "@/services/api";
import { useTheme } from "./ThemeProvider";
import { LoaderCircle } from "lucide-react";
interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;

  onNewConversation: () => void;

  onSelectConversation: (conversationId: string) => void;

  refreshHistory: number;
}

const menuItems = [
  {
    label: "Chat",
    icon: MessageSquare,
  },
  {
    label: "API",
    icon: Bot,
  },
  {
    label: "Pesquisar",
    icon: Search,
  },
  {
    label: "Projetos",
    icon: FolderKanban,
  },
  {
    label: "Aprender",
    icon: GraduationCap,
  },
];

export default function Sidebar({
  isOpen,
  onToggle,
  onNewConversation,
  onSelectConversation,
  refreshHistory,
}: SidebarProps) {
  const { theme, toggleTheme } = useTheme();

  const [conversations, setConversations] = useState<Conversation[]>([]);

  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const isDark = theme === "dark";

  /* ============================================================
     CARREGAR HISTÓRICO
  ============================================================ */

  useEffect(() => {
    let cancelled = false;

    async function loadConversations() {
      try {
        setIsLoadingHistory(true);

        const data = await getConversations();

        if (!cancelled) {
          setConversations(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);

        if (!cancelled) {
          setConversations([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingHistory(false);
        }
      }
    }

    void loadConversations();

    return () => {
      cancelled = true;
    };
  }, [refreshHistory]);

  return (
    <aside
      className={`
        relative flex h-screen shrink-0 flex-col
        border-r
        border-[var(--sidebar-border)]
        bg-[var(--sidebar-background)]
        transition-all duration-300 ease-in-out
        ${isOpen ? "w-64" : "w-[72px]"}
      `}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className={`
          flex h-20 items-center
          border-b
          border-[var(--sidebar-border)]
          px-4
          ${isOpen ? "justify-between" : "justify-center"}
        `}
      >
        {/* LOGO */}

        <div
          className={`
            flex items-center gap-2
            overflow-hidden
            transition-all duration-300
            ${isOpen ? "w-auto opacity-100" : "w-0 opacity-0"}
          `}
        >
          <Image
            src="/assets/TITULO.png"
            alt="SAITE"
            width={120}
            height={40}
            className="h-30 w-auto object-contain"
          />
        </div>

        {/* TOGGLE */}

        <button
          onClick={onToggle}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          className="
            flex h-9 w-9 shrink-0
            items-center justify-center
            rounded-lg
            text-[var(--foreground-secondary)]
            transition-all duration-200
            hover:bg-[var(--sidebar-hover)]
            hover:text-[var(--foreground)]
          "
        >
          {isOpen ? (
            <PanelLeftClose size={19} strokeWidth={1.8} />
          ) : (
            <PanelLeftOpen size={19} strokeWidth={1.8} />
          )}
        </button>
      </div>

      {/* =====================================================
          MENU
      ====================================================== */}

      <nav
        className="
          flex flex-1 flex-col
          gap-1
          overflow-y-auto
          px-3 py-4
        "
      >
        {/* NOVA CONVERSA */}

        <button
          onClick={onNewConversation}
          className={`
            group
            mb-3
            flex h-11
            items-center
            rounded-xl
            border border-white/10
            bg-white/[0.04]
            text-sm
            font-medium
            text-[var(--foreground)]
            transition-all duration-200
            hover:bg-white/[0.08]
            hover:border-white/20
            ${isOpen ? "gap-3 px-3" : "justify-center px-0"}
          `}
        >
          <Plus
            size={19}
            strokeWidth={2}
            className="
              shrink-0
              transition-transform
              duration-200
              group-hover:scale-110
            "
          />

          <span
            className={`
              overflow-hidden
              whitespace-nowrap
              transition-all duration-200
              ${isOpen ? "w-auto opacity-100" : "w-0 opacity-0"}
            `}
          >
            Nova conversa
          </span>
        </button>

        {/* MENU */}

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className={`
                group
                flex h-11
                items-center
                rounded-xl
                text-sm
                text-[var(--foreground-secondary)]
                transition-all duration-200
                hover:bg-[var(--sidebar-hover)]
                hover:text-[var(--foreground)]
                ${isOpen ? "gap-3 px-3" : "justify-center px-0"}
              `}
            >
              <Icon
                size={19}
                strokeWidth={1.8}
                className="
                  shrink-0
                  transition-transform
                  duration-200
                  group-hover:scale-105
                "
              />

              <span
                className={`
                  overflow-hidden
                  whitespace-nowrap
                  transition-all duration-200
                  ${isOpen ? "w-auto opacity-100" : "w-0 opacity-0"}
                `}
              >
                {item.label}
              </span>
            </button>
          );
        })}

        {/* =====================================================
            HISTÓRICO REAL
        ====================================================== */}

        {isOpen && (
          <div className="mt-4 flex flex-col gap-1">
            <div className="my-2 border-t border-[var(--sidebar-border)]" />

            <span
              className="
                px-3 py-1
                text-[11px]
                font-semibold
                uppercase
                tracking-wider
                text-[var(--foreground-muted)]
              "
            >
              Recentes
            </span>

            {isLoadingHistory ? (
              <div
                className="
                  flex items-center gap-2
                  px-3 py-3
                  text-xs
                  text-[var(--foreground-muted)]
                "
              >
                <LoaderCircle
                  size={15}
                  className="animate-spin"
                  strokeWidth={1.8}
                />

                <span>Carregando conversas...</span>
              </div>
            ) : conversations.length === 0 ? (
              <div
                className="
      px-3 py-3
      text-xs
      text-[var(--foreground-muted)]
    "
              >
                Sem conversas no Histórico.
              </div>
            ) : (
              conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation.id)}
                  className="
        group
        flex h-10 w-full
        items-center gap-3
        rounded-xl
        px-3
        text-left text-xs
        text-[var(--foreground-secondary)]
        transition-all duration-200
        hover:bg-[var(--sidebar-hover)]
        hover:text-[var(--foreground)]
      "
                >
                  <MessageCircle
                    size={15}
                    strokeWidth={1.8}
                    className="
          shrink-0
          text-[var(--foreground-muted)]
          group-hover:text-[var(--foreground)]
        "
                  />

                  <span
                    className="
          min-w-0
          flex-1
          overflow-hidden
          text-ellipsis
          whitespace-nowrap
        "
                  >
                    {conversation.title}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </nav>

      {/* =====================================================
          MEU PC
      ====================================================== */}

      <div className="px-3 pb-3">
        <div
          className={`
            flex flex-col gap-2.5
            rounded-2xl
            border border-[var(--sidebar-border)]
            bg-[var(--background-tertiary)]
            p-3
            transition-all duration-300
            ${isOpen ? "opacity-100" : "items-center p-2.5"}
          `}
        >
          {isOpen ? (
            <>
              <div
                className="
                  flex items-center gap-2
                  border-b
                  border-[var(--sidebar-border)]
                  pb-2
                  text-xs
                  font-semibold
                  text-[var(--foreground)]
                "
              >
                <Monitor
                  size={15}
                  className="text-[var(--foreground-secondary)]"
                />

                <span>Meu PC</span>
              </div>

              <div className="flex items-center justify-between text-xs text-[var(--foreground-secondary)]">
                <span className="flex items-center gap-1.5">
                  <Cpu size={14} />
                  CPU
                </span>

                <span className="text-[11px] font-medium text-[var(--foreground)]">
                  Intel i7 (24%)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-[var(--foreground-secondary)]">
                <span className="flex items-center gap-1.5">
                  <MemoryStick size={14} />
                  RAM
                </span>

                <span className="text-[11px] font-medium text-[var(--foreground)]">
                  16 GB (62%)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-[var(--foreground-secondary)]">
                <span className="flex items-center gap-1.5">
                  <HardDrive size={14} />
                  SSD
                </span>

                <span className="text-[11px] font-medium text-[var(--foreground)]">
                  512 GB (45%)
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2.5 text-[var(--foreground-secondary)]">
              <div title="Meu PC: CPU 24% | RAM 62% | SSD 45%">
                <Monitor size={18} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          THEME
      ====================================================== */}

      <div
        className="
          border-t
          border-[var(--sidebar-border)]
          p-3
        "
      >
        <button
          onClick={toggleTheme}
          type="button"
          aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
          title={isDark ? "Ativar Modo claro" : "Ativar Modo escuro"}
          className={`
            group
            flex h-11 w-full
            items-center
            rounded-xl
            bg-transparent
            text-sm
            text-[var(--foreground-secondary)]
            transition-all duration-200
            hover:bg-[var(--sidebar-hover)]
            hover:text-[var(--foreground)]
            ${isOpen ? "gap-3 px-3" : "justify-center px-0"}
          `}
        >
          {isDark ? (
            <Moon
              size={19}
              strokeWidth={1.8}
              className="
                shrink-0
                transition-transform
                duration-300
                group-hover:rotate-45
              "
            />
          ) : (
            <Sun
              size={19}
              strokeWidth={1.8}
              className="
                shrink-0
                transition-transform
                duration-300
                group-hover:rotate-12
              "
            />
          )}

          <span
            className={`
              overflow-hidden
              whitespace-nowrap
              transition-all duration-200
              ${isOpen ? "w-auto opacity-100" : "w-0 opacity-0"}
            `}
          >
            {isDark ? "Modo escuro" : "Modo claro"}
          </span>
        </button>
      </div>
    </aside>
  );
}
