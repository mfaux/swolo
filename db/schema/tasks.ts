import {
  pgTable as table,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { projects } from './projects';
import { cuidLength, timestamps } from './utils';
import { workspaces } from './workspaces';

export const tasks = table('tasks', {
  id: varchar({ length: cuidLength }).unique().notNull().primaryKey(),
  title: text().notNull(),
  status: text(),
  description: text(),
  dueDate: timestamp(),
  ...timestamps,
  projectId: varchar().references(() => projects.id, { onDelete: 'cascade' }),
  workspaceId: varchar({ length: cuidLength })
    .references(() => workspaces.id, { onDelete: 'cascade' })
    .notNull(),
});

// Schema for inserting a task - can be used to validate API requests
export const insertTaskSchema = createInsertSchema(tasks, {
  title: (schema) =>
    schema.trim().max(100, { message: 'Maximum 100 characters' }),
}).extend({
  description: z
    .string()
    .trim()
    .max(1000, 'Maximum 1000 characters')
    .optional(),
  dueDate: z.date().optional(),
  projectId: z.string().optional(),
  status: z.string().optional(),
});
