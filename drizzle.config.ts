import type { Config } from 'drizzle-kit';

export default {
  dialect: 'postgresql',
  schema: './db/schema.ts',
  out: './db/migrations',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  casing: 'snake_case',
} satisfies Config;
