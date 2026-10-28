import type { Metadata, Viewport } from "next";
import "./globals.css";

import { AppProvider } from "@/components/AppProvider";
import AppShell from "@/components/AppShell";
import { ThemeProvider, themeInitScript } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "S.A.I.T.E.",
  description: "Superior Advanced Intelligence Technological Entity — sua IA pessoal local",
  icons: { icon: "/brand/logo-mark.png" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f8fb" },
    { media: "(prefers-color-scheme: dark)", color: "#080a0f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <ToastProvider>
            <AppProvider>
              <AppShell>{children}</AppShell>
            </AppProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
