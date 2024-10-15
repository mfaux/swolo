'use client';

import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Project } from '@/db/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type ProjectsProps = {
  projects: Project[];
};

export default function Projects({ projects }: ProjectsProps) {
  const [task, setTask] = useState({ selected: '' });
  return (
    <ScrollArea className="h-screen">
      <Label>Projects</Label>

      <div className="flex flex-col gap-4 p-4">
        {projects.map((item) => (
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
                  <div className="font-semibold">{item.name}</div>
                </div>
              </div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {item.description?.substring(0, 300)}
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
