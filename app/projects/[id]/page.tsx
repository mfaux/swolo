'use server';
import Tasks from '@/app/tasks/_components/tasks';
import { projectRepo } from '@/db/repos/project-repo';
import { taskRepo } from '@/db/repos/task-repo';

const workspaceId = 'work';
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const res = await projectRepo.getMany({ workspaceId });

  if (!res.success) {
    // TODO
  } else {
    const projects = res.result;
    const project = projects.find((p) => p.id === params.id);
    if (!project) {
      return <div>Project not found</div>;
    }

    const tasksRes = await taskRepo.getMany({
      workspaceId,
      projectId: params.id,
    });

    if (!tasksRes.success) {
      // TODO
    } else {
      return (
        <div>
          <h1>{project.name}</h1>
          <Tasks tasks={tasksRes.result} projects={projects} />
        </div>
      );
    }
  }
}
