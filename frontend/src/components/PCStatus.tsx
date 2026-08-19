import { Cpu, MemoryStick, Activity, HardDrive } from "lucide-react";

const stats = [
  {
    label: "CPU",
    value: "32%",
    icon: Cpu,
  },
  {
    label: "RAM",
    value: "54%",
    icon: MemoryStick,
  },
  {
    label: "Disco",
    value: "18%",
    icon: HardDrive,
  },
];

export default function PCStatus() {
  return (
    <aside className="hidden w-[280px] shrink-0 border-l border-white/[0.06] bg-[#0c0d12] xl:block">
      <div className="border-b border-white/[0.06] p-5">
        <div className="flex items-center gap-2">
          <Activity size={16} />

          <h3 className="text-sm font-semibold">Meu PC</h3>
        </div>

        <p className="mt-1 text-xs text-zinc-600">Monitoramento do sistema</p>
      </div>

      <div className="space-y-3 p-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Icon size={16} />

                  <span className="text-xs">{stat.label}</span>
                </div>

                <span className="text-sm font-semibold">{stat.value}</span>
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-white"
                  style={{
                    width: stat.value,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mx-4 mt-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <p className="text-[11px] text-zinc-600">Sistema</p>

        <p className="mt-1 text-sm font-medium">Aguardando conexão</p>

        <p className="mt-2 text-[10px] leading-5 text-zinc-600">
          As informações reais do computador serão disponibilizadas
          posteriormente pelo agente local.
        </p>
      </div>
    </aside>
  );
}
