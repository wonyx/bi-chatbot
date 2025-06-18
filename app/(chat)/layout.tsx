import { cookies } from 'next/headers';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '../(auth)/auth';
import Script from 'next/script';
import ClientLayout from './client-layout';

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true';

  return (
    <>
      <SidebarProvider defaultOpen={!isCollapsed}>
        <AppSidebar user={session?.user} />
        <SidebarInset>
          <ClientLayout>{children}</ClientLayout>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
