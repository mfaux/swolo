'use server';
import Tasks from '@/app/tasks/_components/tasks';
import { getProjects, getTasks } from '@/db/queries';

const workspaceId = 'work';
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  // TODO: fix overfetching
  const projects = await getProjects({ workspaceId });

  const project = projects.find((p) => p.id === params.id);
  if (!project) {
    return <div>Project not found</div>;
  }

  const tasks = await getTasks({ workspaceId, projectId: params.id });

  return (
    <div>
      <h1>{project.name}</h1>
      <Tasks tasks={tasks} projects={projects} />
    </div>
  );
}
