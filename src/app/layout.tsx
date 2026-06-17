import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ordina – The Workspace for Clear, Connected Workflows",
    template: "%s | Ordina",
  },
  description:
    "Ordina helps teams organize work, automate workflows, and stay aligned — all in one connected workspace built for modern B2B teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-[var(--ordina-text)]">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
