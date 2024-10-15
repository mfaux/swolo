import { Button } from '@/components/ui/button';
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

export type ActionBarProps = {
  onNavigate: (path: string) => void;
};

export const ActionBar = ({ onNavigate }: ActionBarProps) => {
  const items = getActionBarItems();
  const buttons = getActionBarButtons(items, onNavigate);

  return (
    <div
      className={
        '[grid-area:actionbar] w-max flex flex-col h-full border-r shadow-md'
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
      className="h-12 w-12"
    >
      <Icon className="h-6 w-6" />
    </Button>
  );
};
