"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  AgentStatus,
  AIStatus,
  ApiError,
  getAgentStatus,
  getAIStatus,
  UNAUTHORIZED_EVENT,
} from "@/services/api";

export type Connection =
  | { state: "loading" }
  | { state: "online"; ai: AIStatus }
  | { state: "backend-offline"; error: ApiError }
  | { state: "unauthorized" };

interface AppContextValue {
  connection: Connection;
  agent: AgentStatus | null;
  refreshStatus: () => Promise<void>;
  historyVersion: number;
  bumpHistory: () => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const POLL_MS = 30_000;

/**
 * Estado compartilhado: conectividade real do backend, da IA, do login e do agente
 * do computador (consultados periodicamente e ao voltar para a aba), além do
 * sinal para recarregar o histórico de conversas.
 */
export function AppProvider({ children }: { children: ReactNode }) {
  const [connection, setConnection] = useState<Connection>({ state: "loading" });
  const [agent, setAgent] = useState<AgentStatus | null>(null);
  const [historyVersion, setHistoryVersion] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const refreshStatus = useCallback(async () => {
    try {
      const ai = await getAIStatus();
      setConnection({ state: "online", ai });
      setAgent(await getAgentStatus().catch(() => null));
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setConnection({ state: "unauthorized" });
        setAgent(null);
        return;
      }
      setConnection({
        state: "backend-offline",
        error: error instanceof ApiError ? error : new ApiError("Backend indisponível.", 0),
      });
      setAgent(null);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const run = () => {
      if (active && document.visibilityState === "visible") void refreshStatus();
    };
    const first = window.setTimeout(run, 0);
    const timer = window.setInterval(run, POLL_MS);
    document.addEventListener("visibilitychange", run);
    const onUnauthorized = () => setConnection({ state: "unauthorized" });
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
      active = false;
      window.clearTimeout(first);
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", run);
    };
  }, [refreshStatus]);

  const bumpHistory = useCallback(() => setHistoryVersion((value) => value + 1), []);

  const value = useMemo(
    () => ({ connection, agent, refreshStatus, historyVersion, bumpHistory, mobileNavOpen, setMobileNavOpen }),
    [connection, agent, refreshStatus, historyVersion, bumpHistory, mobileNavOpen],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp deve ser usado dentro de AppProvider");
  return context;
}
