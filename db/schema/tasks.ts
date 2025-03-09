import {
  primaryKey,
  pgTable as table,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { projects } from './projects';
import { users } from './users';
import { createId, cuidLength, timestamps } from './utils';

export const tasks = table(
  'tasks',
  {
    id: varchar({ length: cuidLength })
      .$defaultFn(() => createId())
      .unique()
      .notNull(),
    title: text().notNull(),
    status: text().notNull().default('todo'),
    description: text(),
    dueDate: timestamp(),
    ...timestamps,
    projectId: varchar().references(() => projects.id, { onDelete: 'cascade' }),
    userId: varchar({ length: cuidLength })
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.id, table.title, table.userId] })],
);

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
});
