import { getConstants, init } from '@paralleldrive/cuid2';
import { timestamp } from 'drizzle-orm/pg-core';

export const cuidLength = getConstants().bigLength;
export const createId = init({ length: cuidLength });

export const timestamps = {
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date()),
};
