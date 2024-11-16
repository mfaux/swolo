'use server';
import { db } from '@/db/drizzle';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const deleteProject = async (id: string) => {
  // TODO: authorization
  try {
    await db.delete(projects).where(eq(projects.id, id));
    revalidatePath('/');
  } catch (e) {
    console.error(e);
    return {
      error: 'Failed to delete project',
    };
  }
};
