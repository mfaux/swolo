'use client';

import { Input } from '@/components/ui/input';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { Plus, Search } from 'lucide-react';

import { ProjectWithLabels } from '@/shared/types';
import { useState } from 'react';
import ProjectDialog from './project-dialog';
import TaskDialog from './task-dialog';

type ToolbarProps = {
  projects: ProjectWithLabels[];
};

const Toolbar = ({ projects }: ToolbarProps) => {
  const [showNewProject, setShowNewProject] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);

  return (
    <div className="flex flex-row justify-center items-center">
      <Menubar className="group m-2 focus:bg-secondary/80 hover:bg-secondary/80 group-hover:bg-secondary/80">
        <MenubarMenu>
          <MenubarTrigger>
            <div className="w-6">
              <Plus />
            </div>
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
        <ProjectDialog
          projects={projects}
          isOpen={showNewProject}
          onClose={() => setShowNewProject(false)}
        />
        <TaskDialog
          projects={projects}
          isOpen={showNewTask}
          onClose={() => setShowNewTask(false)}
        />
      </Menubar>

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
export { Toolbar };
