'use client';

import { UserGrowStatis } from '@/libs';
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
import { LoadingSpin } from '../../loading/spin';
import NoResultsFound from '../../design/no_result.design';
import { ErrorLoading } from '@/components/loading';

// Register Chart.js components
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

type PeriodType = 'daily' | 'weekly' | 'monthly';

export const StatisConfigUserGrowth = () => {
  // State cho date range và period
  const defaultDates = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  }, []);

  const [startDate, setStartDate] = useState(defaultDates.startDate);
  const [endDate, setEndDate] = useState(defaultDates.endDate);
  const [period, setPeriod] = useState<PeriodType>('daily');
  const [refreshKey, setRefreshKey] = useState(0);

  const params = {
    period,
    startDate,
    endDate,
  };

  const { statistics, isLoading, isError } = UserGrowStatis(refreshKey, params);

  const handleApplyFilters = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!statistics || statistics.length === 0) {
      return null;
    }

    const labels = statistics.map((item) => item.period);
    const newUsersData = statistics.map((item) => item.newUsers);
    const totalUsersData = statistics.map((item) => item.totalUsers);

    return {
      labels,
      datasets: [
        {
          label: 'New Users',
          data: newUsersData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Total Users',
          data: totalUsersData,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [statistics]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 7,
        },
      },
    },
  };

  if (isError) {
    return (
      <div>
        <ErrorLoading />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* Filters Section */}
      <div className="bg-white p-4 rounded-md shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Start Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-800 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 bg-gray-200 border border-gray-600 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-800 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 bg-gray-200 border border-gray-600 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Period Select */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-800 mb-2">
              Period
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as PeriodType)}
              className="px-3 py-2 bg-gray-200 border border-gray-600 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {/* Apply Button */}
          <div className="flex flex-col justify-end">
            <button
              onClick={handleApplyFilters}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isLoading ? 'Loading...' : 'Apply'}
            </button>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <div
          className="bg-white p-6 rounded-md shadow-md"
          style={{ height: '400px' }}
        >
          <h2 className="text-lg font-semibold mb-4 text-white">
            User Growth Statistics
          </h2>

          {chartData ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <NoResultsFound />
          )}
        </div>
      )}
    </div>
  );
};
