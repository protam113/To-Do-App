'use client';

import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useReportSumaryStatis } from '../../../hooks/statistics/useStatisticReport';
import { LoadingSpin } from '../../loading/spin';
import NoResultsFound from '../../design/no_result.design';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface StatisReportSummaryProps {
  startDate: string;
  endDate: string;
  refreshKey: number;
}

export const StatisReportSummary = ({
  startDate,
  endDate,
  refreshKey,
}: StatisReportSummaryProps) => {
  const filters = useMemo(
    () => ({
      start_date: startDate,
      end_date: endDate,
    }),
    [startDate, endDate]
  );

  const {
    data: statistics,
    isLoading,
    isError,
  } = useReportSumaryStatis(filters, refreshKey);

  // Severity Grouped Bar Chart - mỗi severity 1 cột riêng
  const severityBarData = useMemo(() => {
    if (!statistics?.bySeverity) return null;
    const { bySeverity } = statistics;

    return {
      labels: ['Low', 'Medium', 'High', 'Critical'],
      datasets: [
        {
          label: 'Severity',
          data: [
            bySeverity.low ?? 0,
            bySeverity.medium ?? 0,
            bySeverity.high ?? 0,
            bySeverity.critical ?? 0,
          ],
          backgroundColor: ['#99f6e4', '#5eead4', '#14b8a6', '#0f766e'],
          borderRadius: 4,
        },
      ],
    };
  }, [statistics]);

  // Status Bar Chart - only show non-zero values
  const statusBarData = useMemo(() => {
    if (!statistics?.byStatus) return null;
    const { byStatus } = statistics;
    const items = [
      { label: 'Open', value: byStatus.open ?? 0, color: '#3b82f6' },
      {
        label: 'In Progress',
        value: byStatus.in_progress ?? 0,
        color: '#a855f7',
      },
      { label: 'Resolved', value: byStatus.resolved ?? 0, color: '#10b981' },
      { label: 'Canceled', value: byStatus.canceled ?? 0, color: '#6b7280' },
    ].filter((item) => item.value > 0);

    if (items.length === 0) return null;

    return {
      labels: items.map((i) => i.label),
      datasets: [
        {
          label: 'Status',
          data: items.map((i) => i.value),
          backgroundColor: items.map((i) => i.color),
          borderRadius: 4,
        },
      ],
    };
  }, [statistics]);

  const severityBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: {
          callback: function (value: number | string) {
            const num = Number(value);
            if (num >= 1000) return num / 1000 + 'k';
            return value;
          },
        },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } },
    },
  };

  if (isError) {
    return <div className="p-4 text-red-500">Error loading data</div>;
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        <LoadingSpin />
      ) : statistics ? (
        <>
          {/* Top: Monitor Cards */}
          {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <div className="shadow-sm bg-main-800 p-2 flex items-center justify-center gap-2 min-h-[20px] rounded-md">
              <p className="text-white text-md">Total</p>
              <p className="text-white text-md font-bold">
                {statistics.total ?? 0}
              </p>
            </div>
            <div className="shadow-sm bg-main-500 p-2 flex items-center justify-center gap-2 min-h-[20px] rounded-md">
              <p className="text-white text-md">Created (7d)</p>
              <p className="text-white text-md font-bold">
                {statistics.recentActivity?.created ?? 0}
              </p>
            </div>
            <div className="shadow-sm bg-emerald-600 p-2 flex items-center justify-center gap-2 min-h-[20px] rounded-md">
              <p className="text-white text-md">Resolved (7d)</p>
              <p className="text-white text-md font-bold">
                {statistics.recentActivity?.resolved ?? 0}
              </p>
            </div>
          </div> */}

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Severity Bar Chart - mỗi severity 1 cột */}
            <div
              className="bg-white p-4 rounded-md shadow-sm"
              style={{ height: '280px' }}
            >
              <p className="text-main text-sm font-medium mb-4">By Severity</p>
              {severityBarData ? (
                <div style={{ height: '220px' }}>
                  <Bar data={severityBarData} options={severityBarOptions} />
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">
                  No severity data
                </p>
              )}
            </div>

            {/* Status Bar Chart */}
            <div
              className="bg-white p-4 rounded-md shadow-sm"
              style={{ height: '280px' }}
            >
              <p className="text-main text-sm font-medium mb-4">By Status</p>
              {statusBarData ? (
                <div style={{ height: '220px' }}>
                  <Bar data={statusBarData} options={barOptions} />
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No status data</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <NoResultsFound />
      )}
    </div>
  );
};
