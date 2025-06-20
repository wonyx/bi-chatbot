import { env } from '@/app/env';
import { createDBClient } from '@/lib/duckdb/client';
import { tool } from 'ai';
import { z } from 'zod';

export const listTables = tool({
  description: 'show tables and describe tables in the database',
  parameters: z.object({}),
  execute: async () => {
    console.log('Listing tables in the database');
    const cli = await createDBClient({
      initSqlDir: env.INIT_DB_DIR,
      initSqlFile: env.INIT_DB_SQL,
    });
    return cli.getSchema();
  },
});
