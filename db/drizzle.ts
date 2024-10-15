import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

dotenv.config();

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

export const client = postgres(process.env.POSTGRES_URL);
export const db = drizzle(client, { schema, casing: 'snake_case' });
