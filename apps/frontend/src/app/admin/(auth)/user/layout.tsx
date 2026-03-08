'use client';

import { Suspense } from 'react';
import { SelectedUserProvider } from '../../../../context/use-selected-user.context';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <SelectedUserProvider>{children}</SelectedUserProvider>
    </Suspense>
  );
}
