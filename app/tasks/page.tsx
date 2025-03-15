import Tasks from '@/app/tasks/_components/tasks';
import { projectRepo } from '@/db/repos/project-repo';
import { taskRepo } from '@/db/repos/task-repo';

export default async function TasksPage() {
  const tasks = await taskRepo.getMany({ workspaceId: 'work' });
  const projects = await projectRepo.getMany({ workspaceId: 'work' });
  return <Tasks tasks={tasks} projects={projects} />;
}
