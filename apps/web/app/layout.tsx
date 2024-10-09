"use client";

import { useRouter } from "next/navigation";
import localFont from "next/font/local";
import "./globals.css";
import "@repo/ui/styles.css";
import { Shell } from "@repo/ui/shell/shell";
import { ActionBar } from "@repo/ui/shell/action-bar";
import { HeaderBar } from "@repo/ui/shell/header-bar";
import { Main } from "@repo/ui/shell/main";

const geistSans = localFont({
  src: "./_fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./_fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Shell>
          <HeaderBar>Header</HeaderBar>
          <ActionBar onNavigate={(path) => router.push(path)}></ActionBar>
          <Main>{children}</Main>
        </Shell>
      </body>
    </html>
  );
}
