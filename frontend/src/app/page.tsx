"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Chat from "@/components/Chat";
import PCStatus from "@/components/PCStatus";

export default function Home() {
  const [activePage, setActivePage] = useState("chat");

  return (
    <main className="flex h-screen overflow-hidden bg-[#08090d] text-white">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <section className="flex min-w-0 flex-1 flex-col">
        <Header />

        <div className="flex min-h-0 flex-1">
          <div className="min-w-0 flex-1">
            {activePage === "chat" && <Chat />}

            {activePage === "cv" && (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl">📄</p>
                  <h2 className="mt-4 text-xl font-semibold">
                    Análise de Currículo
                  </h2>
                  <p className="mt-2 text-sm text-zinc-500">Em breve.</p>
                </div>
              </div>
            )}

            {activePage === "search" && (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl">🔎</p>
                  <h2 className="mt-4 text-xl font-semibold">Pesquisa</h2>
                  <p className="mt-2 text-sm text-zinc-500">Em breve.</p>
                </div>
              </div>
            )}

            {activePage === "settings" && (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl">⚙️</p>
                  <h2 className="mt-4 text-xl font-semibold">Configurações</h2>
                  <p className="mt-2 text-sm text-zinc-500">Em breve.</p>
                </div>
              </div>
            )}
          </div>

          <PCStatus />
        </div>
      </section>
    </main>
  );
}
