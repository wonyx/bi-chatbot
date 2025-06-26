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
export function AppSidebarReport(_props: AppSidebarReportProps) {
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

  if (isLoading) {
    return (
      <SidebarGroup>
        <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
          Loading reports...
        </div>
        <SidebarGroupContent>
          <div className="flex flex-col">
            {[44, 32, 28, 64, 52].map((item) => (
              <div
                key={item}
                className="rounded-md h-8 flex gap-2 px-2 items-center"
              >
                <div
                  className="h-4 rounded-md flex-1 max-w-[--skeleton-width] bg-sidebar-accent-foreground/10"
                  style={
                    {
                      '--skeleton-width': `${item}%`,
                    } as React.CSSProperties
                  }
                />
              </div>
            ))}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

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
  _pageIndex: number,
  _previousPageData: ChatHistory,
) {
  return `/api/reports?limit=${PAGE_SIZE}`;
}
