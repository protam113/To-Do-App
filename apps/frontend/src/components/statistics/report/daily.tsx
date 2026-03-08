'use client';

import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useReportDailyStatis } from '../../../hooks/statistics/useStatisticReport';
import { LoadingSpin } from '../../loading/spin';
import NoResultsFound from '../../design/no_result.design';
import { ReportStatsCards } from './report-stats-cards';

ChartJS.register(ArcElement, Tooltip, Legend);

interface StatisReportDailyProps {
  startDate: string;
  endDate: string;
  refreshKey: number;
}

export const StatisReportDaily = ({
  startDate,
  endDate,
  refreshKey,
}: StatisReportDailyProps) => {
  const filters = {
    start_date: startDate,
    end_date: endDate,
  };

  const {
    data: statisticsData,
    isLoading,
    isError,
  } = useReportDailyStatis(filters, refreshKey);

  // API returns array, get first item or aggregate
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
        date: `${statisticsData[0].date} - ${
          statisticsData[statisticsData.length - 1].date
        }`,
        bySeverity: {
          low: (acc.bySeverity?.low || 0) + (item.bySeverity?.low || 0),
          medium:
            (acc.bySeverity?.medium || 0) + (item.bySeverity?.medium || 0),
          high: (acc.bySeverity?.high || 0) + (item.bySeverity?.high || 0),
          critical:
            (acc.bySeverity?.critical || 0) + (item.bySeverity?.critical || 0),
        },
        byStatus: {
          open: (acc.byStatus?.open || 0) + (item.byStatus?.open || 0),
          in_progress:
            (acc.byStatus?.in_progress || 0) +
            (item.byStatus?.in_progress || 0),
          resolved:
            (acc.byStatus?.resolved || 0) + (item.byStatus?.resolved || 0),
          canceled:
            (acc.byStatus?.canceled || 0) + (item.byStatus?.canceled || 0),
        },
      }),
      {} as any
    );
  }, [statisticsData]);

  // Severity chart data
  const severityChartData = useMemo(() => {
    if (!statistics?.bySeverity) return null;
    const { bySeverity } = statistics;
    return {
      labels: ['Low', 'Medium', 'High', 'Critical'],
      datasets: [
        {
          data: [
            bySeverity.low ?? 0,
            bySeverity.medium ?? 0,
            bySeverity.high ?? 0,
            bySeverity.critical ?? 0,
          ],
          backgroundColor: ['#22c55e', '#eab308', '#f97316', '#ef4444'],
          borderWidth: 0,
        },
      ],
    };
  }, [statistics]);

  // Calculate percentages for table
  const severityTable = useMemo(() => {
    if (!statistics?.bySeverity) return [];
    const { bySeverity } = statistics;
    const total =
      (bySeverity.low ?? 0) +
      (bySeverity.medium ?? 0) +
      (bySeverity.high ?? 0) +
      (bySeverity.critical ?? 0);
    const items = [
      { label: 'Low', count: bySeverity.low ?? 0, color: '#22c55e' },
      { label: 'Medium', count: bySeverity.medium ?? 0, color: '#eab308' },
      { label: 'High', count: bySeverity.high ?? 0, color: '#f97316' },
      { label: 'Critical', count: bySeverity.critical ?? 0, color: '#ef4444' },
    ];
    return items.map((item) => ({
      ...item,
      percentage: total > 0 ? ((item.count / total) * 100).toFixed(3) : '0.000',
    }));
  }, [statistics]);

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    cutout: '60%',
  };

  if (isError) {
    return <div className="p-4 text-red-500">Error loading data</div>;
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        <LoadingSpin />
      ) : statistics?.bySeverity && statistics?.byStatus ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: Stats Cards */}
          <ReportStatsCards
            startDate={startDate}
            endDate={endDate}
            refreshKey={refreshKey}
          />

          {/* Right: Doughnut Chart with Table */}
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="text-main text-sm font-medium text-center ">
              Severity Distribution
            </p>
            <div className="flex items-center gap-6">
              {/* Chart */}
              <div style={{ width: '180px', height: '180px' }}>
                {severityChartData && (
                  <Doughnut
                    data={severityChartData}
                    options={doughnutOptions}
                  />
                )}
              </div>
              {/* Table */}
              <div className="flex-1">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-main text-left">
                      <th className="pb-2">severity</th>
                      <th className="pb-2">count</th>
                      <th className="pb-2">percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {severityTable.map((row) => (
                      <tr key={row.label}>
                        <td className="py-1 flex items-center gap-2">
                          <span
                            className="w-3 h-3 inline-block"
                            style={{ backgroundColor: row.color }}
                          />
                          {row.label}
                        </td>
                        <td className="py-1">{row.count}</td>
                        <td className="py-1">{row.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <NoResultsFound />
      )}
    </div>
  );
};
