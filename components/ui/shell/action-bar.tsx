'use client';

import { Button } from '@/components/ui/shadcn/button';
import { Route } from '@/lib/routes';
import {
  ClipboardCheck,
  FolderKanban,
  Home,
  Inbox,
  LucideIcon,
  NotebookText,
  Settings,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export type ActionBarItem = {
  route: Route;
  label: string;
  icon: LucideIcon;
};

const getActionBarItems = (): ActionBarItem[] => {
  const items: ActionBarItem[] = [
    {
      route: '/',
      label: 'Home',
      icon: Home,
    },
    {
      route: '/inbox',
      label: 'Inbox',
      icon: Inbox,
    },
    {
      route: '/projects',
      label: 'Projects',
      icon: FolderKanban,
    },
    {
      route: '/tasks',
      label: 'Tasks',
      icon: ClipboardCheck,
    },
    {
      route: '/pages',
      label: 'Pages',
      icon: NotebookText,
    },
    {
      route: '/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];
  return items;
};

export const ActionBar = () => {
  const router = useRouter();
  const items = getActionBarItems();
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  const buttons = getActionBarButtons(items, handleNavigate);

  return (
    <div
      className={
        '[grid-area:sidebar] w-max flex flex-col h-full border-r shadow-md gap-3'
      }
    >
      {buttons}
    </div>
  );
};

const getActionBarButtons = (
  items: ActionBarItem[],
  onNavigate: (path: string) => void,
) => {
  return items.map((item) => (
    <ActionBarButton
      key={item.route}
      label={item.label}
      icon={item.icon}
      onClick={() => onNavigate(item.route)}
    />
  ));
};

type ActionBarButtonProps = {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
};

export const ActionBarButton = ({
  label,
  icon: Icon,
  onClick,
}: ActionBarButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="default"
      onClick={onClick}
      aria-label={label}
      className="h-13 w-13"
    >
      <Icon className="h-5 w-5" />
    </Button>
  );
};
