import { z } from 'zod';
import { insertProjectSchema } from './schema';

export type CreateProject = z.infer<typeof insertProjectSchema>;
