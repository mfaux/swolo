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

const workspaceId = 'work';

export const createProject = async (formData: FormData) => {
  let rawFormData = {
    projectName: formData.get('projectName'),
  };

  const { projectName } = rawFormData;

  const res = await projectRepo.create({
    name: projectName as string,
    workspaceId,
  });

  if (res.success) {
    revalidatePath('/');
  } else {
    // TODO
  }

  return res;
};

export const upsertProject = async (formData: ProjectFormData, id?: string) => {
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

  const updating = id != null;

  const res = updating
    ? await projectRepo.update(id, data)
    : await projectRepo.create({
        ...data,
        workspaceId,
      });

  if (res.success) {
    revalidatePath('/projects');
    if (data.parentProjectId !== __SWOLO_NONE_SELECTED) {
      revalidatePath(`/projects/${data.parentProjectId}`);
    }
  } else {
    // TODO
  }

  return res;
};

export const upsertTask = async (formData: TaskFormData, id?: string) => {
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

  const updating = id != null;
  const res = updating
    ? await taskRepo.update(id, data)
    : await taskRepo.create({ ...data, workspaceId });

  if (res.success) {
    revalidatePath('/tasks');
    revalidatePath('/projects');
    if (data.projectId !== __SWOLO_NONE_SELECTED) {
      revalidatePath(`/projects/${data.projectId}`);
    }
  } else {
    // TODO
  }

  return res;
};
