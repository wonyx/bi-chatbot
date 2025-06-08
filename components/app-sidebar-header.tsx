'use client';
import {
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';
import Link from 'next/link';

export type AppSidebarHeaderProps = {};
export function AppSidebarHeader(props: AppSidebarHeaderProps) {
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarHeader>
      <SidebarMenu>
        <div className="flex flex-row justify-between items-center">
          <Link
            href="/"
            onClick={() => {
              setOpenMobile(false);
            }}
            className="flex flex-row gap-3 items-center"
          >
            <span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
              BI Chatbot
            </span>
          </Link>
          {/* <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="p-2 h-fit"
                  onClick={() => {
                    setOpenMobile(false);
                    router.push('/');
                    router.refresh();
                  }}
                >
                  <PlusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end">New Chat</TooltipContent>
            </Tooltip> */}
        </div>
      </SidebarMenu>
    </SidebarHeader>
  );
}
