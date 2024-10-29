'use client';

import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProjectWithLabels, TaskWithLabels } from '@/db/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import TaskDialog from './task-dialog';

type TasksProps = {
  tasks: TaskWithLabels[];
  projects: ProjectWithLabels[];
};

export default function Tasks({ tasks, projects }: TasksProps) {
  const [task, setTask] = useState<TaskWithLabels>();
  const [showEditor, setShowEditor] = useState(false);

  return (
    <ScrollArea>
      <div className="flex flex-col gap-4 p-4">
        {tasks.map((item) => (
          <button
            key={item.id}
            className={cn(
              'flex flex-col items-start gap-3 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent max-w-96 shadow-sm',
            )}
            onClick={() => {
              setTask(item);
              setShowEditor(true);
            }}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item.title}</div>
                </div>
              </div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {item.description?.substring(0, 300)}
            </div>
            {item.labels?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.labels.map((label, index) => (
                  <Badge key={index} variant="secondary">
                    {label.name}
                  </Badge>
                ))}
              </div>
            )}
          </button>
        ))}

        {showEditor && task && (
          <TaskDialog
            task={task}
            projects={projects}
            onClose={() => setShowEditor(false)}
          />
        )}
      </div>
    </ScrollArea>
  );
}
