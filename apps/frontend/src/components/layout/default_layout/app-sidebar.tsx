'use client';

import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui';
import { sidebarData } from '@/libs';
import { Separator } from '@/components/ui';
import { NavSuport } from './nav-support';
import { NavManager } from './nav-manager';

export function DefaultSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader />

      <SidebarContent>
        <Separator className="mx-2 h-px bg-gray-200" />
        <NavManager items={sidebarData.navMain} />
        <Separator className="mx-2 h-px bg-gray-200" />
      </SidebarContent>

      <SidebarFooter>
        <NavSuport items={sidebarData.navSuport} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
