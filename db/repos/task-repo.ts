import { TaskWithLabels } from '@/shared/types';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '..';
import { labels } from '../schema/labels';
import { projects } from '../schema/projects';
import { tasks } from '../schema/tasks';
import { tasksToLabels } from '../schema/tasks-to-labels';
import { createId } from '../schema/utils';

type CreateParams = {
  title: string;
  workspaceId: string;
  status?: string | undefined;
  description?: string | undefined;
  dueDate?: Date | undefined;
  projectId?: string | undefined;
};

const create = async (data: CreateParams) => {
  await db.insert(tasks).values({
    id: createId(),
    createdAt: new Date(),
    ...data,
  });
};

const update = async (
  id: string,
  data: Partial<Omit<TaskWithLabels, 'id'>>,
) => {
  await db
    .update(tasks)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(tasks.id, id));
};

type GetManyParams = {
  workspaceId: string;
  projectId?: string;
} & (
  | {}
  | {
      limit: number;
      offset: number;
    }
);

const getMany = async (params: GetManyParams): Promise<TaskWithLabels[]> => {
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
      projectName: projects.name,
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
    .leftJoin(projects, eq(tasks.projectId, projects.id))
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
      projects.name,
    );
};

const del = async (id: string) => {
  await db.delete(tasks).where(eq(tasks.id, id));
};

export const taskRepo = {
  create,
  update,
  getMany,
  del,
};
