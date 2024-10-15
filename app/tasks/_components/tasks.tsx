'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Task } from '@/db/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type TasksProps = {
  tasks: Task[];
};

export default function Tasks({ tasks }: TasksProps) {
  const [task, setTask] = useState({ selected: '' });
  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {tasks.map((item) => (
          <button
            key={item.id}
            className={cn(
              'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent',
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
                  {/* {!item.read && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )} */}
                </div>
                {/* <div
                  className={cn(
                    'ml-auto text-xs',
                    mail.selected === item.id
                      ? 'text-foreground'
                      : 'text-muted-foreground',
                  )}
                >
                  {formatDistanceToNow(new Date(item.date), {
                    addSuffix: true,
                  })}
                </div> */}
              </div>
              {/* <div className="text-xs font-medium">{item.}</div> */}
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {item.description?.substring(0, 300)}
            </div>
            {/* {item.labels.length ? (
              <div className="flex items-center gap-2">
                {item.labels.map((label) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null} */}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
