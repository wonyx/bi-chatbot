import { env } from '@/app/env';
import { PortraitLayout } from '@/components/report-document';
import { createContentStorage } from '@/lib/storage/client';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';

export type PageProps = {};
export default async function Page(_props: PageProps) {
  const storage = await createContentStorage(env);
  const source = await storage.getContent(decodeURIComponent('README.md'));
  const { default: MDXContent } = await evaluate(source, runtime);
  return (
    <PortraitLayout>
      <MDXContent />
    </PortraitLayout>
  );
}
