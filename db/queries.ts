'use server';

import { aliasedTable, and, eq, sql } from 'drizzle-orm';
import { db } from '.';
import { ProjectWithLabels, TaskWithLabels } from '../shared/types';
import { labels } from './schema/labels';
import { projects } from './schema/projects';
import { projectsToLabels } from './schema/projects-to-labels';
import { tasks } from './schema/tasks';
import { tasksToLabels } from './schema/tasks-to-labels';

const parentProject = aliasedTable(projects, 'parent');

type GetTasksParams = {
  workspaceId: string;
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
      labels: sql<
        {
          id: string;
          name: string;
          color: string;
          createdAt: Date;
          updatedAt: Date;
        }[]
      >`
        CASE 
          WHEN COUNT(labels.id) > 0 THEN JSON_AGG(
            json_build_object('id', ${labels.id}, 'name', ${labels.name}, 'color', ${labels.color}, 'createdAt', ${labels.createdAt}, 'updatedAt', ${labels.updatedAt}) 
          )
          ELSE NULL
        END`.as('labels'),
    })
    .from(tasks)
    .leftJoin(parentProject, eq(tasks.projectId, parentProject.id))
    .leftJoin(tasksToLabels, eq(tasks.id, tasksToLabels.taskId))
    .leftJoin(labels, eq(tasksToLabels.labelId, labels.id))
    .limit(limit)
    .offset(offset)
    .where(
      and(
        eq(tasks.workspaceId, params.workspaceId),
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
  workspaceId: string;
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
    .leftJoin(parentProject, eq(projects.parentProjectId, parentProject.id))
    .leftJoin(projectsToLabels, eq(projects.id, projectsToLabels.projectId))
    .leftJoin(labels, eq(projectsToLabels.labelId, labels.id))
    .limit(limit)
    .offset(offset)
    .where(
      and(
        eq(projects.workspaceId, params.workspaceId),
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
