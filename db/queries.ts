'use server';

import { eq } from 'drizzle-orm';
import { db } from './drizzle';
import { projects, tasks } from './schema';
import { Project, Task } from './types';

type GetTasksParams =
  | {
      userId: string;
    }
  | {
      userId: string;
      limit: number;
      offset: number;
    };

export const getTasks = async (params: GetTasksParams): Promise<Task[]> => {
  if ('limit' in params) {
    return await db
      .select()
      .from(tasks)
      .limit(params.limit)
      .offset(params.offset)
      .where(eq(tasks.userId, params.userId));
  }

  return await db.select().from(tasks).where(eq(tasks.userId, params.userId));
};

type GetProjectsParams =
  | {
      userId: string;
    }
  | {
      userId: string;
      limit: number;
      offset: number;
    };

export const getProjects = async (
  params: GetProjectsParams,
): Promise<Project[]> => {
  if ('limit' in params) {
    return await db
      .select()
      .from(projects)
      .limit(params.limit)
      .offset(params.offset)
      .where(eq(projects.userId, params.userId));
  }

  return await db
    .select()
    .from(projects)
    .where(eq(projects.userId, params.userId));
};
