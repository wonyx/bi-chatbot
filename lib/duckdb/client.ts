import duckdb, { DuckDBInstance } from '@duckdb/node-api';
import { renderString } from './template';
import { createContentStorage } from '../storage/client';
let isInitialized = false;
let instance: DuckDBInstance;
export interface createDBClientArgs {
  CONTENT_UNSTORAGE_INIT_DB_SQL: string;
}
export async function createDBClient(env: createDBClientArgs) {
  if (!isInitialized) {
    const storage = await createContentStorage(env);

    instance = await DuckDBInstance.create();
    isInitialized = true;
    console.log('initializing duckdb cwd:', process.cwd());
    const initSql = await storage.getItemRaw(env.CONTENT_UNSTORAGE_INIT_DB_SQL);
    const templated = await renderString(initSql, process.env);
    // console.log('running init sql', initSql, templated);

    const conn = await instance.connect();
    const _initRes = await conn.run(templated);
    // console.log('init res', await toJson(initRes));
  }
  // console.log('after init sql');
  const conn = await instance.connect();
  // console.log('after connect');
  if (!conn) {
    console.error('no connection');
    throw new Error('no connection');
  }
  return {
    query: async (
      query: string,
    ): Promise<duckdb.DuckDBMaterializedResult | undefined> => {
      // console.log('running query', query);
      const res = await conn.run(query).catch((e) => {
        console.error('error', e);
        throw e;
      });
      return res;
    },
    async toJson(res: duckdb.DuckDBMaterializedResult) {
      return {
        columns: await res.columnNamesAndTypesJson(),
        rows: await res.getRowObjectsJson(),
      };
    },
    async getSchema() {
      const cli = this;
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
  };
}
export type DBClient = Awaited<ReturnType<typeof createDBClient>>;

export async function toJson(res: duckdb.DuckDBMaterializedResult) {
  return {
    columns: await res.columnNamesAndTypesJson(),
    rows: await res.getRowObjectsJson(),
  };
}
