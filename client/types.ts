import { labels } from '@/db/schema/labels';
import { projects } from '@/db/schema/projects';
import { insertTaskSchema, tasks } from '@/db/schema/tasks';
import { z } from 'zod';

export const taskFormSchema = insertTaskSchema.omit({
  id: true,
  workspaceId: true,
  createdAt: true,
  updatedAt: true,
});

export type TaskFormData = Required<z.infer<typeof taskFormSchema>>;

// type TaskLabelsFormData = z.infer<typeof insertTaskLabelsSchema>;
//export type TaskWithLabelsFormData = TaskFormData & TaskLabelsFormData;

export type Task = StrictOmit<typeof tasks.$inferSelect, 'workspaceId'>;
export type Label = StrictOmit<typeof labels.$inferSelect, 'workspaceId'>;

export type TaskWithLabels = {
  projectName: string | null;
  labels: Label[];
} & Task;

export type Project = StrictOmit<typeof projects.$inferSelect, 'workspaceId'>;
export type ProjectWithLabels = {
  parentName?: string | null;
  labels: Label[];
} & Project;
