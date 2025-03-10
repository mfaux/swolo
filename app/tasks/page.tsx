import Tasks from '@/app/tasks/_components/tasks';
import { getProjects, getTasks } from '@/db/queries';

export default async function TasksPage() {
  const tasks = await getTasks({ workspaceId: 'work' });
  const projects = await getProjects({ workspaceId: 'work' });
  return <Tasks tasks={tasks} projects={projects} />;
}
