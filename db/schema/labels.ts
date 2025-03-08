import {
  primaryKey,
  pgTable as table,
  text,
  varchar,
} from 'drizzle-orm/pg-core';

import { users } from './users';
import { createId, cuidLength } from './utils';

export const labels = table(
  'labels',
  {
    id: varchar({ length: cuidLength })
      .$defaultFn(() => createId())
      .unique(),
    name: text().notNull(),
    color: text(),
    userId: varchar({ length: cuidLength })
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.id, table.name, table.userId] })],
);
