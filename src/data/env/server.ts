import 'dotenv/config';

export const env = {
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || '12345',
  DB_NAME: process.env.DB_NAME || 'mauryavansham',
  DATABASE_URL: process.env.DATABASE_URL || '',
};
