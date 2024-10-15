import { getAllProjects } from '@/db/queries';
import Projects from './_components/projects';

export default async function ProjectsPage() {
  const projects = await getAllProjects('fox', 50, 0);
  return <Projects projects={projects} />;
}
