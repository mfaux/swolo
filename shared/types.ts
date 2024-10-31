import { labels, projects, tasks, taskTableSchema } from '@/db/schema';
import { z } from 'zod';

export const __SWOLO_NONE = '__SWOLO_NONE';

export const taskFormSchema = taskTableSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
});

type WithNonNullableProperties<TObj> = {
  [K in keyof TObj]: Exclude<TObj[K], null>;
};

export type TaskFormData = WithNonNullableProperties<
  z.infer<typeof taskFormSchema>
>;

// type TaskLabelsFormData = z.infer<typeof insertTaskLabelsSchema>;
//export type TaskWithLabelsFormData = TaskFormData & TaskLabelsFormData;

export type Task = Omit<typeof tasks.$inferSelect, 'userId'>;
export type Label = Omit<typeof labels.$inferSelect, 'userId'>;

export type TaskWithLabels = {
  projectName: string | null;
  labels: Label[];
} & Task;

export type Project = Omit<typeof projects.$inferSelect, 'userId'>;
export type ProjectWithLabels = {
  parentName?: string | null;
  labels: Label[];
} & Project;
