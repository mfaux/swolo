import { Badge } from '@/components/ui/shadcn/badge';
import { Button } from '@/components/ui/shadcn/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/shadcn/form';
import { Input } from '@/components/ui/shadcn/input';
import { Label } from '@/components/ui/shadcn/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcn/select';
import { Textarea } from '@/components/ui/shadcn/textarea';
import {
  __SWOLO_NONE_SELECTED,
  ProjectFormData,
  projectFormSchema,
  ProjectWithLabels,
} from '@/shared/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowUp,
  CircleChevronLeft,
  CircleChevronRight,
  FolderKanban,
  Tags,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { upsertProject } from './actions';

type ProjectDialogProps = {
  project?: ProjectWithLabels;
  projects: ProjectWithLabels[];
  isOpen?: boolean;
  onClose: () => void;
};

export default function ProjectDialog({
  project,
  projects,
  isOpen = true,
  onClose,
}: ProjectDialogProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const form = useForm<ProjectFormData>({
    mode: 'onSubmit',
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: project?.name ?? '',
      description: project?.description ?? '',
      parentProjectId: project?.parentProjectId ?? __SWOLO_NONE_SELECTED,
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    const res = await upsertProject(data, project?.id);

    if (res?.success) {
      onClose();
    } else if (res?.fieldErrors) {
      for (const key in res.fieldErrors) {
        form.setError(key as keyof ProjectFormData, {
          message: res.fieldErrors[key as keyof ProjectFormData]?.join(', '),
        });
      }
    } else if (res?.error) {
      toast('An error occurred', {
        description: res.error,
      });
    }
  };

  const togglePanel = () => setIsPanelOpen(!isPanelOpen);

  const labelBadges = project?.labels?.map((label, index) => (
    <Badge key={index} variant="secondary">
      {label.name}
    </Badge>
  ));

  const projectItems = projects.map((project) => (
    <SelectItem key={project.id} value={project.id}>
      {project.name}
    </SelectItem>
  ));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px]" showClose={false}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex flex-row items-center gap-1">
            <FolderKanban />
            {!project ? 'New Project' : 'Edit Project'}
          </DialogTitle>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={togglePanel}>
              {isPanelOpen ? <CircleChevronLeft /> : <CircleChevronRight />}
            </Button>
            <DialogClose asChild>
              <Button variant="ghost" size="icon">
                <X />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex">
              <div className="grow pr-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Enter a name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Enter a decription"
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-wrap">
                      <Button
                        variant={'ghost'}
                        onClick={() => alert('not yet implemented')}
                      >
                        <Tags />
                      </Button>
                      <div className="flex flex-wrap gap-2"> {labelBadges}</div>
                    </div>
                  </div>
                </div>
              </div>
              {isPanelOpen && (
                <div className="w-64 border-l pl-4 space-y-4">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name={'parentProjectId'}
                      render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="project">Parent project</Label>

                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger id="project">
                                <SelectValue placeholder="(No parent project)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem
                                key={__SWOLO_NONE_SELECTED}
                                value={__SWOLO_NONE_SELECTED}
                              >
                                (No project)
                              </SelectItem>
                              {projectItems}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Created At</Label>
                    <p className="text-sm text-gray-500">
                      <span>{project?.createdAt?.toLocaleString()} </span>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Updated At</Label>
                    <p className="text-sm text-gray-500">
                      <span>
                        {project?.updatedAt?.toLocaleString() ??
                          'No updates since creation'}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <Button type="submit">
                <ArrowUp />
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
