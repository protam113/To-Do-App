'use client';

import { Suspense } from 'react';
import { SelectedTaskProvider } from '@/context/use-selected-task-context';

export default function ReportLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={null}>
      <SelectedTaskProvider>
        <main>{children}</main>
      </SelectedTaskProvider>
    </Suspense>
  );
}
