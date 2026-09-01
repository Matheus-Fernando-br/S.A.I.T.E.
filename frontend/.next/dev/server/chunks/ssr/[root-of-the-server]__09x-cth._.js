module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/app/favicon.ico (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/favicon.2vob68tjqpejf.ico" + (globalThis["NEXT_CLIENT_ASSET_SUFFIX"] || ''));}),
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$favicon$2e$ico__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/app/favicon.ico (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$favicon$2e$ico__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 256,
    height: 256
};
}),
"[project]/src/app/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {

```typescript
"use client";

import { useState } from "react";

import Sidebar from "@/components/Sidebar";
import Chat from "@/components/Chat";

import { createConversation } from "@/services/api";

// Usuário temporário para desenvolvimento.
// Depois será substituído pelo usuário autenticado.
const DEV_USER_ID = "00000000-0000-0000-0000-000000000001";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [conversationId, setConversationId] = useState<string | null>(null);

  const [refreshHistory, setRefreshHistory] = useState(0);

  async function handleNewConversation() {
    try {
      const conversation = await createConversation(
        DEV_USER_ID,
        "Nova conversa"
      );

      setConversationId(conversation.id);

      setRefreshHistory((value) => value + 1);
    } catch (error) {
      console.error("Erro ao criar conversa:", error);
    }
  }

  function handleSelectConversation(id: string) {
    setConversationId(id);
  }

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
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
        refreshHistory={refreshHistory}
      />

      <Chat conversationId={conversationId} />
    </div>
  );
}
```;
}),
"[project]/src/app/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__09x-cth._.js.map