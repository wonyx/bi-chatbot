import React from 'react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';
import { NextLink } from './next-link';
import { ChartAreaIcon, MessagesSquare } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const menuItems = [
  { name: 'Chat', href: '/', icon: <MessagesSquare /> },
  { name: 'Reports', href: '/reports', icon: <ChartAreaIcon /> },
];
export type AppSidebarMenuProps = {};
export function AppSidebarMenu(props: AppSidebarMenuProps) {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <AppSidebarMenuItem key={item.name} {...item} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
function AppSidebarMenuItem(item: {
  name: string;
  href: string;
  icon: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  return (
    <SidebarMenuItem key={item.name}>
      <SidebarMenuButton asChild isActive={isActive}>
        <NextLink href={item.href}>
          {item.icon}
          <span>{item.name}</span>
        </NextLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
