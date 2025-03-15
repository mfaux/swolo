'use server';
import { taskRepo } from '@/db/repos/task-repo';
import { revalidatePath } from 'next/cache';

export const deleteTask = async (id: string) => {
  try {
    await taskRepo.del(id);
    revalidatePath('/');
  } catch (e) {
    console.log(e);
    return {
      error: 'Failed to delete task',
    };
  }
};
