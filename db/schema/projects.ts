import {
  AnyPgColumn,
  pgTable as table,
  text,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { cuidLength, timestamps } from './utils';
import { workspaces } from './workspaces';

export const projects = table('projects', {
  id: varchar({ length: cuidLength }).unique().notNull().primaryKey(),
  name: text().notNull(),
  description: text(),
  ...timestamps,
  parentProjectId: varchar().references((): AnyPgColumn => projects.id, {
    onDelete: 'cascade',
  }),
  workspaceId: varchar({ length: cuidLength })
    .references(() => workspaces.id, { onDelete: 'cascade' })
    .notNull(),
});

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
  parentProjectId: z.string().optional(),
});
