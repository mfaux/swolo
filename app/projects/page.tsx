import { getProjects } from '@/db/queries';
import Projects from './_components/projects';

export default async function ProjectsPage() {
  const projects = await getProjects({
    workspaceId: 'work',
  });
  return <Projects projects={projects} />;
}
