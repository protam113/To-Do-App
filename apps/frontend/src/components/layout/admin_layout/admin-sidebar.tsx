'use client';

import { useAuthStore } from '@/store';
import * as React from 'react';
import {
  SidebarHeader,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from '../../ui/sidebar';

import { adminData } from '@/libs';
import { Separator } from '@/components/ui';
import { NavMain } from './nav-main';
import { NavAdminUser } from './nav-admin';
import { NavSupport } from './nav-support';
import { NavAdminData } from './nav-data';
import { NavProfile } from './nav-footer';
// import { NavTeam } from './nav-team';

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const userInfo = useAuthStore((state) => state.userInfo);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader />

      <SidebarContent>
        <Separator className="mx-2 h-px bg-gray-200" />
        <NavMain items={adminData.navMain} />
        {['admin'].includes(userInfo?.role || '') && (
          <>
            <Separator className="mx-2 h-px bg-gray-200" />
            <NavAdminUser items={adminData.navAdmin} />
          </>
        )}
        <Separator className="mx-2 h-px bg-gray-200" />

        <NavAdminData items={adminData.navService} />
        <Separator className="mx-2 h-px bg-gray-200" />
        <NavSupport items={adminData.navSupport} />
      </SidebarContent>
      <SidebarFooter>
        <NavProfile />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
