'use client';

import { UserRoleActivity } from '@/libs';
import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Heading } from '../../design/heading.design';
import { ErrorLoading, LoadingSpin } from '@/components/loading';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const StatisUserActivity = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const { statistics, isLoading, isError } = UserRoleActivity(refreshKey);

  // Prepare activity timeline chart data
  const activityTimelineData = useMemo(() => {
    if (!statistics) return null;

    return {
      labels: [
        'Last 24h',
        'Last 7 days',
        'Last 30 days',
        'Inactive 30d+',
        'Never Logged',
      ],
      datasets: [
        {
          label: 'User Count',
          data: [
            statistics.activeIn24h,
            statistics.activeIn7d,
            statistics.activeIn30d,
            statistics.inactiveOver30d,
            statistics.neverLoggedIn,
          ],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)', // Green - 24h
            'rgba(59, 130, 246, 0.8)', // Blue - 7d
            'rgba(249, 115, 22, 0.8)', // Orange - 30d
            'rgba(239, 68, 68, 0.8)', // Red - inactive
            'rgba(156, 163, 175, 0.8)', // Gray - never
          ],
          borderColor: [
            'rgb(34, 197, 94)',
            'rgb(59, 130, 246)',
            'rgb(249, 115, 22)',
            'rgb(239, 68, 68)',
            'rgb(156, 163, 175)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [statistics]);

  // Prepare activity rate doughnut chart
  const activityRateData = useMemo(() => {
    if (!statistics) return null;

    return {
      labels: ['24h Rate', '7d Rate', '30d Rate'],
      datasets: [
        {
          label: 'Activity Rate %',
          data: [
            parseFloat(statistics.activityRate24h),
            parseFloat(statistics.activityRate7d),
            parseFloat(statistics.activityRate30d),
          ],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(249, 115, 22, 0.8)',
          ],
          borderColor: [
            'rgb(34, 197, 94)',
            'rgb(59, 130, 246)',
            'rgb(249, 115, 22)',
          ],
          borderWidth: 2,
        },
      ],
    };
  }, [statistics]);

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.label}: ${context.parsed.y} users`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          precision: 0,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.label}: ${context.parsed}%`;
          },
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div>
        <LoadingSpin />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <ErrorLoading />
      </div>
    );
  }

  if (!statistics) {
    return <div>No data available</div>;
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Heading name="User Activity Statistics" />

        <button
          onClick={() => setRefreshKey((prev) => prev + 1)}
          className="px-4 py-2 bg-black text-white   hover:bg-gray-800 transition-colors"
        >
          Reload
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600   shadow-lg text-white">
          <div className="text-xs font-medium opacity-90">Total Users</div>
          <div className="text-4xl font-bold mt-2">{statistics.totalUsers}</div>
        </div>

        {/* Active 24h */}
        <div className="p-6 bg-gradient-to-br from-green-500 to-green-600   shadow-lg text-white">
          <div className="text-xs font-medium opacity-90">Active (24h)</div>
          <div className="text-4xl font-bold mt-2">
            {statistics.activeIn24h}
          </div>
          <div className="text-xs mt-2 opacity-90">
            {statistics.activityRate24h}% rate
          </div>
        </div>

        {/* Active 7d */}
        <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600   shadow-lg text-white">
          <div className="text-xs font-medium opacity-90">Active (7 days)</div>
          <div className="text-4xl font-bold mt-2">{statistics.activeIn7d}</div>
          <div className="text-xs mt-2 opacity-90">
            {statistics.activityRate7d}% rate
          </div>
        </div>

        {/* Active 30d */}
        <div className="p-6 bg-gradient-to-br from-orange-500 to-orange-600   shadow-lg text-white">
          <div className="text-xs font-medium opacity-90">Active (30 days)</div>
          <div className="text-4xl font-bold mt-2">
            {statistics.activeIn30d}
          </div>
          <div className="text-xs mt-2 opacity-90">
            {statistics.activityRate30d}% rate
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Timeline Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6   shadow-md">
          <h3 className="font-semibold text-main text-lg mb-4">
            Activity Timeline
          </h3>
          <div style={{ height: '300px' }}>
            {activityTimelineData && (
              <Bar data={activityTimelineData} options={barOptions} />
            )}
          </div>
        </div>

        {/* Activity Rate Doughnut */}
        <div className="bg-white p-6   shadow-md">
          <h3 className="font-semibold text-main text-lg mb-4">
            Activity Rates
          </h3>
          <div style={{ height: '300px' }}>
            {activityRateData && (
              <Doughnut data={activityRateData} options={doughnutOptions} />
            )}
          </div>
        </div>
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 border-l-4 border-red-500 bg-white   shadow-sm">
          <div className="text-xs text-main">Inactive Over 30 Days</div>
          <div className="text-3xl font-bold text-red-600 mt-1">
            {statistics.inactiveOver30d}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {(
              (statistics.inactiveOver30d / statistics.totalUsers) *
              100
            ).toFixed(1)}
            % of total
          </div>
        </div>

        <div className="p-4 border-l-4 border-gray-500 bg-white   shadow-sm">
          <div className="text-xs text-main">Never Logged In</div>
          <div className="text-3xl font-bold text-gray-600 mt-1">
            {statistics.neverLoggedIn}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {((statistics.neverLoggedIn / statistics.totalUsers) * 100).toFixed(
              1
            )}
            % of total
          </div>
        </div>

        <div className="p-4 border-l-4 border-green-500 bg-white   shadow-sm">
          <div className="text-xs text-main ">Engagement Score</div>
          <div className="text-3xl font-bold text-green-600 mt-1">
            {statistics.activityRate24h}%
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Based on 24h activity
          </div>
        </div>
      </div>
    </div>
  );
};
