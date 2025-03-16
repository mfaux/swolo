import { ErrorBase } from '@/lib/error';
import { err, ok, Result } from '@/lib/result';
import { ProjectWithLabels } from '@/shared/types';
import { aliasedTable, and, eq, sql } from 'drizzle-orm';
import { db } from '..';
import { labels } from '../schema/labels';
import { projects } from '../schema/projects';
import { projectsToLabels } from '../schema/projects-to-labels';
import { createId } from '../schema/utils';

class ProjectRepoError extends ErrorBase<
  keyof typeof ProjectRepoError.ErrorMessages
> {
  static ErrorMessages = {
    CREATE_PROJECT_FAILED: 'Failed to create project.',
    UPDATE_PROJECT_FAILED: 'Failed to update project.',
    GET_MANY_PROJECTS_FAILED: 'Failed to load projects.',
    DELETE_PROJECT_FAILED: 'Failed to delete project.',
  } as const;

  constructor(
    name: keyof typeof ProjectRepoError.ErrorMessages,
    cause?: unknown,
  ) {
    super(name, ProjectRepoError.ErrorMessages[name], cause);
  }
}

type ProjectRepoResult<T = void> = Result<T, ProjectRepoError>;

type CreateParams = {
  name: string;
  workspaceId: string;
  description?: string;
  parentProjectId?: string;
};

const create = async ({
  name,
  workspaceId,
  description,
  parentProjectId,
}: CreateParams): Promise<ProjectRepoResult> => {
  try {
    await db.insert(projects).values({
      id: createId(),
      name,
      workspaceId,
      description,
      parentProjectId,
      createdAt: new Date(),
    });

    return ok();
  } catch (e) {
    return err(new ProjectRepoError('CREATE_PROJECT_FAILED', e));
  }
};

const update = async (
  id: string,
  data: Partial<Omit<ProjectWithLabels, 'id'>>,
): Promise<ProjectRepoResult> => {
  try {
    await db
      .update(projects)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(projects.id, id));

    return ok();
  } catch (e) {
    return err(new ProjectRepoError('UPDATE_PROJECT_FAILED', e));
  }
};

const parentProject = aliasedTable(projects, 'parent');

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
): Promise<ProjectRepoResult<ProjectWithLabels[]>> => {
  let limit = 10;
  let offset = 0;

  if ('limit' in params) {
    limit = params.limit;
    offset = params.offset;
  }

  try {
    const projectsWithLabels: ProjectWithLabels[] = await db
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

    return ok(projectsWithLabels);
  } catch (e) {
    return err(new ProjectRepoError('GET_MANY_PROJECTS_FAILED', e));
  }
};

const del = async (id: string): Promise<ProjectRepoResult> => {
  try {
    await db.delete(projects).where(eq(projects.id, id));
    return ok();
  } catch (e) {
    return err(new ProjectRepoError('DELETE_PROJECT_FAILED', e));
  }
};

export const projectRepo = {
  create,
  update,
  getMany,
  del,
};
