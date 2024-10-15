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
      id: 'swolo',
      name: 'Project management app',
      description: 'Project management and note-taking app wit GTD principles.',
      userId: 'fox',
      key: 'swolo',
    },
  ]);
}

async function seedTasks() {
  await db.insert(tasks).values([
    {
      id: createId(),
      title: 'Implement synching',
      description: 'Sync data from the cloud to the local desktop.',
      status: 'todo',
      userId: 'fox',
      projectId: 'swolo',
      key: 'my-task',
    },
    {
      id: createId(),
      title: 'Design app layout',
      description: 'Create wireframes and mockups for the app.',
      status: 'in-progress',
      userId: 'fox',
      projectId: 'swolo',
      key: 'design-layout',
    },
    {
      id: createId(),
      title: 'Develop authentication module',
      description: 'Implement user login and registration functionality.',
      status: 'todo',
      userId: 'fox',
      projectId: 'swolo',
      key: 'auth-module',
    },
    {
      id: createId(),
      title: 'Set up database',
      description: 'Configure the database schema and connections.',
      status: 'todo',
      userId: 'fox',
      projectId: 'swolo',
      key: 'setup-database',
    },
    {
      id: createId(),
      title: 'Create API endpoints',
      description: 'Develop RESTful API endpoints for the app.',
      status: 'todo',
      userId: 'fox',
      projectId: 'swolo',
      key: 'create-api',
    },
    {
      id: createId(),
      title: 'Implement frontend',
      description: 'Build the frontend using React.',
      status: 'todo',
      userId: 'fox',
      projectId: 'swolo',
      key: 'implement-frontend',
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
