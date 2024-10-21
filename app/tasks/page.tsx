import Tasks from '@/app/_components/tasks';
import { getProjects, getTasks } from '@/db/queries';

export default async function TasksPage() {
  const tasks = await getTasks({ userId: 'fox' });
  const projects = await getProjects({ userId: 'fox' });
  return <Tasks tasks={tasks} projects={projects} />;
}
