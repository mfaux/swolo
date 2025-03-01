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
  ProjectWithLabels,
  TaskFormData,
  taskFormSchema,
  TaskWithLabels,
} from '@/shared/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowUp,
  CircleChevronLeft,
  CircleChevronRight,
  ClipboardCheck,
  Tags,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { upsertTask } from './actions';

type TaskDialogProps = {
  task?: TaskWithLabels;
  projects: ProjectWithLabels[];
  isOpen?: boolean;
  onClose: () => void;
};

export default function TaskDialog({
  task,
  projects,
  isOpen = true,
  onClose,
}: TaskDialogProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // const [labels, setLabels] = useState<string[]>([]);

  const form = useForm<TaskFormData>({
    mode: 'onSubmit',
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      status: task?.status ?? '',
      projectId: task?.projectId ?? __SWOLO_NONE_SELECTED,
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    const res = await upsertTask(data, task?.id);

    if (res?.success) {
      onClose();
    } else if (res?.fieldErrors) {
      for (const key in res.fieldErrors) {
        form.setError(key as keyof TaskFormData, {
          message: res.fieldErrors[key as keyof TaskFormData]?.join(', '),
        });
      }
    } else if (res?.error) {
      toast('An error occurred', {
        description: res.error,
      });
    }
  };

  const togglePanel = () => setIsPanelOpen(!isPanelOpen);

  const labelBadges = task?.labels?.map((label, index) => (
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
            <ClipboardCheck />
            {!task ? 'New Task' : 'Edit Task'}
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
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Enter a title" {...field} />
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
                      name={'projectId'}
                      render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="project">Project</Label>

                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger id="project">
                                <SelectValue placeholder="(No project)" />
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
                    <Label htmlFor="status">Status</Label>
                    <Select>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="inprogress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input id="dueDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Created At</Label>
                    <p className="text-sm text-gray-500">
                      <span>{task?.createdAt?.toLocaleString()} </span>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Updated At</Label>
                    <p className="text-sm text-gray-500">
                      <span>
                        {task?.updatedAt?.toLocaleString() ??
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
