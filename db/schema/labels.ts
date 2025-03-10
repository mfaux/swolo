import { pgTable as table, text, varchar } from 'drizzle-orm/pg-core';

import { createId, cuidLength, timestamps } from './utils';
import { workspaces } from './workspaces';

export const labels = table('labels', {
  id: varchar({ length: cuidLength })
    .$defaultFn(() => createId())
    .unique()
    .primaryKey(),
  name: text().notNull(),
  color: text(),
  workspaceId: varchar({ length: cuidLength })
    .references(() => workspaces.id, { onDelete: 'cascade' })
    .notNull(),
  ...timestamps,
});
