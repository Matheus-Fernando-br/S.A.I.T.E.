"use client";

import { LoaderCircle, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, Suspense, useEffect, useState } from "react";

import { useApp } from "@/components/AppProvider";
import LoginScreen from "@/components/LoginScreen";
import Sidebar from "@/components/Sidebar";

/** O plano gratuito do Render "dorme" sem uso; a primeira requisição pode levar ~1 minuto. */
function WakeNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 4000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;
  return (
    <div
      role="status"
      className="animate-fade-up fixed bottom-24 left-1/2 z-[150] flex w-[min(92vw,420px)] -translate-x-1/2 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] px-4 py-3 text-sm shadow-[var(--shadow-md)]"
    >
      <LoaderCircle size={17} className="shrink-0 animate-spin text-[var(--accent)]" aria-hidden />
      <span className="text-[var(--foreground-secondary)]">
        Iniciando o servidor na nuvem… no plano gratuito isso pode levar até 1 minuto.
      </span>
    </div>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { setMobileNavOpen, connection } = useApp();

  if (connection.state === "unauthorized") {
    return <LoginScreen />;
  }

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
        {connection.state === "loading" && <WakeNotice />}
      </div>
    </div>
  );
}
