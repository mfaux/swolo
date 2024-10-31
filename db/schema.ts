import { relations } from 'drizzle-orm';

import { getConstants, init } from '@paralleldrive/cuid2';
import {
  AnyPgColumn,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

// TODO: move defaults like createId to actions

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
      .notNull(),
    name: text().notNull(),
    description: text(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp(),
    parentId: varchar().references((): AnyPgColumn => projects.id),
    userId: varchar({ length: userIdLength })
      .references(() => users.id)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.name, table.userId] }),
  }),
);

// Schema for inserting a project - can be used to validate API requests
export const insertProjectSchema = createInsertSchema(projects, {
  name: (schema) => schema.name.trim().min(1).max(100),
});

// TODO: see what kind of error message zod returns when the name is empty

// .min(1, 'Project name cannot be empty')
// .max(100, 'Project name must be less than 100 characters'),

// Tasks table
export const tasks = pgTable(
  'tasks',
  {
    id: varchar({ length: cuidLength })
      .$defaultFn(() => createId())
      .notNull(),
    title: text().notNull(),
    description: text(),
    status: text().notNull().default('todo'),
    dueDate: timestamp(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp(),
    projectId: varchar().references(() => projects.id),
    userId: varchar({ length: userIdLength })
      .references(() => users.id)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.title, table.userId] }),
  }),
);

// Schema for inserting a task - can be used to validate API requests
export const taskTableSchema = createInsertSchema(tasks, {
  title: (schema) =>
    schema.title.trim().max(100, { message: 'Maximum 100 characters' }),
});

// Labels table
export const labels = pgTable(
  'labels',
  {
    id: varchar({ length: cuidLength }).$defaultFn(() => createId()),
    name: text().notNull(),
    color: text(),
    userId: varchar({ length: userIdLength })
      .references(() => users.id)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.name, table.userId] }),
  }),
);

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

export const insertTaskLabelsSchema = createInsertSchema(taskLabels);

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
