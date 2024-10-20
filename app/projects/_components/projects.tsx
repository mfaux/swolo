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
import { ProjectWithLabels } from '@/db/types';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { deleteProject } from '../actions';

type ProjectsProps = {
  projects: ProjectWithLabels[];
};

export default function Projects({ projects }: ProjectsProps) {
  return (
    <ScrollArea className="h-screen">
      <Label>Projects</Label>

      <div className="flex flex-col gap-4 p-4">
        {projects.map((item) => (
          <ProjectCard key={item.id} project={item} />
        ))}
      </div>
    </ScrollArea>
  );
}

type ProjectCardProps = {
  project: ProjectWithLabels;
};

const ProjectCard = ({ project }: ProjectCardProps) => {
  const onDelete = () => {
    deleteProject(project.id);
  };

  return (
    <Card className="w-full max-w-md transition-shadow hover:shadow-md relative ">
      <CardHeader className="pl-6 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-bold">{project.name}</CardTitle>
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
        {project.description && (
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {project.description?.substring(0, 300)}
          </p>
        )}
        {project.labels?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.labels.map((label, index) => (
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
