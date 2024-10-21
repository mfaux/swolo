import { Toolbar } from '@/app/_components/toolbar';
import { ActionBar } from '@/components/ui/shell/action-bar';
import { HeaderBar } from '@/components/ui/shell/header-bar';
import { Main } from '@/components/ui/shell/main';
import { Shell } from '@/components/ui/shell/shell';
import { getProjects } from '@/db/queries';
import { fontSans } from '@/lib/fonts';
import './globals.css';
import './icon.css';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const projects = await getProjects({ userId: 'fox' });

  return (
    <html lang="en" className={`${fontSans.variable}`}>
      <body>
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
