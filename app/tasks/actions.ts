'use server';
import { db } from '@/db';
import { tasks } from '@/db/schema/tasks';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const deleteTask = async (id: string) => {
  // TODO: authorization
  try {
    await db.delete(tasks).where(eq(tasks.id, id));
    revalidatePath('/');
  } catch (e) {
    console.log(e);
    return {
      error: 'Failed to delete task',
    };
  }
};
