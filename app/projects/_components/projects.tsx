'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Project } from '@/db/types';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';

type ProjectsProps = {
  projects: Project[];
};

export default function Projects({ projects }: ProjectsProps) {
  // const [currentProject, setCurrentProject] = useState({ selected: '' });
  return (
    <ScrollArea className="h-screen">
      <Label>Projects</Label>

      <div className="flex flex-col gap-4 p-4">
        {projects.map((item) => (
          <ProjectCard key={item.key} project={item} />
        ))}
      </div>
    </ScrollArea>
  );
}

type ProjectCardProps = {
  project: Project;
};

const ProjectCard = ({ project }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const parentProject = {
    name: 'temp',
  };
  const labels = ['temp'];
  const onDelete = () => {
    console.log('delete');
  };

  return (
    <Card className="w-full max-w-md transition-shadow hover:shadow-md relative">
      <CardHeader className="pl-6 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-bold">{project.name}</CardTitle>
            {project.key && (
              <span className="text-xs font-mono pl-1">{project.key}</span>
            )}
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
              <DropdownMenuItem onClick={onDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{project.description}</p>
        {labels.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {labels.map((label, index) => (
              <Badge key={index} variant="secondary">
                {label}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
