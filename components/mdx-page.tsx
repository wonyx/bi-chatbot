import * as mdxComponents from '@/components/mdx-components';
import { DBClient } from '@/lib/duckdb/client';
import { renderString } from '@/lib/duckdb/template';
import { compileMdx2 } from '@/lib/mdx-utlis.server';
import { ContentStorage } from '@/lib/storage/client';
import { validateFrontmatter } from '@/lib/zod-schema';
import matter from 'gray-matter';
import { PropsWithChildren } from 'react';

export type PageProps = {
  params: {
    prefix?: string;
    key?: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
  contentStorage: ContentStorage;
  dbClient: DBClient;
};

export async function MDXPage(props: PageProps) {
  const {
    searchParams: searchParamsOrigin,
    params,
    contentStorage,
    dbClient,
  } = props;
  const key = params.key || 'README.md';
  const prefix = params.prefix;
  console.log('key', key);
  const markdown = await contentStorage.getContent(
    decodeURIComponent(key),
    prefix,
  );
  console.log('after markdown', key);
  const { data: fm } = matter(markdown);
  const validMatter = validateFrontmatter(fm);

  const searchParams = {
    ...validMatter.searchParams,
    ...searchParamsOrigin,
  };
  let frontmatter = validMatter;

  const tableEntries = validMatter?.sql
    ? await Promise.all(
        Object.entries(validMatter?.sql).map(async ([key, value]) => {
          const templatedSql = await renderString(
            value.content || '',
            searchParams,
          );
          const table = await dbClient.query(templatedSql);
          return [
            key,
            {
              dataset: {
                dimensions: table?.columnNames()?.map((f) => {
                  // console.log(f)
                  return {
                    name: f,
                  };
                }),
                source: (await table?.getRowsJS())?.map((row: any) => {
                  // console.log(row)
                  return row;
                }),
              },
            },
          ];
        }),
      ).catch((e) => {
        console.error('error', e);
        throw e;
      })
    : [];

  console.log('after db query', key);
  frontmatter = {
    ...validMatter,
    data: Object.fromEntries(tableEntries),
  };

  // override the sql query
  const content = await compileMdx2(
    markdown,
    {
      ...frontmatter,
      searchParams,
    },
    mdxComponents,
  );
  const layout = validMatter.layout || 'portrait';
  console.log('after compile', key, mdxComponents);
  return (
    <>
      {layout === 'portrait' ? (
        <PortraitLayout>
          {/* <MDXContent
              components={{ Card, AreaChart, BarChart, PieChart }}
              {...frontmatter}
            /> */}
          {content}
        </PortraitLayout>
      ) : (
        <LandscapeLayout>{content}</LandscapeLayout>
      )}
    </>
  );
}

// async function resolveSQL(
//   query: {
//     key: string
//     content?: string | null
//   },
//   searchParams: {
//     [key: string]: string | string[] | undefined
//   },
// ): Promise<{
//   content?: string | null
//   key: string
// }> {
//   'use cache'
//   const { key } = query
//   let content = query.content
//   if (!content) {
//     content = await getContent(key)
//   }
//   if (!content) {
//     throw new Error(`not found: ${key}`)
//   }
//   const rendered = await renderString(content, searchParams)
//   return {
//     content: rendered,
//     key,
//   }
// }

function PortraitLayout({ children }: PropsWithChildren) {
  return (
    <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px] ">
      <div className="mx-auto p-2.5 w-full min-w-0 max-w-2xl ">
        <article className="prose prose-gray dark:prose-invert">
          {children}
        </article>
      </div>
    </main>
  );
}

function LandscapeLayout({ children }: PropsWithChildren) {
  return (
    <main className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <article
          className="prose prose-gray dark:prose-invert"
          style={{ maxWidth: 'none' }}
        >
          {children}
        </article>
      </div>
    </main>
  );
}
