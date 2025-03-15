'use server';

import { projectRepo } from '@/db/repos/project-repo';
import { taskRepo } from '@/db/repos/task-repo';
import {
  __SWOLO_NONE_SELECTED,
  ProjectFormData,
  projectFormSchema,
  TaskFormData,
  taskFormSchema,
} from '@/shared/types';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const workspaceId = 'work';

export const createProject = async (formData: FormData) => {
  let rawFormData = {
    projectName: formData.get('projectName'),
  };

  const { projectName } = rawFormData;

  try {
    await projectRepo.create({
      name: projectName as string,
      workspaceId,
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
      await projectRepo.update(id, data);
    } else {
      await projectRepo.create({
        ...data,
        workspaceId,
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
      await taskRepo.update(id, data);
    } else {
      await taskRepo.create({ ...data, workspaceId });
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
