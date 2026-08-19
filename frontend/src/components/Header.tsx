import AIAvatar from "./AIAvatar";

export default function Header() {
  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#0c0d12] px-6">
      <div className="flex items-center gap-3">
        <AIAvatar size="sm" />

        <div>
          <h2 className="text-sm font-semibold">Athena</h2>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

            <span className="text-[11px] text-zinc-500">Online</span>
          </div>
        </div>
      </div>

      <button className="rounded-lg px-3 py-2 text-xs text-zinc-400 transition hover:bg-white/[0.05] hover:text-white">
        Athena
      </button>
    </header>
  );
}
