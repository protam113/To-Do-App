'use client';

import { cn } from '@/utils';
import { StatisUserGrowth } from './user-growth';
import { UserOverviewProvider } from './user-overview';

interface StatisOverviewProps {
  refreshKey?: number;
}

export const StatisOverview = ({ refreshKey = 0 }: StatisOverviewProps) => {
  return (
    <UserOverviewProvider>
      <StatisUserGrowth refreshKey={refreshKey} />
    </UserOverviewProvider>
  );
};
