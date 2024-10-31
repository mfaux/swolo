import { insertTaskSchema, labels, projects, tasks } from '@/db/schema';
import { z } from 'zod';

// export const insertProjectSchema = createInsertSchema(projects, {
//   name: (schema) => schema.name.trim().min(1).max(100),
// });

export const taskFormSchema = insertTaskSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type TaskFormData = Required<z.infer<typeof taskFormSchema>>;

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
