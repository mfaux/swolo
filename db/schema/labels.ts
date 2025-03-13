import { pgTable as table, text, varchar } from 'drizzle-orm/pg-core';

import { cuidLength, timestamps } from './utils';
import { workspaces } from './workspaces';

export const labels = table('labels', {
  id: varchar({ length: cuidLength }).unique().primaryKey(),
  name: text().notNull(),
  color: text(),
  workspaceId: varchar({ length: cuidLength })
    .references(() => workspaces.id, { onDelete: 'cascade' })
    .notNull(),
  ...timestamps,
});
