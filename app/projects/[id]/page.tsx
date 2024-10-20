'use server';
import Tasks from '@/app/_components/tasks';
import { getProjects, getTasks } from '@/db/queries';

export default async function Page({ params }: { params: { id: string } }) {
  // TODO: fix overfetching
  const project = await getProjects({ userId: 'fox', projectId: params.id });
  const tasks = await getTasks({ userId: 'fox', projectId: params.id });

  if (project.length == 0) {
    return <div>Project not found</div>;
  }

  return (
    <div>
      <h1>{project[0].name}</h1>
      <Tasks tasks={tasks} />
    </div>
  );
}
