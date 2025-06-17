'use client';
import { NextLink } from '@/components/next-link';
import React from 'react';
import { SidebarMenuItem, SidebarMenuButton, useSidebar } from './ui/sidebar';
import { ReportListItem } from '@/lib/types';

export type AppSidebarReportItemProps = {
  report: ReportListItem;
  isActive?: boolean;
};
export function AppSidebarReportItem(props: AppSidebarReportItemProps) {
  const { report, isActive } = props;
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <NextLink
          href={`/reports/${report.id}`}
          onClick={() => setOpenMobile(false)}
        >
          <span>{report.title}</span>
        </NextLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
