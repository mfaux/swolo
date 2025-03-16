import { projectRepo } from '@/db/repos/project-repo';
import Projects from './_components/projects';

export default async function ProjectsPage() {
  const res = await projectRepo.getMany({
    workspaceId: 'work',
  });

  if (!res.success) {
    // TODO
  } else {
    return <Projects projects={res.result} />;
  }
}
