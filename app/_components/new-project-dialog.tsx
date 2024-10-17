'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { SubmitButton } from '@/components/ui/submit-button';
import { Project } from '@/db/types';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { useActionStateCompat } from '@strozw/use-action-state-compat';
import { FolderKanban } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createProject } from './actions';

type NewProjectDialogProps = {
  onOpenChange: () => void;
  projects: Project[];
};

const NewProjectDialog = ({
  projects,
  onOpenChange,
}: NewProjectDialogProps) => {
  const [open, setOpen] = useState(true);
  const [state, formAction, isPending] = useActionStateCompat(
    createProject,
    null,
  );

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
    }
  }, [state]);

  const projectItems = projects.map((project) => (
    <SelectItem key={project.id} value={project.id}>
      {project.name}
    </SelectItem>
  ));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <VisuallyHidden.Root>
        <DialogDescription>Dialog for adding a new project</DialogDescription>
      </VisuallyHidden.Root>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle className="flex flex-row items-center gap-1">
            <FolderKanban />
            New Project
          </DialogTitle>
        </DialogHeader>
        {state?.error && (
          <div className="mb-4">
            <Alert variant="destructive" className="relative">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          </div>
        )}
        <form action={formAction}>
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
            <SubmitButton isPending={isPending} />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { NewProjectDialog };
