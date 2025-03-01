'use client';

import { BookOpen, ClipboardCheck, FolderKanban, Inbox } from 'lucide-react';
import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from '@/components/ui/shadcn/sidebar';
import { SVGIcon } from '@/components/ui/svg-icon';
import Link from 'next/link';
import { NavCapture } from './nav-capture';
import { NavPages } from './nav-pages';
import { NavPlan } from './nav-plan';
import { NavUser } from './nav-user';

const data = {
  user: {
    name: 'Fox',
    email: 'michael.faux@gmail.com',
    // avatar: '/avatars/fox.jpg',
  },
  navCapture: [
    {
      name: 'Inbox',
      url: '/inbox',
      icon: Inbox,
    },
  ],
  navPlan: [
    {
      name: 'Projects',
      url: '/projects',
      icon: FolderKanban,
    },
    {
      name: 'Tasks',
      url: '/tasks',
      icon: ClipboardCheck,
    },
  ],
  navPages: [
    {
      name: 'Pages',
      url: '/pages',
      icon: BookOpen,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton size="lg" asChild>
          <Link href="/">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
              <SVGIcon src="/swolo.svg" alt="Logo" className="" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-semibold">Swolo</span>
              <span className="text-xs">v0.1.0</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavCapture items={data.navCapture} />
        <NavPlan items={data.navPlan} />
        <NavPages items={data.navPages} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
