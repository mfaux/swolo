import { projects, tasks } from './schema';

export type Project = typeof projects.$inferSelect;
export type Task = typeof tasks.$inferSelect;
