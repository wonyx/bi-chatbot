import { auth } from '@/app/(auth)/auth';
import { env } from '@/app/env';
import { ChatSDKError } from '@/lib/errors';
import { createContentStorage } from '@/lib/storage/client';
import { ReportList, } from '@/lib/types';
import matter from 'gray-matter';
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError('unauthorized:auth').toResponse();
  }

  const storage = createContentStorage(env);
  const keys = await storage.keys();

  const items = await Promise.all(
    keys
      .filter((key) => key.endsWith('.mdx'))
      .map(async (key) => ({
        key,
        content: await storage.getItemRaw(key),
      }))
      .map(async (item) => {
        const { key, content } = await item;
        const { data: frontmatter } = matter(content.toString());
        return {
          id: key,
          title: frontmatter.title || key,
        };
      }),
  );
  const data: ReportList = {
    items,
    totalCount: keys.length,
    hasMore: false, // TODO: Pagination not implemented
  };
  return Response.json(data, { status: 200 });
}
