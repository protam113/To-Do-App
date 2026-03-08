'use client';

import { SelectedTaskProvider } from '@/context/use-selected-task-context';

export default function TeamLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SelectedTaskProvider>
      <main>{children}</main>
    </SelectedTaskProvider>
  );
}
