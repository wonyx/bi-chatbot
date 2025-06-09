import { createDBClient } from '@/lib/duckdb/client';
import { createContentStorage } from '@/lib/storage/client';
import { MDXPage } from '@/components/mdx-page';
import { env } from '@/app/env';
export type PageProps = {
  params: Promise<{
    key: string;
  }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export default async function Page(props: PageProps) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);
  console.log('params', params);
  const storage = createContentStorage(env);
  const dbClient = await createDBClient({
    initSqlDir: env.INIT_DB_DIR,
    initSqlFile: env.INIT_DB_SQL,
  });
  console.log('after db');
  return (
    <MDXPage
      params={params}
      searchParams={searchParams}
      contentStorage={storage}
      dbClient={dbClient}
    />
  );
}
