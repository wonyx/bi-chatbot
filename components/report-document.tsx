'use client';
import * as mdxComponents from '@/components/mdx-components';
import { evaluate } from '@mdx-js/mdx';
import { useQuery } from '@tanstack/react-query';
import type { MDXProps } from 'mdx/types';
import type { PropsWithChildren, ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import runtime from 'react/jsx-runtime';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { InlineDocumentSkeleton } from './document-skeleton';
type ReactMDXContent = (props: MDXProps) => ReactNode;

export type ReportDocumentProps = {
  type: 'report' | 'document';
  id: string;
  source: string;
};
export function ReportDocument(props: ReportDocumentProps) {
  const { id, type, source } = props;

  const [MdxContent, setMdxContent] = useState<ReactMDXContent>(
    () => () => null,
  );
  const [frontmatter, setFrontmatter] = useState<Record<string, any>>({
    title: 'Default Title',
    description: 'Default Description',
  });

  const {
    data: res,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['reports/query', id],
    queryFn: async () => {
      const url =
        type === 'report'
          ? new URL(`/api/reports/${id}/query`, window.location.origin)
          : new URL(`/api/document/${id}/query`, window.location.origin);
      const response = await fetch(url, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });

  useEffect(() => {
    evaluate(source, {
      ...runtime,
      format: 'mdx',
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    }).then((r) => {
      setMdxContent(() => r.default);
      // console.log('MDX Content:', r);
      if (r.frontmatter) {
        setFrontmatter(r.frontmatter);
      }
    });
  }, [source]);
  const data = useMemo(() => {
    if (!res) {
      return null;
    }
    const ret: any = {};
    for (const [key, value] of Object.entries(res)) {
      // @ts-ignore
      ret[key] = toDataset(value);
    }
    return ret;
  }, [res]);

  if (isLoading || !MdxContent || !data) {
    return (
      <div className="flex justify-center items-center size-full">
        <InlineDocumentSkeleton />
      </div>
    );
  }
  if (isError) {
    console.error('Error fetching report data:', error);
    return <div>error</div>;
  }

  return frontmatter.layout === 'landscape' ? (
    <LandscapeLayout>
      <MdxContent components={mdxComponents} data={data} />
    </LandscapeLayout>
  ) : (
    <PortraitLayout>
      <MdxContent components={mdxComponents} data={data} />
    </PortraitLayout>
  );
}

function toDataset(res: Record<string, any>): {
  dataset: {
    dimentions: string[];
    source: any[];
  };
} {
  const columns = res.columns || [];
  const rows = res.rows || [];
  return {
    dataset: {
      dimentions: columns.columnNames,
      source: rows,
    },
  };
}

export function PortraitLayout({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto p-2.5 w-full min-w-0 max-w-2xl ">
      <article className="prose prose-gray dark:prose-invert">
        {children}
      </article>
    </div>
  );
}

export function LandscapeLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <article
        className="prose prose-gray dark:prose-invert"
        style={{ maxWidth: 'none' }}
      >
        {children}
      </article>
    </div>
  );
}
