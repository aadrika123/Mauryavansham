// import type { Config } from "drizzle-kit"

// export default {
//   schema: "./src/drizzle/schema.ts", // Path to your main schema file
//   out: "./src/drizzle/migrations", // Directory for migration files
//   driver: "pg",
//   dbCredentials: {
//     url: process.env.DATABASE_URL!,
//   },
// } satisfies Config

import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/drizzle/migrations',
  schema: './src/drizzle/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
});
