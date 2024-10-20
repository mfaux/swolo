'use client';

import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TaskWithLabels } from '@/db/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type TasksProps = {
  tasks: TaskWithLabels[];
};

export default function Tasks({ tasks }: TasksProps) {
  const [task, setTask] = useState({ selected: '' });
  return (
    <ScrollArea className="h-screen">
      <Label>Tasks</Label>

      <div className="flex flex-col gap-4 p-4">
        {tasks.map((item) => (
          <button
            key={item.id}
            className={cn(
              'flex flex-col items-start gap-3 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent max-w-96 shadow-sm',
              task.selected === item.id && 'bg-muted',
            )}
            onClick={() =>
              setTask({
                ...task,
                selected: item.id,
              })
            }
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
      </div>
    </ScrollArea>
  );
}
