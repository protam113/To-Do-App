'use client';

import { DefaultLayout } from '@/components/layout/default_layout/layout';
import { ScrollToTopButton } from '@/components/button/scroll.button';
import { Container } from '@/components';

export default function CustomerLayoutDefault({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DefaultLayout>
      <div>{children}</div>
      <ScrollToTopButton />
    </DefaultLayout>
  );
}
