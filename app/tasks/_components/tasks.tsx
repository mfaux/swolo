'use client';

import { Badge } from '@/components/ui/shadcn/badge';
import { Button } from '@/components/ui/shadcn/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/shadcn/dropdown-menu';
import { ScrollArea } from '@/components/ui/shadcn/scroll-area';
import { ProjectWithLabels, TaskWithLabels } from '@/shared/types';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import TaskDialog from '../../_components/task-dialog';
import { deleteTask } from '../actions';

type TasksProps = {
  tasks: TaskWithLabels[];
  projects: ProjectWithLabels[];
};

export default function Tasks({ tasks, projects }: TasksProps) {
  const [task, setTask] = useState<TaskWithLabels>();
  const [showEditor, setShowEditor] = useState(false);

  const handleTaskSelected = (task: TaskWithLabels) => {
    setTask(task);
    setShowEditor(true);
  };

  return (
    <ScrollArea>
      <div className="flex flex-col gap-4 p-4">
        {tasks.map((item) => (
          <TaskCard
            key={item.id}
            task={item}
            onTaskSelected={handleTaskSelected}
          />
        ))}
      </div>
      {showEditor && task && (
        <TaskDialog
          task={task}
          projects={projects}
          onClose={() => setShowEditor(false)}
        />
      )}
    </ScrollArea>
  );
}

type TaskCardProps = {
  task: TaskWithLabels;
  onTaskSelected: (task: TaskWithLabels) => void;
};

const TaskCard = ({ task, onTaskSelected }: TaskCardProps) => {
  const onDelete = async () => {
    const res = await deleteTask(task.id);

    if (res?.error) {
      toast('An error occurred', {
        description: res.error,
      });
    }
  };

  return (
    <Card
      className="w-full max-w-md transition-shadow hover:shadow-md relative"
      onClick={() => onTaskSelected(task)}
    >
      <CardHeader className="pl-6 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-bold">{task.title}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {task.description && (
          <p className="text-muted-foreground mb-4 line-clamp-3 text-left">
            {task.description?.substring(0, 300)}
          </p>
        )}
        {task.labels?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {task.labels.map((label, index) => (
              <Badge key={index} variant="secondary">
                {label.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
