import { SidebarProvider } from '@/components/ui/sidebar';
import { fontSans } from '@/lib/fonts';
import { AppSidebar } from './_components/app-sidebar/app-sidebar';
import './globals.css';
import './icon.css';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const projects = await getProjects({ userId: 'fox' });

  return (
    <html lang="en" className={`${fontSans.variable}`}>
      <body>
        <SidebarProvider>
          <AppSidebar />
          <main>
            {/* <SidebarTrigger /> */}
            {children}
          </main>
        </SidebarProvider>
        {/* <Shell>
          <HeaderBar>
            <Toolbar projects={projects} />
          </HeaderBar>
          <ActionBar />        
          <Main>{children}</Main>
        </Shell> */}
      </body>
    </html>
  );
}
