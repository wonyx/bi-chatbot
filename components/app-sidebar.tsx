import { SidebarUserNav } from '@/components/sidebar-user-nav';
import { Sidebar, SidebarFooter } from '@/components/ui/sidebar';
import type { User } from 'next-auth';
import { AppSidebarHeader } from './app-sidebar-header';
import { AppSidebarContent } from './app-sidebar-content';

export function AppSidebar({ user }: { user: User | undefined }) {
  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <AppSidebarHeader />
      <AppSidebarContent user={user} />
      <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
