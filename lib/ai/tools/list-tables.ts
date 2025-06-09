import { env } from '@/app/env';
import { createDBClient } from '@/lib/duckdb/client';
import { tool } from 'ai';
import { z } from 'zod';

export const listTables = tool({
  description: 'show tables and describe tables in the database',
  parameters: z.object({}),
  execute: async () => {
    const cli = await createDBClient({
      initSqlDir: env.INIT_DB_DIR,
      initSqlFile: env.INIT_DB_SQL,
    });
    const res = await cli.query('SHOW TABLES');
    if (!res) {
      throw new Error('No tables found');
    }
    const rowObjects = await res.getRowObjects();
    if (!rowObjects || rowObjects.length === 0) {
      throw new Error('No tables found');
    }
    const ret = [];
    for (const row of rowObjects) {
      const descRes = await cli.query(`DESCRIBE ${row.name?.toString()}`);
      if (!descRes) {
        throw new Error(`No description found for table: ${row.name}`);
      }
      ret.push({
        name: row.name,
        schema: descRes,
      });
    }

    const describedTables = await Promise.all(
      ret.map(async (item) => {
        return {
          name: item.name,
          schema: await cli.toJson(item.schema),
        };
      }),
    );
    return {
      tables: rowObjects,
      describedTables,
    };
  },
});
