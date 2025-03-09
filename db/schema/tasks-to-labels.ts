import { primaryKey, pgTable as table, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { labels } from './labels';
import { tasks } from './tasks';

// Join table for Task-Label many-to-many relationship

export const tasksToLabels = table(
  'tasks_to_labels',
  {
    taskId: varchar()
      .references(() => tasks.id, { onDelete: 'cascade' })
      .notNull(),
    labelId: varchar()
      .references(() => labels.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.taskId, table.labelId] })],
);

export const insertTaskLabelsSchema = createInsertSchema(tasksToLabels);
