'use client';

import React, { useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useReportTrendStatis } from '../../../hooks/statistics/useStatisticReport';
import { LoadingSpin } from '../../loading/spin';
import NoResultsFound from '../../design/no_result.design';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type GroupBy = 'day' | 'week' | 'month';

export const StatisReportTrend = () => {
  const defaultDates = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  }, []);

  const [startDate, setStartDate] = useState(defaultDates.startDate);
  const [endDate, setEndDate] = useState(defaultDates.endDate);
  const [groupBy, setGroupBy] = useState<GroupBy>('day');

  const filters = useMemo(
    () => ({
      start_date: startDate,
      end_date: endDate,
      group_by: groupBy,
    }),
    [startDate, endDate, groupBy]
  );

  const {
    data: trendData,
    isLoading,
    isError,
  } = useReportTrendStatis(filters, 0);

  // Severity Line Chart
  const severityLineData = useMemo(() => {
    if (!trendData || trendData.length === 0) return null;

    const labels = trendData.map((item) => item.period);
    const hasLow = trendData.some((item) => item.bySeverity?.low > 0);
    const hasMedium = trendData.some((item) => item.bySeverity?.medium > 0);
    const hasHigh = trendData.some((item) => item.bySeverity?.high > 0);
    const hasCritical = trendData.some((item) => item.bySeverity?.critical > 0);

    const datasets = [];
    if (hasLow) {
      datasets.push({
        label: 'Low',
        data: trendData.map((item) => item.bySeverity?.low ?? 0),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: false,
      });
    }
    if (hasMedium) {
      datasets.push({
        label: 'Medium',
        data: trendData.map((item) => item.bySeverity?.medium ?? 0),
        borderColor: '#eab308',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        tension: 0.4,
        fill: false,
      });
    }
    if (hasHigh) {
      datasets.push({
        label: 'High',
        data: trendData.map((item) => item.bySeverity?.high ?? 0),
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        tension: 0.4,
        fill: false,
      });
    }
    if (hasCritical) {
      datasets.push({
        label: 'Critical',
        data: trendData.map((item) => item.bySeverity?.critical ?? 0),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: false,
      });
    }

    if (datasets.length === 0) return null;
    return { labels, datasets };
  }, [trendData]);

  // Status Line Chart
  const statusLineData = useMemo(() => {
    if (!trendData || trendData.length === 0) return null;

    const labels = trendData.map((item) => item.period);
    const hasOpen = trendData.some((item) => item.byStatus?.open > 0);
    const hasInProgress = trendData.some(
      (item) => item.byStatus?.in_progress > 0
    );
    const hasResolved = trendData.some((item) => item.byStatus?.resolved > 0);
    const hasCanceled = trendData.some((item) => item.byStatus?.canceled > 0);

    const datasets = [];
    if (hasOpen) {
      datasets.push({
        label: 'Open',
        data: trendData.map((item) => item.byStatus?.open ?? 0),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: false,
      });
    }
    if (hasInProgress) {
      datasets.push({
        label: 'In Progress',
        data: trendData.map((item) => item.byStatus?.in_progress ?? 0),
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: false,
      });
    }
    if (hasResolved) {
      datasets.push({
        label: 'Resolved',
        data: trendData.map((item) => item.byStatus?.resolved ?? 0),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: false,
      });
    }
    if (hasCanceled) {
      datasets.push({
        label: 'Canceled',
        data: trendData.map((item) => item.byStatus?.canceled ?? 0),
        borderColor: '#6b7280',
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
        tension: 0.4,
        fill: false,
      });
    }

    if (datasets.length === 0) return null;
    return { labels, datasets };
  }, [trendData]);

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
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
    <div className="space-y-4 p-2">
      {/* Filters */}
      <div className="bg-white p-2 flex flex-wrap gap-2 items-end">
        <div className="flex flex-col">
          <label className="text-main text-sm mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-gray-700 text-sm"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-main text-sm mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-gray-700 text-sm"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-main text-sm mb-1">Group By</label>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as GroupBy)}
            className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-gray-700 text-sm"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpin />
      ) : trendData && trendData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Severity Trend */}
          <div className="bg-white p-4" style={{ height: '320px' }}>
            <p className="text-main text-sm font-medium mb-4">Severity Trend</p>
            {severityLineData ? (
              <div style={{ height: '260px' }}>
                <Line data={severityLineData} options={lineOptions} />
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No severity data</p>
            )}
          </div>

          {/* Status Trend */}
          <div className="bg-white p-4" style={{ height: '320px' }}>
            <p className="text-main text-sm font-medium mb-4">Status Trend</p>
            {statusLineData ? (
              <div style={{ height: '260px' }}>
                <Line data={statusLineData} options={lineOptions} />
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No status data</p>
            )}
          </div>
        </div>
      ) : (
        <NoResultsFound />
      )}
    </div>
  );
};
