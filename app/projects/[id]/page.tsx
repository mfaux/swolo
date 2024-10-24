'use server';
import Tasks from '@/app/_components/tasks';
import { getProjects, getTasks } from '@/db/queries';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  // TODO: fix overfetching
  // const project = await getProjects({ userId: 'fox', projectId: params.id });
  const projects = await getProjects({ userId: 'fox' });

  const userProject = projects.find((project) => project.id === params.id);
  if (!userProject) {
    return <div>Project not found</div>;
  }

  const tasks = await getTasks({ userId: 'fox', projectId: params.id });

  return (
    <div>
      <h1>{userProject.name}</h1>
      <Tasks tasks={tasks} projects={projects} />
    </div>
  );
}
