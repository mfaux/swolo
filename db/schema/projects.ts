import {
  AnyPgColumn,
  primaryKey,
  pgTable as table,
  text,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { labels } from './labels';
import { users } from './users';
import { createId, cuidLength, timestamps } from './utils';

export const projects = table(
  'projects',
  {
    id: varchar({ length: cuidLength })
      .$defaultFn(() => createId())
      .unique()
      .notNull(),
    name: text().notNull(),
    description: text(),
    ...timestamps,
    parentId: varchar().references((): AnyPgColumn => projects.id, {
      onDelete: 'cascade',
    }),
    userId: varchar({ length: cuidLength })
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.id, table.name, table.userId] })],
);

// Schema for inserting a project - can be used to validate API requests.
// React hook form doesn't like nulls, so we exclude them from the schema.
export const insertProjectSchema = createInsertSchema(projects, {
  name: (schema) =>
    schema
      .trim()
      .min(1, 'Name cannot be empty')
      .max(100, 'Maximum 100 characters'),
}).extend({
  description: z
    .string()
    .trim()
    .max(1000, 'Maximum 1000 characters')
    .optional(),
  parentId: z.string().optional(),
});

// Project-Label join table
export const projectLabels = table(
  'project_labels',
  {
    projectId: varchar()
      .references(() => projects.id, { onDelete: 'cascade' })
      .notNull(),
    labelId: varchar()
      .references(() => labels.id, { onDelete: 'cascade' })
      .notNull(),
  },

  (table) => [primaryKey({ columns: [table.projectId, table.labelId] })],
);
