'use server';

import { db } from '@/db';
import { projects } from '@/db/schema/projects';
import { tasks } from '@/db/schema/tasks';
import { createId } from '@/db/schema/utils';
import {
  __SWOLO_NONE_SELECTED,
  ProjectFormData,
  projectFormSchema,
  TaskFormData,
  taskFormSchema,
} from '@/shared/types';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const workspaceId = 'work';

export const createProject = async (formData: FormData) => {
  let rawFormData = {
    projectName: formData.get('projectName'),
  };

  const { projectName } = rawFormData;

  try {
    // TODO: ensure the user is authorized
    // https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#authentication-and-authorization

    await db.insert(projects).values({
      id: createId(),
      name: projectName as string,
      workspaceId,
      createdAt: new Date(),
    });

    revalidatePath('/');
    return { success: true };
  } catch (e) {
    console.error(e);
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

export const upsertProject = async (formData: ProjectFormData, id?: string) => {
  // TODO: authorization. ensure user has access to id, project, labels, etc.
  const updating = id != null;

  const validatedData = projectFormSchema.safeParse(formData);

  if (!validatedData.success) {
    const fieldErrors = validatedData.error.flatten().fieldErrors;
    return { fieldErrors };
  }

  const data = validatedData.data;
  data.parentProjectId =
    formData.parentProjectId === __SWOLO_NONE_SELECTED
      ? undefined
      : formData.parentProjectId;

  try {
    if (updating) {
      await db
        .update(projects)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(projects.id, id));
    } else {
      await db.insert(projects).values({
        id: createId(),
        ...data,
        workspaceId,
        createdAt: new Date(),
      });
    }
  } catch (e) {
    const message = updating
      ? 'Failed to update project'
      : 'Failed to create project';
    return { error: message };
  }

  revalidatePath('/projects');

  if (data.parentProjectId !== __SWOLO_NONE_SELECTED) {
    revalidatePath(`/projects/${data.parentProjectId}`);
  }
  return { success: true };
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
    formData.projectId === __SWOLO_NONE_SELECTED
      ? undefined
      : formData.projectId;

  try {
    if (updating) {
      await db
        .update(tasks)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(tasks.id, id));
    } else {
      await db.insert(tasks).values({
        ...data,
        id: createId(),
        workspaceId,
        createdAt: new Date(),
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

  if (data.projectId !== __SWOLO_NONE_SELECTED) {
    revalidatePath(`/projects/${data.projectId}`);
  }
  return { success: true };
};
