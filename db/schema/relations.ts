import { relations } from 'drizzle-orm/relations';
import { labels } from './labels';
import { projectLabels, projects } from './projects';
import { taskLabels, tasks } from './tasks';
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
  labels: many(projectLabels),
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
  labels: many(taskLabels),
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
}));

export const labelsRelations = relations(labels, ({ many, one }) => ({
  tasks: many(taskLabels),
  projects: many(projectLabels),
  user: one(users, {
    fields: [labels.userId],
    references: [users.id],
  }),
}));

export const taskLabelsRelations = relations(taskLabels, ({ one }) => ({
  task: one(tasks, {
    fields: [taskLabels.taskId],
    references: [tasks.id],
  }),
  label: one(labels, {
    fields: [taskLabels.labelId],
    references: [labels.id],
  }),
}));

export const projectLabelsRelations = relations(projectLabels, ({ one }) => ({
  project: one(projects, {
    fields: [projectLabels.projectId],
    references: [projects.id],
  }),
  label: one(labels, {
    fields: [projectLabels.labelId],
    references: [labels.id],
  }),
}));
