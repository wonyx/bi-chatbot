'use client';
import { SidebarHistory } from '@/components/sidebar-history';
import { SidebarContent } from '@/components/ui/sidebar';
import type { User } from 'next-auth';
import { usePathname } from 'next/navigation';
import { AppSidebarMenu } from './app-sidebar-menu';

export type AppSidebarContentProps = { user: User | undefined };
export function AppSidebarContent({ user }: AppSidebarContentProps) {
  const pathname = usePathname();
  return (
    <SidebarContent>
      <AppSidebarMenu />
      {pathname === '/' || pathname.startsWith('/chat') ? (
        <SidebarHistory user={user} />
      ) : pathname.startsWith('/reports') ? (
        <span>report</span>
      ) : null}
    </SidebarContent>
  );
}
