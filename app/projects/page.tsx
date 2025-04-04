import { projectRepo } from '@/db/repos/project-repo';
import Projects from './_components/projects';

export default async function ProjectsPage() {
  const projects = await projectRepo.getMany({
    workspaceId: 'work',
  });
  return <Projects projects={projects} />;
}
