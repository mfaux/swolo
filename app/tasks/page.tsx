import Tasks from '@/app/_components/tasks';
import { getTasks } from '@/db/queries';

export default async function TasksPage() {
  const tasks = await getTasks({ userId: 'fox' });
  return <Tasks tasks={tasks} />;
}
