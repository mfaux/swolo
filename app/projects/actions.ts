'use server';
import { projectRepo } from '@/db/repos/project-repo';
import { revalidatePath } from 'next/cache';

export const deleteProject = async (id: string) => {
  try {
    await projectRepo.del(id);
    revalidatePath('/');
  } catch (e) {
    console.error(e);
    return {
      error: 'Failed to delete project',
    };
  }
};
