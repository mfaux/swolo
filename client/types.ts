import { insertTaskSchema, labels, projects, tasks } from '@/db/schema';
import { z } from 'zod';

export const taskFormSchema = insertTaskSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type TaskFormData = Required<z.infer<typeof taskFormSchema>>;

// type TaskLabelsFormData = z.infer<typeof insertTaskLabelsSchema>;
//export type TaskWithLabelsFormData = TaskFormData & TaskLabelsFormData;

export type Task = StrictOmit<typeof tasks.$inferSelect, 'userId'>;
export type Label = StrictOmit<typeof labels.$inferSelect, 'userId'>;

export type TaskWithLabels = {
  projectName: string | null;
  labels: Label[];
} & Task;

export type Project = StrictOmit<typeof projects.$inferSelect, 'userId'>;
export type ProjectWithLabels = {
  parentName?: string | null;
  labels: Label[];
} & Project;
