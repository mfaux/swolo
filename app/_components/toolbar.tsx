'use client';

import { Input } from '@/components/ui/input';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { ChevronDown, Plus, Search } from 'lucide-react';

import { NewProjectDialog } from '@/app/_components/new-project-dialog';
import { Button } from '@/components/ui/button';
import { ProjectWithLabels } from '@/db/types';
import { useState } from 'react';
import TaskDialog from './task-dialog';

type ToolbarProps = {
  projects: ProjectWithLabels[];
};

const Toolbar = ({ projects }: ToolbarProps) => {
  const [showNewTask, setShowNewTask] = useState(false);

  return (
    <div className="flex flex-row justify-center items-center">
      <Button
        variant={'outline'}
        aria-label="New Task"
        onClick={() => setShowNewTask(true)}
      >
        <Plus />
      </Button>

      <NewItemMenu projects={projects} />

      <div className="flex items-center bg-gray-100 rounded-full p-1 w-fit">
        <div className="mx-2 relative">
          <Search className="h-4 w-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            className="pr-8 h-8 w-40 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            type="text"
          />
        </div>
      </div>

      {showNewTask && (
        <TaskDialog projects={projects} onClose={() => setShowNewTask(false)} />
      )}
    </div>
  );
};

type NewItemMenuProps = {
  projects: ProjectWithLabels[];
};

const NewItemMenu = ({ projects }: NewItemMenuProps) => {
  const [showNewProject, setShowNewProject] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);

  return (
    <Menubar className="group m-2 focus:bg-secondary/80 hover:bg-secondary/80 group-hover:bg-secondary/80">
      <MenubarMenu>
        <MenubarTrigger className="px-0">
          <ChevronDown className="w-4 h-4" />
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => setShowNewTask(true)}>
            New Task
          </MenubarItem>
          <MenubarItem onClick={() => setShowNewProject(true)}>
            New Project
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <NewProjectDialog
        projects={projects}
        isOpen={showNewProject}
        onOpenChange={() => setShowNewProject(false)}
      />
      {showNewTask && (
        <TaskDialog projects={projects} onClose={() => setShowNewTask(false)} />
      )}
    </Menubar>
  );
};

export { Toolbar };
