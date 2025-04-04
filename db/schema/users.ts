import { pgTable as table, varchar } from 'drizzle-orm/pg-core';
import { cuidLength, timestamps } from './utils';

// Users table (to be synced with Clerk)
// Clerk will handle email, name, and other user profile data. NYI
export const users = table('users', {
  id: varchar({ length: cuidLength }).primaryKey(),
  ...timestamps,
});
