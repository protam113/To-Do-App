'use client';

import { Container } from '@/components';
import { SelectedTaskProvider } from '@/context/use-selected-task-context';

export default function TeamLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SelectedTaskProvider>
      <Container>{children}</Container>
    </SelectedTaskProvider>
  );
}
