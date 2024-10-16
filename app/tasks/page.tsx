import { getTasks } from '@/db/queries';
import Tasks from './_components/tasks';

export default async function TasksPage() {
  const tasks = await getTasks({ userId: 'fox' });
  return <Tasks tasks={tasks} />;
}
