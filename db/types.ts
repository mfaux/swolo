import { labels, projects, tasks } from './schema';

export type Project = typeof projects.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Label = typeof labels.$inferSelect;

export type LabelWithoutUserId = Omit<Label, 'userId'>;

export type ProjectWithLabels = {
  parentName?: string | null;
  labels: LabelWithoutUserId[];
} & Omit<Project, 'userId'>;

export type TaskWithLabels = {
  projectName: string | null;
  labels: LabelWithoutUserId[];
} & Omit<Task, 'userId'>;
