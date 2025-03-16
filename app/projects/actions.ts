'use server';
import { projectRepo } from '@/db/repos/project-repo';
import { revalidatePath } from 'next/cache';

export const deleteProject = async (id: string) => {
  const res = await projectRepo.del(id);

  if (res.success) {
    revalidatePath('/');
  } else {
    // TODO
  }
};
