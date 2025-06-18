import { ReportHeader } from '@/components/report-header';
import React, { PropsWithChildren } from 'react';
import ClientLayout from './client-layout';

export type LayoutProps = PropsWithChildren;
export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <ReportHeader title="" />
      <ClientLayout>
      {children}</ClientLayout>
    </>
  );
}
