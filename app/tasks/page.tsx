import { getAllTasks } from '@/db/queries';
import Tasks from './_components/tasks';

export default async function TasksPage() {
  const tasks = await getAllTasks('fox', 50, 0);
  return <Tasks tasks={tasks} />;
}
