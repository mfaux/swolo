import { pgTable as table, text, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';
import { createId, cuidLength, timestamps } from './utils';

// Workspace table
export const workspaces = table('workspaces', {
  id: varchar({ length: cuidLength })
    .$defaultFn(() => createId())
    .unique()
    .notNull()
    .primaryKey(),
  name: text().notNull(),
  userId: varchar({ length: cuidLength })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  ...timestamps,
});
