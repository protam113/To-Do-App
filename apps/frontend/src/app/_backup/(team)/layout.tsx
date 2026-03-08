'use client';

import { DefaultLayout } from '../../../../components/layout/default_layout/layout';

export default function CustomerLayoutDefault({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DefaultLayout>
      <div>{children}</div>
    </DefaultLayout>
  );
}
