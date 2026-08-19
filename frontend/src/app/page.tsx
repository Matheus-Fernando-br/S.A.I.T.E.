"use client";

import { useState } from "react";

import Sidebar from "@/components/Sidebar";
import Chat from "@/components/Chat";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      className="
        flex h-screen w-full
        overflow-hidden
        bg-[var(--background)]
      "
    >
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((current) => !current)}
      />

      <Chat />
    </div>
  );
}
