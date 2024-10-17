import { Toolbar } from '@/app/_components/toolbar';
import { ActionBar } from '@/components/ui/shell/action-bar';
import { HeaderBar } from '@/components/ui/shell/header-bar';
import { Main } from '@/components/ui/shell/main';
import { Shell } from '@/components/ui/shell/shell';
import { getProjects } from '@/db/queries';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './_fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: './_fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const projects = await getProjects({ userId: 'fox' });

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Shell>
          <HeaderBar>
            <Toolbar projects={projects} />
          </HeaderBar>
          <ActionBar />
          <Main>{children}</Main>
        </Shell>
      </body>
    </html>
  );
}
