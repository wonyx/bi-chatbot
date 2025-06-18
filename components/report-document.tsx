'use client';
import * as mdxComponents from '@/components/mdx-components';
import { evaluate } from '@mdx-js/mdx';
import { useQuery } from '@tanstack/react-query';
import type { MDXProps } from 'mdx/types';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import runtime from 'react/jsx-runtime';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
type ReactMDXContent = (props: MDXProps) => ReactNode;

export type ReportDocumentProps = {
  id: string;
  source: string;
};
export function ReportDocument(props: ReportDocumentProps) {
  const { id, source } = props;
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
  } = useQuery({
    queryKey: ['reports/query', id],
    queryFn: async () => {
      const response = await fetch(`/api/reports/${id}/query`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });

  // console.log('Query Result:', query.data);

  //   const query = frontmatter.query?.my_table?.content
  //     ? JSON.parse(frontmatter.query?.my_table?.content)
  //     : null;
  //   //   const { resultSet, isLoading, error, progress } = useCubeQuery(query, {
  //   //     skip: !query,
  //   //   });

  //   const dataSource = resultSet?.tablePivot();
  //   const columns = resultSet?.tableColumns();

  useEffect(() => {
    evaluate(source, {
      ...runtime,
      format: 'mdx',
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    }).then((r) => {
      setMdxContent(() => r.default);
      console.log('MDX Content:', r);
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
      ret[key] = toDataset(value);
    }
    return ret;
  }, [res]);
  //   if (isLoading) {
  //     return <div>{progress?.stage || 'Loading...'}</div>;
  //   }

  if (isError) {
    return <div>error</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!MdxContent) {
    return <div>Loading MDX content...</div>;
  }

  if (!data) {
    return null;
  }

  console.log('data:', data);

  return (
    <div className="prose prose-gray dark:prose-invert">
      <MdxContent components={mdxComponents} data={data} />
    </div>
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
