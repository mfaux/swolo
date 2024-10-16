import { getProjects } from '@/db/queries';
import Projects from './_components/projects';

export default async function ProjectsPage() {
  const projects = await getProjects({
    userId: 'fox',
  });
  return <Projects projects={projects} />;
}
