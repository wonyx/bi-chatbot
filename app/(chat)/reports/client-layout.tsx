'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useMemo } from 'react';

export type ClientLayoutProps = PropsWithChildren;
export default function ClientLayout({ children }: ClientLayoutProps) {
  const queryClient = useMemo(() => {
    return new QueryClient({});
  }, []);
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
