"use client";

import {
  MessageSquare,
  FileText,
  Search,
  Monitor,
  Settings,
  Plus,
  Bot,
} from "lucide-react";

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  {
    id: "chat",
    label: "Chat",
    icon: MessageSquare,
  },
  {
    id: "cv",
    label: "Currículo",
    icon: FileText,
  },
  {
    id: "search",
    label: "Pesquisa",
    icon: Search,
  },
  {
    id: "pc",
    label: "Meu PC",
    icon: Monitor,
  },
];

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="flex w-[250px] shrink-0 flex-col border-r border-white/[0.06] bg-[#0c0d12]">
      {/* Logo */}
      <div className="flex h-[72px] items-center gap-3 border-b border-white/[0.06] px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
          <Bot size={22} />
        </div>

        <div>
          <h1 className="text-sm font-semibold">AI Agent</h1>

          <p className="text-[11px] text-zinc-500">Personal Assistant</p>
        </div>
      </div>

      {/* Nova conversa */}
      <div className="p-4">
        <button
          onClick={() => onNavigate("chat")}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium transition hover:bg-white/[0.08]"
        >
          <Plus size={17} />
          Nova conversa
        </button>
      </div>

      {/* Navegação */}
      <nav className="flex-1 space-y-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                isActive
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Perfil */}
      <div className="border-t border-white/[0.06] p-3">
        <button
          onClick={() => onNavigate("settings")}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
            activePage === "settings"
              ? "bg-white text-black"
              : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
          }`}
        >
          <Settings size={18} />

          <div className="text-left">
            <p className="font-medium">Configurações</p>
            <p className="text-[10px] opacity-60">Personalizar agente</p>
          </div>
        </button>
      </div>
    </aside>
  );
}
