'use client';

import { fetcher } from '@/lib/utils';
import { useParams } from 'next/navigation';
import useSWRInfinite from 'swr/infinite';
import { ChatHistory } from './sidebar-history';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  useSidebar,
} from './ui/sidebar';
import { AppSidebarReportItem } from './app-sidebar-report-item';
import { ReportList } from '@/lib/types';

const PAGE_SIZE = 20;

export type AppSidebarReportProps = {};
export function AppSidebarReport(props: AppSidebarReportProps) {
  const { setOpenMobile } = useSidebar();
  const { key } = useParams();

  const {
    data: paginatedReports,
    setSize,
    isValidating,
    isLoading,
    mutate,
  } = useSWRInfinite<ReportList>(listReportsPaginationKey, fetcher, {
    fallbackData: [],
  });

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {paginatedReports &&
            (() => {
              const flattenedReports = paginatedReports?.flatMap(
                (page) => page.items,
              );
              return (
                <>
                  {flattenedReports.map((report) => (
                    <AppSidebarReportItem
                      report={report}
                      key={report.id}
                      isActive={report.id === key}
                    />
                  ))}
                </>
              );
            })()}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function listReportsPaginationKey(
  pageIndex: number,
  previousPageData: ChatHistory,
) {
  return `/api/reports?limit=${PAGE_SIZE}`;
}
