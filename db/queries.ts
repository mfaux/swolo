'use server';

import { aliasedTable, and, eq, sql } from 'drizzle-orm';
import { db } from '.';
import { ProjectWithLabels, TaskWithLabels } from '../shared/types';
import { labels, projectLabels, projects, taskLabels, tasks } from './schema';

const parentProject = aliasedTable(projects, 'parent');

type GetTasksParams = {
  userId: string;
  projectId?: string;
} & (
  | {}
  | {
      limit: number;
      offset: number;
    }
);

// TODO: fix overfetching when showing task cards.

export const getTasks = async (
  params: GetTasksParams,
): Promise<TaskWithLabels[]> => {
  let limit = 10;
  let offset = 0;

  if ('limit' in params) {
    limit = params.limit;
    offset = params.offset;
  }

  return await db
    .select({
      id: tasks.id,
      title: tasks.title,
      createdAt: tasks.createdAt,
      updatedAt: tasks.updatedAt,
      dueDate: tasks.dueDate,
      description: tasks.description,
      status: tasks.status,
      projectId: tasks.projectId,
      projectName: parentProject.name,
      labels: sql<{ id: string; name: string; color: string }[]>`
        CASE 
          WHEN COUNT(labels.id) > 0 THEN JSON_AGG(
            json_build_object('id', ${labels.id}, 'name', ${labels.name}, 'color', ${labels.color})
          )
          ELSE NULL
        END`.as('labels'),
    })
    .from(tasks)
    .leftJoin(parentProject, eq(tasks.projectId, parentProject.id))
    .leftJoin(taskLabels, eq(tasks.id, taskLabels.taskId))
    .leftJoin(labels, eq(taskLabels.labelId, labels.id))
    .limit(limit)
    .offset(offset)
    .where(
      and(
        eq(tasks.userId, params.userId),
        params.projectId ? eq(tasks.projectId, params.projectId) : undefined,
      ),
    )
    .groupBy(
      tasks.id,
      tasks.title,
      tasks.createdAt,
      tasks.updatedAt,
      tasks.dueDate,
      tasks.description,
      tasks.status,
      tasks.projectId,
      parentProject.name,
    );
};

type GetProjectsParams = {
  userId: string;
  projectId?: string;
} & (
  | {}
  | {
      limit: number;
      offset: number;
    }
);

// TODO: fix overfetching when showing project cards.

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
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
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
    .where(
      and(
        eq(projects.userId, params.userId),
        params.projectId ? eq(projects.id, params.projectId) : undefined,
      ),
    )
    .groupBy(
      projects.id,
      projects.name,
      projects.createdAt,
      projects.updatedAt,
      projects.description,
      parentProject.name,
    );
};
