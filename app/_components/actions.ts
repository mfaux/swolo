'use server';

import { db } from '@/db/drizzle';
import { insertProjectSchema, projects, tasks } from '@/db/schema';
import { __SWOLO_NONE, TaskFormData, taskFormSchema } from '@/shared/types';
import { getConstants, init } from '@paralleldrive/cuid2';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const userId = 'fox';

const cuidLength = getConstants().bigLength;
const createId = init({ length: cuidLength });

export const createProject = async (formData: FormData) => {
  let rawFormData = {
    projectName: formData.get('projectName'),
  };

  try {
    const validatedFields = insertProjectSchema.parse({
      projectName: rawFormData.projectName,
    });

    const { name } = validatedFields;

    // TODO: ensure the user is authorized
    // https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#authentication-and-authorization

    await db.insert(projects).values({
      name: name,
      userId: userId,
    });

    revalidatePath('/');
    return { success: true };
  } catch (e) {
    if (e instanceof z.ZodError) {
      return { error: e.errors[0].message, previous: rawFormData };
    } else if (e instanceof Error) {
      return { error: e.message, previous: rawFormData };
    }

    return {
      error: 'Failed to create project',
    };
  }
};

export const upsertTask = async (formData: TaskFormData, id?: string) => {
  // TODO: authorization. ensure user has access to id, project, labels, etc.
  const updating = id != null;

  const validatedData = taskFormSchema.safeParse(formData);

  if (!validatedData.success) {
    const fieldErrors = validatedData.error.flatten().fieldErrors;
    return { fieldErrors };
  }

  const data = validatedData.data;
  data.projectId =
    formData.projectId === __SWOLO_NONE ? null : formData.projectId;

  try {
    if (updating) {
      await db
        .update(tasks)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(tasks.id, id));
    } else {
      await db.insert(tasks).values({
        id: createId(),
        createdAt: new Date(),
        ...data,
        userId: userId,
      });
    }
  } catch (e) {
    const message = updating
      ? 'Failed to update task'
      : 'Failed to create task';
    return { error: message };
  }

  revalidatePath('/tasks');
  revalidatePath('/projects');

  if (data.projectId !== __SWOLO_NONE) {
    revalidatePath(`/projects/${data.projectId}`);
  }
  return { success: true };
};
