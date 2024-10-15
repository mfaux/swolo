'use server';

import { eq } from 'drizzle-orm';
import { db } from './drizzle';
import { tasks } from './schema';

export const getAllTasks = async (
  userId: string,
  limit: number,
  offset: number,
) => {
  return await db
    .select()
    .from(tasks)
    .limit(limit)
    .offset(offset)
    .where(eq(tasks.userId, userId));
};
