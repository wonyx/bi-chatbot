import { createContentStorage } from '@/lib/storage/client';

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
  const [params, _searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);
  console.log('params', params);
  const storage = await createContentStorage(env);
  const source = await storage.getContent(decodeURIComponent(params.key));
  return <ReportDocument id={params.key} type="report" source={source} />;
}
