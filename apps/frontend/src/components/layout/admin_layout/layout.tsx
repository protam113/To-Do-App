'use client';

import React from 'react';
import { SidebarInset, SidebarProvider } from '@/components/ui';
import { AdminSidebar } from './admin-sidebar';
import type { LayoutProps } from '@/types';
import TopNavAdmin from './nav-header';

const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="h-16 shrink-0">
          <TopNavAdmin />
        </header>

        <main className="flex-1" style={{ backgroundColor: '#f8fafc' }}>
          <div>{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
