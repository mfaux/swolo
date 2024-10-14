import { getConstants, init } from '@paralleldrive/cuid2';
import { db } from './drizzle';
import { projects, tasks, users } from './schema';

const cuidLength = getConstants().bigLength;
const createId = init({ length: cuidLength });

async function seed() {
  console.log('Starting seed process...');
  await seedUsers();
  await seedProjects();
  await seedTasks();

  console.log('Seed process completed successfully.');
}

async function seedUsers() {
  await db.insert(users).values([
    {
      id: 'fox',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

async function seedProjects() {
  await db.insert(projects).values([
    {
      id: 'my-project',
      name: 'My Project',
      description: 'This is a project',
      userId: 'fox',
      key: 'my-project',
    },
  ]);
}

async function seedTasks() {
  await db.insert(tasks).values([
    {
      id: createId(),
      title: 'My Task',
      description: 'This is a task',
      status: 'todo',
      userId: 'fox',
      projectId: 'my-project',
      key: 'my-task',
    },
  ]);
}

seed()
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Seed process finished. Exiting...');
    process.exit(0);
  });
