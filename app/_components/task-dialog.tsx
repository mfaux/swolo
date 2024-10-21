import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ProjectWithLabels, TaskWithLabels } from '@/db/types';
import {
  ArrowUp,
  CircleChevronLeft,
  CircleChevronRight,
  Tags,
  X,
} from 'lucide-react';
import { useState } from 'react';

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
  const [labels, setLabels] = useState<string[]>([]);

  const togglePanel = () => setIsPanelOpen(!isPanelOpen);

  const labelBadges = task?.labels.map((label, index) => (
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
          <DialogTitle>{!task ? 'Create Task' : 'Edit Task'}</DialogTitle>
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
        <div className="flex">
          <div className="grow pr-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="title"
                  placeholder="Enter a title"
                  defaultValue={task?.title}
                  className="text-xl font-bold py-6"
                  autoFocus={!task}
                />
              </div>
              <div className="space-y-2">
                <Textarea
                  id="description"
                  placeholder="Enter a decription"
                  defaultValue={task?.description || ''}
                  className="min-h-[150px]"
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
                <div className="flex space-x-2">
                  {/* <Input
                    placeholder="Add a label"
                    value={newLabel}
                    onChange={(e) =>flex flex-col grow setNewLabel(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addLabel()}
                  />
                  <Button onClick={addLabel} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button> */}
                </div>
              </div>
            </div>
          </div>
          {isPanelOpen && (
            <div className="w-64 border-l pl-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <Select>
                  <SelectTrigger id="project">
                    <SelectValue placeholder="(No project)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">(No project)</SelectItem>
                    {projectItems}
                  </SelectContent>
                </Select>
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
                <p className="text-sm text-gray-500">2023-05-20 10:30 AM</p>
              </div>
              <div className="space-y-2">
                <Label>Updated At</Label>
                <p className="text-sm text-gray-500">2023-05-21 2:45 PM</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-6">
          <Button type="submit">
            <ArrowUp />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
