import {
  insertProjectSchema,
  insertTaskSchema,
  labels,
  projects,
  tasks,
} from '@/db/schema';
import { z } from 'zod';

// Used in forms to indicate when the user has selected the 'none' option (e.g., in a select dropdown)
export const __SWOLO_NONE_SELECTED = '__SWOLO_NONE_SELECTED';

// Form fields in react-hook-form can't be nullable, so we need to exclude null from the type
type WithNonNullableProperties<TObj> = {
  [K in keyof TObj]: Exclude<TObj[K], null>;
};

// Label whose fields are visible to the user.
type Label = StrictOmit<typeof labels.$inferSelect, 'userId'>;

// Project with fields visible to the user (but not necessarily editable)
export type Project = StrictOmit<typeof projects.$inferSelect, 'userId'>;
export type ProjectWithLabels = {
  parentName?: string | null;
  labels: Label[];
} & Project;

// Project with fields the user can edit
export const projectFormSchema = insertProjectSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type ProjectFormData = WithNonNullableProperties<
  z.infer<typeof projectFormSchema>
>;

// Task with fields visible to the user (but not necessarily editable).
type Task = StrictOmit<typeof tasks.$inferSelect, 'userId'>;

export type TaskWithLabels = {
  projectName: string | null;
  labels: Label[];
} & Task;

// Task with fields the user can edit
export const taskFormSchema = insertTaskSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type TaskFormData = WithNonNullableProperties<
  z.infer<typeof taskFormSchema>
>;
