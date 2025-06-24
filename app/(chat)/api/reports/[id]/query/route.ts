import { auth } from '@/app/(auth)/auth';
import { env } from '@/app/env';
import { toJson, createDBClient } from '@/lib/duckdb/client';
import { ChatSDKError } from '@/lib/errors';
import { createContentStorage } from '@/lib/storage/client';
import matter from 'gray-matter';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return new ChatSDKError(
      'bad_request:api',
      'Parameter id is missing',
    ).toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError('unauthorized:report').toResponse();
  }

  const storage = await createContentStorage(env);
  const cli = await createDBClient({
    initSqlDir: env.INIT_DB_DIR,
    initSqlFile: env.INIT_DB_SQL,
  });
  const content = await storage.getItemRaw(id);

  if (!content) {
    return new ChatSDKError('not_found:report').toResponse();
  }
  const { data: frontmatter } = matter(content.toString());

  const res: any = {};
  for (const [key, value] of Object.entries(frontmatter.sql)) {
    if (value) {
      // @ts-ignore
      const sql = value.content as string;
      const result = await cli.query(sql);
      // @ts-ignore
      res[key] = await toJson(result);
    }
  }

  return Response.json(res, { status: 200 });
}
