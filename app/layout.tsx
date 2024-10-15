'use client';

import { ActionBar } from '@/components/ui/shell/action-bar';
import { HeaderBar } from '@/components/ui/shell/header-bar';
import { Main } from '@/components/ui/shell/main';
import { Shell } from '@/components/ui/shell/shell';
import { Toolbar } from '@/components/ui/toolbar';
import localFont from 'next/font/local';
import { useRouter } from 'next/navigation';
import './globals.css';

const geistSans = localFont({
  src: './_fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: './_fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
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
          <HeaderBar>
            <Toolbar />
          </HeaderBar>
          <ActionBar onNavigate={(path) => router.push(path)}></ActionBar>
          <Main>{children}</Main>
        </Shell>
      </body>
    </html>
  );
}
