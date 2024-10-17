'use server';

import { db } from '@/db/drizzle';
import { projects } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const schema = z.object({
  projectName: z.string({
    invalid_type_error: 'Invalid project name',
  }),
});

export const createProject = async (_: any, formData: FormData) => {
  let rawFormData = {
    projectName: formData.get('projectName'),
  };

  try {
    const validatedFields = schema.parse({
      projectName: rawFormData.projectName,
    });

    const { projectName } = validatedFields;

    // TODO: ensure the user is authorized
    // https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#authentication-and-authorization

    await db.insert(projects).values({
      name: projectName,
      userId: 'fox',
    });

    revalidatePath('/');
    return { success: true };
  } catch (e) {
    if (e instanceof z.ZodError) {
      return { error: e.errors[0].message, previous: rawFormData };
    }
    return {
      error: 'Failed to create project',
    };
  }
};
