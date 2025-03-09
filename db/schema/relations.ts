import { relations } from 'drizzle-orm/relations';
import { labels } from './labels';
import { projects } from './projects';
import { projectsToLabels } from './projects-to-labels';
import { tasks } from './tasks';
import { tasksToLabels } from './tasks-to-labels';
import { users } from './users';
import { workspaces } from './workspaces';

export const usersRelations = relations(users, ({ many }) => ({
  workspaces: many(workspaces),
}));

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  user: one(users, { fields: [workspaces.userId], references: [users.id] }),
  projects: many(projects),
  tasks: many(tasks),
  labels: many(labels),
}));

// Unsure whey, but the relationName needed to be the same for the parent and child projects.
// Otherwise, drizzle studio wouldn't work. Found a Stack Overflow post that
// showed the soultion but didn't explain why.
export const projectsRelations = relations(projects, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [projects.workspaceId],
    references: [workspaces.id],
  }),
  childProjects: many(projects, { relationName: 'parentChild' }),
  parentProject: one(projects, {
    fields: [projects.parentProjectId],
    references: [projects.id],
    relationName: 'parentChild',
  }),
  tasks: many(tasks),
  labels: many(projectsToLabels),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [tasks.workspaceId],
    references: [workspaces.id],
  }),
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  labels: many(tasksToLabels),
}));

export const labelsRelations = relations(labels, ({ many, one }) => ({
  workspace: one(workspaces, {
    fields: [labels.workspaceId],
    references: [workspaces.id],
  }),
  projects: many(projectsToLabels),
  tasks: many(tasksToLabels),
}));

export const tasksToLabelsRelations = relations(tasksToLabels, ({ one }) => ({
  task: one(tasks, {
    fields: [tasksToLabels.taskId],
    references: [tasks.id],
  }),
  label: one(labels, {
    fields: [tasksToLabels.labelId],
    references: [labels.id],
  }),
}));

export const projectLabelsRelations = relations(
  projectsToLabels,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectsToLabels.projectId],
      references: [projects.id],
    }),
    label: one(labels, {
      fields: [projectsToLabels.labelId],
      references: [labels.id],
    }),
  }),
);
