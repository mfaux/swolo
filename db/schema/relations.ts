import { relations } from 'drizzle-orm/relations';
import { labels } from './labels';
import { projects } from './projects';
import { projectsToLabels } from './projects-to-labels';
import { tasks } from './tasks';
import { tasksToLabels } from './tasks-to-labels';
import { users } from './users';

export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  tasks: many(tasks),
  labels: many(labels),
}));

export const projectsRelations = relations(projects, ({ many, one }) => ({
  tasks: many(tasks),
  childProjects: many(projects, { relationName: 'parentChild' }),
  parentProject: one(projects, {
    fields: [projects.parentId],
    references: [projects.id],
    relationName: 'parentChild',
  }),
  labels: many(projectsToLabels),
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  labels: many(tasksToLabels),
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
}));

export const labelsRelations = relations(labels, ({ many, one }) => ({
  tasks: many(tasksToLabels),
  projects: many(projectsToLabels),
  user: one(users, {
    fields: [labels.userId],
    references: [users.id],
  }),
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
