import { ProjectWithLabels } from '@/shared/types';
import { aliasedTable, and, eq, sql } from 'drizzle-orm';
import { db } from '..';
import { labels } from '../schema/labels';
import { projects } from '../schema/projects';
import { projectsToLabels } from '../schema/projects-to-labels';
import { createId } from '../schema/utils';

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
}: CreateParams) => {
  await db.insert(projects).values({
    id: createId(),
    name,
    workspaceId,
    description,
    parentProjectId,
    createdAt: new Date(),
  });
};

const update = async (
  id: string,
  data: Partial<Omit<ProjectWithLabels, 'id'>>,
) => {
  await db
    .update(projects)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(projects.id, id));
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

const getMany = async (params: GetManyParams): Promise<ProjectWithLabels[]> => {
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

const del = async (id: string) => {
  await db.delete(projects).where(eq(projects.id, id));
};

export const projectRepo = {
  create,
  update,
  getMany,
  del,
};
