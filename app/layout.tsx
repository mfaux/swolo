import { SidebarInset, SidebarProvider } from '@/components/ui/shadcn/sidebar';
import { Toaster } from '@/components/ui/shadcn/sonner';
import { HeaderBar } from '@/components/ui/shell/header-bar';
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
  // TODO: get query out of layout
  const projects = await getProjects({ workspaceId: 'work' });

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
            <Toaster />
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
