import { getConstants, init } from '@paralleldrive/cuid2';
import { db } from '.';
import {
  labels,
  projectLabels,
  projects,
  taskLabels,
  tasks,
  users,
} from './schema';

const cuidLength = getConstants().bigLength;
const createId = init({ length: cuidLength });

function createIds(count: number) {
  return Array.from({ length: count }, createId);
}

const [labelFeat, labelBug, labelEnhancement, labelHobby, labelDev] =
  createIds(5);

async function seed() {
  console.log('Starting seed process...');
  await seedUsers();
  await seedLabels();
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

async function seedLabels() {
  await db.insert(labels).values([
    { id: labelFeat, name: 'feat', userId: 'fox' },
    { id: labelBug, name: 'bug', userId: 'fox' },
    { id: labelEnhancement, name: 'enhancement', userId: 'fox' },
    { id: labelHobby, name: 'hobby', userId: 'fox' },
    { id: labelDev, name: 'dev', userId: 'fox' },
  ]);
}

async function seedProjects() {
  await db.insert(projects).values([
    {
      id: 'swolo',
      name: 'Project management app',
      description: 'Project management and note-taking app wit GTD principles.',
      userId: 'fox',
    },
    {
      id: 'db_subproject',
      name: 'Database subproject',
      description: 'Subproject for setting up database and API endpoints.',
      userId: 'fox',
      parentId: 'swolo',
    },
  ]);

  await db.insert(projectLabels).values([
    { projectId: 'swolo', labelId: labelHobby },
    { projectId: 'swolo', labelId: labelDev },
  ]);
}

async function seedTasks() {
  const [myTask, designLayout, authModule, setupDb, createApi, frontend] =
    createIds(6);

  await db.insert(tasks).values([
    {
      id: myTask,
      title: 'Implement synching',
      description: 'Sync data from the cloud to the local desktop.',
      status: 'todo',
      userId: 'fox',
      projectId: 'swolo',
    },
    {
      id: designLayout,
      title: 'Design app layout',
      description: 'Create wireframes and mockups for the app.',
      status: 'in-progress',
      userId: 'fox',
      projectId: 'swolo',
    },
    {
      id: authModule,
      title: 'Develop authentication module',
      description: 'Implement user login and registration functionality.',
      status: 'todo',
      userId: 'fox',
      projectId: 'swolo',
    },
    {
      id: setupDb,
      title: 'Set up database',
      description: 'Configure the database schema and connections.',
      status: 'todo',
      userId: 'fox',
      projectId: 'swolo',
    },
    {
      id: createApi,
      title: 'Create API endpoints',
      description: 'Develop RESTful API endpoints for the app.',
      status: 'todo',
      userId: 'fox',
      projectId: 'swolo',
    },
    {
      id: frontend,
      title: 'Implement frontend',
      description: 'Build the frontend using React.',
      status: 'todo',
      userId: 'fox',
      projectId: 'swolo',
    },
  ]);

  await db.insert(taskLabels).values([
    { taskId: myTask, labelId: labelFeat },
    { taskId: designLayout, labelId: labelEnhancement },
    { taskId: authModule, labelId: labelBug },
    { taskId: setupDb, labelId: labelFeat },
    { taskId: createApi, labelId: labelFeat },
    { taskId: createApi, labelId: labelDev },
    { taskId: frontend, labelId: labelDev },
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
