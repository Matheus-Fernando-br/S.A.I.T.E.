"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { LockKeyhole } from "lucide-react";

import { useApp } from "@/components/AppProvider";
import { useTheme } from "@/components/ThemeProvider";
import Button from "@/components/ui/Button";
import { inputClass } from "@/components/ui/States";
import { errorMessage } from "@/lib/format";
import { ApiError, login } from "@/services/api";

/** Entrada com a senha do dono. A sessão vale neste dispositivo; os dados são os mesmos em todos. */
export default function LoginScreen() {
  const { refreshStatus, bumpHistory } = useApp();
  const { theme } = useTheme();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!password) return;
    setBusy(true);
    setError(null);
    try {
      await login(password);
      setPassword("");
      await refreshStatus();
      bumpHistory();
    } catch (loginError) {
      setError(
        loginError instanceof ApiError && loginError.status === 429
          ? "Muitas tentativas. Aguarde alguns minutos."
          : errorMessage(loginError),
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-[var(--background)] px-5 py-10">
      <form
        onSubmit={submit}
        className="animate-pop-in flex w-full max-w-sm flex-col items-center rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)] p-6 shadow-[var(--shadow-lg)]"
      >
        <Image
          src={theme === "dark" ? "/brand/logo-full-light-text.png" : "/brand/logo-full-dark-text.png"}
          alt="S.A.I.T.E."
          width={560}
          height={727}
          priority
          className="h-36 w-auto drop-shadow-[0_0_24px_var(--accent-glow)]"
        />
        <h1 className="mt-4 flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
          <LockKeyhole size={18} className="text-[var(--accent)]" aria-hidden /> Entrar
        </h1>
        <p className="mt-1 text-center text-sm leading-6 text-[var(--foreground-secondary)]">
          Suas conversas e documentos ficam sincronizados em todos os seus dispositivos.
        </p>
        <label htmlFor="password" className="sr-only">
          Senha
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          placeholder="Senha"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={`${inputClass} mt-5 h-11`}
        />
        {error && (
          <p role="alert" className="mt-2 w-full text-sm text-[var(--danger)]">
            {error}
          </p>
        )}
        <Button type="submit" variant="primary" loading={busy} disabled={!password} className="mt-4 w-full">
          Entrar
        </Button>
      </form>
    </div>
  );
}
