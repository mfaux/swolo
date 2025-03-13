import { db } from '.';
import { labels } from './schema/labels';
import { projects } from './schema/projects';
import { projectsToLabels } from './schema/projects-to-labels';
import { tasks } from './schema/tasks';
import { tasksToLabels } from './schema/tasks-to-labels';
import { users } from './schema/users';
import { createId } from './schema/utils';
import { workspaces } from './schema/workspaces';

function createIds(count: number) {
  return Array.from({ length: count }, createId);
}

const [
  labelFeat,
  labelBug,
  labelEnhancement,
  labelSports,
  labelDev,
  labelLearning,
] = createIds(6);

async function seed() {
  console.log('Starting seed process...');
  await seedUsers();
  await seedWorkspaces();
  await seedLabels();
  await seedProjects();
  await seedTasks();

  console.log('Seed process completed successfully.');
}

const userId = 'fox';
const spaces = {
  hobby: 'hobby',
  work: 'work',
} as const;

async function seedUsers() {
  await db.insert(users).values([
    {
      id: 'fox',
      createdAt: new Date(),
    },
  ]);
}

async function seedWorkspaces() {
  await db.insert(workspaces).values([
    {
      id: spaces.hobby,
      name: 'Hobby',
      userId,
      createdAt: new Date(),
    },
    {
      id: spaces.work,
      name: 'Work',
      userId,
      createdAt: new Date(),
    },
  ]);
}

async function seedLabels() {
  await db.insert(labels).values([
    {
      id: labelFeat,
      name: 'feat',
      workspaceId: spaces.work,
      createdAt: new Date(),
    },
    {
      id: labelBug,
      name: 'bug',
      workspaceId: spaces.work,
      createdAt: new Date(),
    },
    {
      id: labelEnhancement,
      name: 'enhancement',
      workspaceId: spaces.work,
      createdAt: new Date(),
    },
    {
      id: labelDev,
      name: 'dev',
      workspaceId: spaces.work,
      createdAt: new Date(),
    },
    {
      id: labelSports,
      name: 'sports',
      workspaceId: spaces.hobby,
      createdAt: new Date(),
    },
    {
      id: labelLearning,
      name: 'learning',
      workspaceId: spaces.hobby,
      createdAt: new Date(),
    },
  ]);
}

async function seedProjects() {
  await db.insert(projects).values([
    {
      id: 'swolo',
      name: 'Project management app',
      description: 'Project management and note-taking app wit GTD principles.',
      workspaceId: spaces.work,
      createdAt: new Date(),
    },
    {
      id: 'db_subproject',
      name: 'Database subproject',
      description: 'Subproject for setting up database and API endpoints.',
      workspaceId: spaces.work,
      parentProjectId: 'swolo',
      createdAt: new Date(),
    },
  ]);

  await db.insert(projectsToLabels).values([
    { projectId: 'swolo', labelId: labelEnhancement },
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
      workspaceId: spaces.work,
      projectId: 'swolo',
      createdAt: new Date(),
    },
    {
      id: designLayout,
      title: 'Design app layout',
      description: 'Create wireframes and mockups for the app.',
      status: 'in-progress',
      workspaceId: spaces.work,
      projectId: 'swolo',
      createdAt: new Date(),
    },
    {
      id: authModule,
      title: 'Develop authentication module',
      description: 'Implement user login and registration functionality.',
      status: 'todo',
      workspaceId: spaces.work,
      projectId: 'swolo',
      createdAt: new Date(),
    },
    {
      id: setupDb,
      title: 'Set up database',
      description: 'Configure the database schema and connections.',
      status: 'todo',
      workspaceId: spaces.work,
      projectId: 'swolo',
      createdAt: new Date(),
    },
    {
      id: createApi,
      title: 'Create API endpoints',
      description: 'Develop RESTful API endpoints for the app.',
      status: 'todo',
      workspaceId: spaces.work,
      projectId: 'swolo',
      createdAt: new Date(),
    },
    {
      id: frontend,
      title: 'Implement frontend',
      description: 'Build the frontend using React.',
      status: 'todo',
      workspaceId: spaces.work,
      projectId: 'swolo',
      createdAt: new Date(),
    },
  ]);

  await db.insert(tasksToLabels).values([
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
