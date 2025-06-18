import { createDBClient } from '@/lib/duckdb/client';
import { createContentStorage } from '@/lib/storage/client';
import { MDXPage } from '@/components/mdx-page';
import { env } from '@/app/env';
import { ReportDocument } from '@/components/report-document';
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
  const storage = await createContentStorage(env);
  // const storage = createContentStorage(env);
  // const dbClient = await createDBClient({
  //   initSqlDir: env.INIT_DB_DIR,
  //   initSqlFile: env.INIT_DB_SQL,
  // });
  // console.log('after db');
  const source = await storage.getContent(decodeURIComponent(params.key));

  // return (
  //   <MDXPage
  //     params={params}
  //     searchParams={searchParams}
  //     contentStorage={storage}
  //     dbClient={dbClient}
  //   />
  // );
  return <ReportDocument id={params.key} type="report" source={source} />;
}
