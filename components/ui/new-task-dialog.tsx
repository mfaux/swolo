'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Project } from '@/db/types';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { ArrowUp, ClipboardCheck } from 'lucide-react';

type NewTaskDialogProps = {
  onOpenChange: () => void;
  projects: Project[];
};

const NewTaskDialog = ({ projects, onOpenChange }: NewTaskDialogProps) => {
  const projectItems = projects.map((project) => (
    <SelectItem key={project.id} value={project.id}>
      {project.name}
    </SelectItem>
  ));

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <VisuallyHidden.Root>
        <DialogDescription>Dialog for adding a new task</DialogDescription>
      </VisuallyHidden.Root>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle className="flex flex-row items-center gap-1">
            <ClipboardCheck />
            New Task
          </DialogTitle>
        </DialogHeader>
        <div className="pt-1 flex items-center space-x-2 gap-1">
          <Input autoFocus className="grow" />
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="(No project)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">(No project)</SelectItem>
              {projectItems}
            </SelectContent>
          </Select>
          <Button type="submit">
            <ArrowUp />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { NewTaskDialog };
