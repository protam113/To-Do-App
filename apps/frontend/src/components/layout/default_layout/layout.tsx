'use client';

import type { LayoutProps } from '@/types';
import { SidebarInset, SidebarProvider } from '@/components/ui';
import { DefaultSidebar } from './app-sidebar';
import TopNav from './top-nav';

export const DefaultLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <DefaultSidebar />
      <SidebarInset>
        <header className="h-16 shrink-0">
          <TopNav />
        </header>
        <main className="flex-1" style={{ backgroundColor: '#f8fafc' }}>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
