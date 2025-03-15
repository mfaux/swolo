'use server';
import Tasks from '@/app/tasks/_components/tasks';
import { projectRepo } from '@/db/repos/project-repo';
import { taskRepo } from '@/db/repos/task-repo';

const workspaceId = 'work';
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const projects = await projectRepo.getMany({ workspaceId });

  const project = projects.find((p) => p.id === params.id);
  if (!project) {
    return <div>Project not found</div>;
  }

  const tasks = await taskRepo.getMany({ workspaceId, projectId: params.id });

  return (
    <div>
      <h1>{project.name}</h1>
      <Tasks tasks={tasks} projects={projects} />
    </div>
  );
}
