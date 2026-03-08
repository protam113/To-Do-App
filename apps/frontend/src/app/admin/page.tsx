'use client';

import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Container } from '../../components';
import SystemHistory from '../../components/list/task.list';
import { StatisOverview } from '../../components/statistics/user/overview';
import TicketHistory from '../../components/list/ticket.list';
import { Button } from '@/components/ui';
import { RefreshCw } from 'lucide-react';
import { Heading } from '@/components/design';
import { LiveMetricsCard } from '@/components/card/live-metrics.card';
import { useAuthStore } from '@/store';
import { ReportStatsCards } from '@/components/statistics/report/report-stats-cards';
import {
  UserOverviewProvider,
  UserSummaryCards,
} from '@/components/statistics/user/user-overview';
import { TimeRangePicker, TimeRange } from '@/components/ui/time-range-picker';

export default function Page() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { userInfo } = useAuthStore();

  const defaultRange = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    return {
      from: start,
      to: end,
      label: 'Last 7 days',
    };
  }, []);

  const [timeRange, setTimeRange] = useState<TimeRange>(defaultRange);

  const startDate = format(timeRange.from, 'yyyy-MM-dd');
  const endDate = format(timeRange.to, 'yyyy-MM-dd');

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleTimeRangeChange = (newRange: TimeRange) => {
    setTimeRange(newRange);
    // Trigger refresh when time range changes to fetch new data
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Container>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Monitor your operations and system metrics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <TimeRangePicker
                value={timeRange}
                onChange={handleTimeRangeChange}
              />

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="flex items-center gap-2 border-gray-200 hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </Button>
            </div>
          </div>

          {/* Report Statistics Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Report Overview
            </h2>
            <ReportStatsCards
              startDate={startDate}
              endDate={endDate}
              refreshKey={refreshKey}
            />
          </div>

          {/* User Statistics Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              User Statistics
            </h2>
            <UserOverviewProvider>
              <UserSummaryCards />
            </UserOverviewProvider>
          </div>

          {/* Activity Overview - Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              {/* <h2 className="text-lg font-semibold text-gray-900 mb-4">
                User Growth
              </h2> */}
              <StatisOverview refreshKey={refreshKey} />
            </div>

            <div>
              {/* <h2 className="text-lg font-semibold text-gray-900 mb-4">
                System History
              </h2> */}
              <SystemHistory />
            </div>
          </div>

          {/* Ticket History */}
          <div>
            {/* <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Ticket History
            </h2> */}
            <TicketHistory />
          </div>
        </div>
      </div>
    </Container>
  );
}
