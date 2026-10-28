"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, Suspense, useState } from "react";

import { useApp } from "@/components/AppProvider";
import Sidebar from "@/components/Sidebar";

export default function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { setMobileNavOpen } = useApp();

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[var(--background)]">
      <a
        href="#conteudo"
        className="sr-only z-[300] rounded-lg bg-[var(--accent)] px-3 py-2 text-sm text-[var(--accent-foreground)] focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Pular para o conteúdo
      </a>

      <Suspense fallback={<div className="hidden w-64 border-r border-[var(--sidebar-border)] lg:block" />}>
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((current) => !current)} />
      </Suspense>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Barra superior apenas no mobile/tablet */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[var(--border)] bg-[var(--sidebar-background)] px-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Abrir menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--foreground-secondary)] hover:bg-[var(--sidebar-hover)]"
          >
            <Menu size={20} />
          </button>
          <Link href="/" className="flex items-center gap-2" aria-label="S.A.I.T.E. — início">
            <Image src="/brand/logo-mark.png" alt="" width={26} height={26} className="h-[26px] w-[26px]" />
            <Image src="/brand/title.png" alt="S.A.I.T.E." width={90} height={16} className="h-4 w-auto" />
          </Link>
        </header>

        <main id="conteudo" className="relative flex min-h-0 flex-1 flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
