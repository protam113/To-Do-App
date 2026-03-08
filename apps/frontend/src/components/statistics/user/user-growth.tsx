'use client';

import { UserGrowStatis } from '@/libs';
import React, { useMemo } from 'react';
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
import { TrendingUp, UserPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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

interface StatisUserGrowthProps {
  refreshKey?: number;
}

export const StatisUserGrowth = ({ refreshKey = 0 }: StatisUserGrowthProps) => {
  // Tính toán startDate và endDate (7 ngày gần nhất)
  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  }, []);

  const params = {
    period: 'daily',
    startDate,
    endDate,
  };

  const { statistics, isLoading, isError } = UserGrowStatis(refreshKey, params);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    if (!statistics || statistics.length === 0) {
      return { totalNew: 0, avgDaily: 0, trend: 0 };
    }

    const totalNew = statistics.reduce((sum, item) => sum + item.newUsers, 0);
    const avgDaily = Math.round(totalNew / statistics.length);

    const mid = Math.floor(statistics.length / 2);
    const firstHalf =
      statistics.slice(0, mid).reduce((sum, item) => sum + item.newUsers, 0) /
      mid;
    const secondHalf =
      statistics.slice(mid).reduce((sum, item) => sum + item.newUsers, 0) /
      (statistics.length - mid);
    const trend = ((secondHalf - firstHalf) / firstHalf) * 100;

    return { totalNew, avgDaily, trend };
  }, [statistics]);

  // Prepare chart data - Area chart with beautiful gradient
  const chartData = useMemo(() => {
    if (!statistics || statistics.length === 0) {
      return null;
    }

    const labels = statistics.map((item) => {
      const date = new Date(item.period);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    });
    const newUsersData = statistics.map((item) => item.newUsers);

    return {
      labels,
      datasets: [
        {
          label: 'New Users',
          data: newUsersData,
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 280);
            gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
            gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.2)');
            gradient.addColorStop(1, 'rgba(99, 102, 241, 0.05)');
            return gradient;
          },
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: 'rgb(99, 102, 241)',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointHoverBackgroundColor: 'rgb(99, 102, 241)',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 4,
          pointShadowOffsetX: 0,
          pointShadowOffsetY: 2,
          pointShadowBlur: 4,
        },
      ],
    };
  }, [statistics]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1f2937',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#374151',
        borderWidth: 1,
        displayColors: false,
        titleFont: { size: 13, weight: 'bold' as const },
        bodyFont: { size: 12 },
        callbacks: {
          label: function (context: any) {
            return `${context.parsed.y} new users`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f3f4f6',
          drawBorder: false,
        },
        ticks: {
          stepSize: 1,
          color: '#6b7280',
          font: { size: 11 },
          padding: 8,
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#374151',
          font: { size: 11 },
          padding: 8,
        },
        border: {
          display: false,
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

  if (isLoading) {
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <LoadingSpin />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardContent className="">
        {/* Header with Stats */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              User Growth
            </h2>
            <p className="text-sm text-gray-600">Last 7 days overview</p>
          </div>

          {/* Summary Stats */}
          <div className="flex gap-4">
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-1">
                <UserPlus className="h-4 w-4" />
                <span>Total New</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {summaryStats.totalNew}
              </p>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span>Avg/Day</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {summaryStats.avgDaily}
              </p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div style={{ height: '280px' }}>
          {chartData ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <NoResultsFound />
          )}
        </div>

        {/* Trend Indicator */}
        {summaryStats.trend !== 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  summaryStats.trend > 0
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                <TrendingUp
                  className={`h-3 w-3 ${
                    summaryStats.trend < 0 ? 'rotate-180' : ''
                  }`}
                />
                <span>{Math.abs(summaryStats.trend).toFixed(1)}%</span>
              </div>
              <span className="text-sm text-gray-600">
                {summaryStats.trend > 0 ? 'increase' : 'decrease'} compared to
                previous period
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
