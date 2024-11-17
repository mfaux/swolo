'use client';

import ProjectDialog from '@/app/_components/project-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { ProjectWithLabels } from '@/shared/types';
import { ClipboardCheck, MoreHorizontal, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteProject } from '../actions';

type ProjectsProps = {
  projects: ProjectWithLabels[];
};

export default function Projects({ projects }: ProjectsProps) {
  const [project, setProject] = useState<ProjectWithLabels>();
  const [showEditor, setShowEditor] = useState(false);

  const handleProjectSelected = (project: ProjectWithLabels) => {
    setProject(project);
    setShowEditor(true);
  };

  return (
    <ScrollArea>
      <div className="flex flex-col gap-4 p-4">
        {projects.map((item) => (
          <ProjectCard
            key={item.id}
            project={item}
            onProjectSelected={handleProjectSelected}
          />
        ))}
      </div>
      {showEditor && project && (
        <ProjectDialog
          project={project}
          projects={projects}
          onClose={() => setShowEditor(false)}
        />
      )}
    </ScrollArea>
  );
}

type ProjectCardProps = {
  project: ProjectWithLabels;
  onProjectSelected: (project: ProjectWithLabels) => void;
};

const ProjectCard = ({ project, onProjectSelected }: ProjectCardProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const onDelete = async () => {
    const res = await deleteProject(project.id);

    if (res?.error) {
      toast({
        title: 'An error occurred',
        description: res.error,
      });
    }
  };

  return (
    <Card
      className="w-full max-w-md transition-shadow hover:shadow-md relative"
      onClick={() => onProjectSelected(project)}
    >
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
              <DropdownMenuItem
                onClick={(event) => {
                  event.stopPropagation();
                  router.push('/projects/' + project.id);
                }}
              >
                <ClipboardCheck className="mr-2 h-4 w-4" />
                <span>Go to tasks</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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
        {project.description && (
          <p className="text-muted-foreground mb-4 line-clamp-3 text-left">
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
