import { ErrorBase } from '@/lib/error';
import { err, ok, Result } from '@/lib/result';
import { TaskWithLabels } from '@/shared/types';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '..';
import { labels } from '../schema/labels';
import { projects } from '../schema/projects';
import { tasks } from '../schema/tasks';
import { tasksToLabels } from '../schema/tasks-to-labels';
import { createId } from '../schema/utils';

class TaskRepoError extends ErrorBase<
  keyof typeof TaskRepoError.ErrorMessages
> {
  static ErrorMessages = {
    CREATE_TASK_FAILED: 'Failed to create task.',
    UPDATE_TASK_FAILED: 'Failed to update task.',
    GET_MANY_TASKS_FAILED: 'Failed to load tasks.',
    DELETE_TASK_FAILED: 'Failed to delete task.',
  } as const;

  constructor(name: keyof typeof TaskRepoError.ErrorMessages, cause?: unknown) {
    super(name, TaskRepoError.ErrorMessages[name], cause);
  }
}

type TaskRepoResult<T = void> = Result<T, TaskRepoError>;

type CreateParams = {
  title: string;
  workspaceId: string;
  status?: string | undefined;
  description?: string | undefined;
  dueDate?: Date | undefined;
  projectId?: string | undefined;
};

const create = async (data: CreateParams): Promise<TaskRepoResult> => {
  try {
    await db.insert(tasks).values({
      id: createId(),
      createdAt: new Date(),
      ...data,
    });
    return ok();
  } catch (e) {
    return err(new TaskRepoError('CREATE_TASK_FAILED', e));
  }
};

const update = async (
  id: string,
  data: Partial<Omit<TaskWithLabels, 'id'>>,
): Promise<TaskRepoResult> => {
  try {
    await db
      .update(tasks)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tasks.id, id));

    return ok();
  } catch (e) {
    return err(new TaskRepoError('UPDATE_TASK_FAILED', e));
  }
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

const getMany = async (
  params: GetManyParams,
): Promise<TaskRepoResult<TaskWithLabels[]>> => {
  let limit = 10;
  let offset = 0;

  if ('limit' in params) {
    limit = params.limit;
    offset = params.offset;
  }

  try {
    const res: TaskWithLabels[] = await db
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

    return ok(res);
  } catch (e) {
    return err(new TaskRepoError('GET_MANY_TASKS_FAILED', e));
  }
};

const del = async (id: string): Promise<TaskRepoResult> => {
  try {
    await db.delete(tasks).where(eq(tasks.id, id));
    return ok();
  } catch (e) {
    return err(new TaskRepoError('DELETE_TASK_FAILED', e));
  }
};

export const taskRepo = {
  create,
  update,
  getMany,
  del,
};
