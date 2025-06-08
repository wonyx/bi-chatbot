import { createDBClient } from '@/lib/duckdb/client';
import { createContentStorage } from '@/lib/storage/client';
import { MDXPage } from '@workspace/core/components/mdx-page';
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
  const storage = createContentStorage();
  const dbClient = await createDBClient();
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
