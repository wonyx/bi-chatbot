import { env } from '@/app/env';
import { user } from '@/lib/db/schema';
import { createDBClient } from '@/lib/duckdb/client';
import { tool } from 'ai';
import { z } from 'zod';

export const generateSQL = tool({
  description: 'Generate SQL queries based on user input',
  parameters: z.object({
    userInput: z.string().describe('The user input for generating SQL queries'),
  }),
  execute: async () => {
    const cli = await createDBClient({
      initSqlDir: env.INIT_DB_DIR,
      initSqlFile: env.INIT_DB_SQL,
    });
    const res = await cli.query('SHOW TABLES');
    if (!res) {
      throw new Error('No tables found');
    }
    const json = await cli.toJson(res);
    if (!json || !json.rows || json.rows.length === 0) {
      throw new Error('No tables found');
    }
    return {
      tables: json.rows.map((row) => row.name),
    };
  },
});

async function validateSQL(query: string) {
  const cli = await createDBClient({
    initSqlDir: env.INIT_DB_DIR,
    initSqlFile: env.INIT_DB_SQL,
  });
  try {
    await cli.query(query);
    return true;
  } catch (error) {
    console.error('SQL validation error:', error);
    return false;
  }
}
