import { primaryKey, pgTable as table, varchar } from 'drizzle-orm/pg-core';
import { labels } from './labels';
import { projects } from './projects';

// Join table for Project-Label many-to-many relationship

export const projectsToLabels = table(
  'project_to_labels',
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
