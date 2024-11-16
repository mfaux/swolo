import dotenv from 'dotenv';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import path from 'path';
import { db } from './drizzle';

dotenv.config();

async function main() {
  await migrate(db, {
    migrationsFolder: path.join(process.cwd(), '/db/migrations'),
  });
  await db.$client.end();
  console.log(`Migrations complete`);
  process.exit(0);
}

main();
