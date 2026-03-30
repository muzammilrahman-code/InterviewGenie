import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { interviews } from './schema.js';

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema: { interviews } });

export { interviews };
