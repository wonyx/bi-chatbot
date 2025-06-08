'use client';
import React, { PropsWithChildren } from 'react';
import { MDXProvider } from '@mdx-js/react';
import * as mdxComponents from '@/components/mdx-components';

export type ClientLayoutProps = PropsWithChildren;
export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <MDXProvider components={{ ...mdxComponents }}>{children}</MDXProvider>
  );
}
