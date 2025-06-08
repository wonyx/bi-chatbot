import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarToggle } from './sidebar-toggle';

type ReportHeaderProps = {
  title: string;
};
export function ReportHeader(props: ReportHeaderProps) {
  const { title } = props;
  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
      <SidebarToggle />
      <Separator
        orientation="vertical"
        className="mx-2 data-[orientation=vertical]:h-4"
      />
      <h1 className="text-base font-medium">{title}</h1>
    </header>
  );
}
