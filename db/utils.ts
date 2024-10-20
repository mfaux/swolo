import { and, eq } from 'drizzle-orm';
import { db } from './drizzle';
import { projects } from './schema';

export async function generateUniqueProjectKey(
  userId: string,
  projectName: string,
): Promise<string> {
  let key = '';
  let isKeyUnique = false;
  let counter = 0;

  while (!isKeyUnique) {
    key = projectName.substring(0, 5) + (counter ? counter : '');
    counter++;

    // Check if the key is already in use by this user
    const existingProject = await db
      .select()
      .from(projects)
      .where(and(eq(projects.key, key), eq(projects.userId, userId)))
      .limit(1);

    if (!existingProject.length) {
      isKeyUnique = true;
    }
  }

  return key;
}
