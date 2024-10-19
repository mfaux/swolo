'use server';

import { aliasedTable, eq, sql } from 'drizzle-orm';
import { db } from './drizzle';
import { labels, projectLabels, projects, tasks } from './schema';
import { ProjectWithLabels, Task } from './types';

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

const parentProject = aliasedTable(projects, 'parent');

export const getProjects = async (
  params: GetProjectsParams,
): Promise<ProjectWithLabels[]> => {
  let limit = 10;
  let offset = 0;

  if ('limit' in params) {
    limit = params.limit;
    offset = params.offset;
  }

  return await db
    .select({
      id: projects.id,
      name: projects.name,
      key: projects.key,
      description: projects.description,
      parentName: parentProject.name,
      labels: sql<{ id: string; name: string }[]>`
        CASE 
          WHEN COUNT(labels.id) > 0 THEN JSON_AGG(
            json_build_object('id', ${labels.id}, 'name', ${labels.name})
          )
          ELSE NULL
        END`.as('labels'),
    })
    .from(projects)
    .leftJoin(parentProject, eq(projects.parentId, parentProject.id))
    .leftJoin(projectLabels, eq(projects.id, projectLabels.projectId))
    .leftJoin(labels, eq(projectLabels.labelId, labels.id))
    .limit(limit)
    .offset(offset)
    .where(eq(projects.userId, params.userId))
    .groupBy(projects.id, parentProject.name);
};
