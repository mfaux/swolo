import { labels, projects, tasks } from './schema';

export type Project = typeof projects.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Label = typeof labels.$inferSelect;

export type ProjectWithLabels = {
  id: number;
  name: string;
  key: string;
  description?: string;
  parentName?: string | null;
  labels: Label[];
};
