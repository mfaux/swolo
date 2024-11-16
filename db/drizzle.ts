import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';

dotenv.config();

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const db = drizzle({
  connection: process.env.DATABASE_URL,
  casing: 'snake_case',
});
