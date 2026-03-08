'use client';

import { Container } from '@/components';
import { ScrollToTopButton } from '@/components/button/scroll.button';
import { DefaultLayout } from '@/components/layout/default_layout/layout';

export default function CustomerLayoutDefault({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DefaultLayout>
      <Container className="pt-[20px]">{children}</Container>
      <ScrollToTopButton />
    </DefaultLayout>
  );
}
