import { relations } from 'drizzle-orm';

import { getConstants, init } from '@paralleldrive/cuid2';
import {
  AnyPgColumn,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';

const cuidLength = getConstants().bigLength;
const createId = init({ length: cuidLength });

const userIdLength = 191;

// Users table (synced with Clerk)
export const users = pgTable('users', {
  id: varchar({ length: cuidLength })
    .$defaultFn(() => createId())
    .primaryKey(),
  // Clerk handles email, name, and other user profile data
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Projects table
export const projects = pgTable(
  'projects',
  {
    id: varchar({ length: cuidLength })
      .$defaultFn(() => createId())
      .primaryKey(),
    name: text().notNull(),
    description: text(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
    parentId: varchar().references((): AnyPgColumn => projects.id),
    userId: varchar({ length: userIdLength })
      .references(() => users.id)
      .notNull(),
    key: varchar({ length: 20 }).notNull(),
  },
  (t) => ({
    unq: unique().on(t.key, t.userId), // ensure unique project keys for the user
  }),
);

// Tasks table
export const tasks = pgTable('tasks', {
  id: varchar({ length: cuidLength })
    .$defaultFn(() => createId())
    .primaryKey(),
  title: text().notNull(),
  description: text(),
  status: text().notNull().default('todo'),
  dueDate: timestamp(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
  projectId: varchar().references(() => projects.id),
  userId: varchar({ length: userIdLength })
    .references(() => users.id)
    .notNull(),
});

// Labels table
export const labels = pgTable('labels', {
  id: varchar({ length: cuidLength })
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text().notNull(),
  color: text(),
  userId: varchar({ length: userIdLength })
    .references(() => users.id)
    .notNull(),
});

// Task-Label join table
export const taskLabels = pgTable(
  'task_labels',
  {
    taskId: varchar()
      .references(() => tasks.id)
      .notNull(),
    labelId: varchar()
      .references(() => labels.id)
      .notNull(),
  },

  (table) => ({
    pk: primaryKey({ columns: [table.taskId, table.labelId] }),
  }),
);

// Project-Label join table
export const projectLabels = pgTable(
  'project_labels',
  {
    projectId: varchar()
      .references(() => projects.id)
      .notNull(),
    labelId: varchar()
      .references(() => labels.id)
      .notNull(),
  },

  (table) => ({
    pk: primaryKey({ columns: [table.projectId, table.labelId] }),
  }),
);

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  tasks: many(tasks),
  labels: many(labels),
}));

export const projectsRelations = relations(projects, ({ many, one }) => ({
  tasks: many(tasks),
  childProjects: many(projects, { relationName: 'parentChild' }),
  parentProject: one(projects, {
    fields: [projects.parentId],
    references: [projects.id],
    relationName: 'parentChild',
  }),
  labels: many(projectLabels),
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  labels: many(taskLabels),
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
}));

export const labelsRelations = relations(labels, ({ many, one }) => ({
  tasks: many(taskLabels),
  projects: many(projectLabels),
  user: one(users, {
    fields: [labels.userId],
    references: [users.id],
  }),
}));

export const taskLabelsRelations = relations(taskLabels, ({ one }) => ({
  task: one(tasks, {
    fields: [taskLabels.taskId],
    references: [tasks.id],
  }),
  label: one(labels, {
    fields: [taskLabels.labelId],
    references: [labels.id],
  }),
}));

export const projectLabelsRelations = relations(projectLabels, ({ one }) => ({
  project: one(projects, {
    fields: [projectLabels.projectId],
    references: [projects.id],
  }),
  label: one(labels, {
    fields: [projectLabels.labelId],
    references: [labels.id],
  }),
}));
