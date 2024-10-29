import { HeaderBar } from '@/components/ui/shell/header-bar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getProjects } from '@/db/queries';
import { fontSans } from '@/lib/fonts';
import { AppSidebar } from './_components/app-sidebar/app-sidebar';
import { Toolbar } from './_components/toolbar';
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
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <HeaderBar>
              <Toolbar projects={projects} />
            </HeaderBar>
            <main className="p-4">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
