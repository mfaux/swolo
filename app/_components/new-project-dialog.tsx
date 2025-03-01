'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog';
import { Input } from '@/components/ui/shadcn/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcn/select';
import { SubmitButton } from '@/components/ui/submit-button';
import { ProjectWithLabels } from '@/shared/types';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { FolderKanban } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { createProject } from './actions';

type NewProjectDialogProps = {
  projects: ProjectWithLabels[];
  isOpen: boolean;
  onOpenChange: () => void;
};

const NewProjectDialog = ({
  projects,
  isOpen,
  onOpenChange,
}: NewProjectDialogProps) => {
  const status = useFormStatus();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const res = await createProject(formData);
    if (res.success) {
      onOpenChange();
    } else {
      if (res?.error) {
        toast('An error occurred', {
          description: res.error,
        });
      }
    }
  };

  const projectItems = projects.map((project) => (
    <SelectItem key={project.id} value={project.id}>
      {project.name}
    </SelectItem>
  ));

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <VisuallyHidden.Root>
        <DialogDescription>Dialog for adding a new project</DialogDescription>
      </VisuallyHidden.Root>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle className="flex flex-row items-center gap-1">
            <FolderKanban />
            New Project
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="pt-1 flex items-center space-x-2 gap-1">
            <Input name="projectName" required autoFocus className="grow" />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="(No parent)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">No parent</SelectItem>
                {projectItems}
              </SelectContent>
            </Select>
            <SubmitButton isPending={status.pending} />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { NewProjectDialog };
