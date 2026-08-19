"use client";

import {
  Plus,
  MessageSquare,
  History,
  Search,
  FolderKanban,
  GraduationCap,
  Monitor,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  {
    label: "Nova conversa",
    icon: Plus,
  },
  {
    label: "Chat",
    icon: MessageSquare,
  },
  {
    label: "Histórico",
    icon: History,
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
  {
    label: "Meu PC",
    icon: Monitor,
  },
];

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
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
      {/* HEADER */}
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
            flex items-center gap-3
            overflow-hidden
            transition-all duration-300
            ${isOpen ? "w-auto opacity-100" : "w-0 opacity-0"}
          `}
        >
          <img
            src="/assets/LOGO.png"
            alt="SAITE"
            className="h-9 w-auto object-contain"
          />
        </div>

        {/* TOGGLE */}
        <button
          onClick={onToggle}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          className="
            flex h-9 w-9 shrink-0 items-center
            justify-center rounded-lg
            text-[var(--foreground-secondary)]
            transition
            hover:bg-[var(--sidebar-hover)]
            hover:text-[var(--foreground)]
          "
        >
          {isOpen ? <PanelLeftClose size={19} /> : <PanelLeftOpen size={19} />}
        </button>
      </div>

      {/* MENU */}
      <nav
        className="
          flex flex-1 flex-col
          gap-1
          overflow-hidden
          px-3 py-5
        "
      >
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className={`
                group flex h-11 items-center
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
                  whitespace-nowrap
                  overflow-hidden
                  transition-all duration-200
                  ${isOpen ? "w-auto opacity-100" : "w-0 opacity-0"}
                `}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div
        className="
          border-t
          border-[var(--sidebar-border)]
          p-3
        "
      >
        <button
          className={`
            group flex h-11 w-full
            items-center rounded-xl
            text-sm
            text-[var(--foreground-secondary)]
            transition
            hover:bg-[var(--sidebar-hover)]
            hover:text-[var(--foreground)]
            ${isOpen ? "gap-3 px-3" : "justify-center px-0"}
          `}
        >
          <Settings
            size={19}
            strokeWidth={1.8}
            className="
              shrink-0
              transition-transform
              duration-300
              group-hover:rotate-45
            "
          />

          <span
            className={`
              whitespace-nowrap
              overflow-hidden
              transition-all duration-200
              ${isOpen ? "w-auto opacity-100" : "w-0 opacity-0"}
            `}
          >
            Configurações
          </span>
        </button>
      </div>
    </aside>
  );
}
