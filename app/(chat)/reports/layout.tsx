import { ReportHeader } from '@/components/report-header';
import React, { PropsWithChildren } from 'react';

export type LayoutProps = PropsWithChildren;
export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <ReportHeader title="" />
      {children}
    </>
  );
}
