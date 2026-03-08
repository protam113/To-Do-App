'use client';

import { useReportDailyStatis } from '@/hooks';
import { LoadingSpin } from '../loading';
import { useMemo } from 'react';

interface StatisReportDailyProps {
  startDate: string;
  endDate: string;
  refreshKey: number;
}

export function RecentCard({
  startDate,
  endDate,
  refreshKey,
}: StatisReportDailyProps) {
  const filters = {
    start_date: startDate,
    end_date: endDate,
  };
  const {
    data: statisticsData,
    isLoading,
    isError,
  } = useReportDailyStatis(filters, refreshKey);

  // API returns array, aggregate data
  const statistics = useMemo(() => {
    if (
      !statisticsData ||
      !Array.isArray(statisticsData) ||
      statisticsData.length === 0
    ) {
      return null;
    }
    if (statisticsData.length === 1) {
      return statisticsData[0];
    }
    return statisticsData.reduce(
      (acc, item) => ({
        count: (acc.count || 0) + item.count,
        byStatus: {
          open: (acc.byStatus?.open || 0) + (item.byStatus?.open || 0),
          in_progress:
            (acc.byStatus?.in_progress || 0) +
            (item.byStatus?.in_progress || 0),
          resolved:
            (acc.byStatus?.resolved || 0) + (item.byStatus?.resolved || 0),
        },
      }),
      {} as any
    );
  }, [statisticsData]);

  return (
    <div className="w-full max-w-sm overflow-hidden rounded-lg bg-main p-6 text-white shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">
          Report overview
        </h2>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-5xl font-bold text-green-200">
            {isLoading ? (
              <LoadingSpin className="text-white" />
            ) : isError ? (
              <span className="text-red-400">Error</span>
            ) : (
              statistics?.count ?? 0
            )}
          </span>
          <div className="flex flex-col text-sm font-medium leading-tight text-white/90">
            <span>Total</span>
            <span>Report</span>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs font-medium text-white/80">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-white">
            {isLoading ? (
              <LoadingSpin className="text-white" />
            ) : isError ? (
              <span className="text-red-400">Error</span>
            ) : (
              statistics?.byStatus?.open ?? 0
            )}
          </span>
          <span>Open</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-white">
            {isLoading ? (
              <LoadingSpin className="text-white" />
            ) : isError ? (
              <span className="text-red-400">Error</span>
            ) : (
              statistics?.byStatus?.in_progress ?? 0
            )}
          </span>
          <span>Process</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-white">
            {isLoading ? (
              <LoadingSpin className="text-white" />
            ) : isError ? (
              <span className="text-red-400">Error</span>
            ) : (
              statistics?.byStatus?.resolved ?? 0
            )}
          </span>
          <span>Resolved</span>
        </div>
      </div>
    </div>
  );
}
