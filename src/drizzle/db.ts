import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { env } from '@/src/data/env/server';

export const db = drizzle({
  schema,
  connection: {
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    host: env.DB_HOST,
    port: 5432,
  },
});
