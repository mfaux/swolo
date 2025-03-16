import Tasks from '@/app/tasks/_components/tasks';
import { ProjectWithLabels, TaskWithLabels } from '@/client/types';
import { projectRepo } from '@/db/repos/project-repo';
import { taskRepo } from '@/db/repos/task-repo';

export default async function TasksPage() {
  const tasksRes = await taskRepo.getMany({ workspaceId: 'work' });

  let tasks: TaskWithLabels[] = [];
  let projects: ProjectWithLabels[] = [];

  if (!tasksRes.success) {
    // TODO
  } else {
    tasks = tasksRes.result;
  }

  const projectsRes = await projectRepo.getMany({ workspaceId: 'work' });

  if (!projectsRes.success) {
    // TODO
  } else {
    projects = projectsRes.result;
  }

  return <Tasks tasks={tasks} projects={projects} />;
}
