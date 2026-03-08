'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import {
  FileText,
  Activity,
  Clock,
  CheckCircle,
  Users,
  RefreshCw,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import {
  useReportSumaryStatis,
  useReportTrendStatis,
} from '@/hooks/statistics/useStatisticReport';
import { useUserOverviewStatis } from '@/hooks/statistics/useStatisticUser';
import { Loader } from '@/components/loading/loader';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Page() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [timeRange, setTimeRange] = useState('weekly');

  // Get summary data
  const { data: reportSummary, isLoading: summaryLoading } =
    useReportSumaryStatis({}, refreshKey);
  const { data: userStats, isLoading: userLoading } =
    useUserOverviewStatis(refreshKey);

  // Get trend data based on time range
  const { data: trendData, isLoading: trendLoading } = useReportTrendStatis(
    { period: timeRange },
    refreshKey
  );

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const isLoading = summaryLoading || userLoading || trendLoading;

  // Process trend data for chart
  const getChartData = () => {
    if (!trendData || trendData.length === 0) {
      return {
        periods: [],
        criticalData: [],
        highData: [],
        mediumData: [],
        lowData: [],
      };
    }

    const periods = trendData.map((item) => {
      const date = new Date(item.period);
      if (timeRange === 'daily') {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
      } else if (timeRange === 'weekly') {
        return `Week ${Math.ceil(date.getDate() / 7)}`;
      } else if (timeRange === 'monthly') {
        return date.toLocaleDateString('en-US', { month: 'short' });
      } else {
        return date.getFullYear().toString();
      }
    });

    const criticalData = trendData.map((item) => item.bySeverity.critical);
    const highData = trendData.map((item) => item.bySeverity.high);
    const mediumData = trendData.map((item) => item.bySeverity.medium);
    const lowData = trendData.map((item) => item.bySeverity.low);

    return { periods, criticalData, highData, mediumData, lowData };
  };

  const { periods, criticalData, highData, mediumData, lowData } =
    getChartData();

  // Calculate totals and percentages
  const totalCritical = criticalData.reduce((a: number, b: number) => a + b, 0);
  const totalHigh = highData.reduce((a: number, b: number) => a + b, 0);
  const totalMedium = mediumData.reduce((a: number, b: number) => a + b, 0);
  const totalLow = lowData.reduce((a: number, b: number) => a + b, 0);
  const grandTotal = totalCritical + totalHigh + totalMedium + totalLow;

  const criticalPercentage =
    grandTotal > 0 ? ((totalCritical / grandTotal) * 100).toFixed(0) : 0;
  const highPercentage =
    grandTotal > 0 ? ((totalHigh / grandTotal) * 100).toFixed(0) : 0;
  const mediumPercentage =
    grandTotal > 0 ? ((totalMedium / grandTotal) * 100).toFixed(0) : 0;
  const lowPercentage =
    grandTotal > 0 ? ((totalLow / grandTotal) * 100).toFixed(0) : 0;

  if (isLoading) {
    return <Loader fullScreen />;
  }

  return (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Total Reports
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {reportSummary?.total || 0}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <span>All time</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Resolved
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {reportSummary?.byStatus?.resolved || 0}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <span>
                        {reportSummary?.total
                          ? (
                              (reportSummary.byStatus.resolved /
                                reportSummary.total) *
                              100
                            ).toFixed(1)
                          : 0}
                        % resolution rate
                      </span>
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Open
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {reportSummary?.byStatus?.open || 0}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <span>Awaiting action</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      In Progress
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {reportSummary?.byStatus?.in_progress || 0}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <span>Being worked on</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Canceled
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {reportSummary?.byStatus?.canceled || 0}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <span>
                        {reportSummary?.total
                          ? (
                              (reportSummary.byStatus.canceled /
                                reportSummary.total) *
                              100
                            ).toFixed(1)
                          : 0}
                        % canceled rate
                      </span>
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts Section - Chart.js */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Severity Statistics Chart */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                    Report statistics
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    Statistics on reports over time
                  </p>
                </div>
                <div className="relative">
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-28 h-9 text-sm border-gray-200">
                      <SelectValue placeholder="Weekly" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Statistics Summary */}
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Critical (+{criticalPercentage}%)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    High (+{highPercentage}%)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Medium (+{mediumPercentage}%)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Low (+{lowPercentage}%)
                  </span>
                </div>
              </div>

              {/* Totals */}
              <div className="flex items-center gap-8 mt-3">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalCritical.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalHigh.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalMedium.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalLow.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-64">
                <Bar
                  data={{
                    labels: periods,
                    datasets: [
                      {
                        label: 'Critical',
                        data: criticalData,
                        backgroundColor: '#ef4444',
                        borderColor: '#ef4444',
                        borderWidth: 0,
                        borderRadius: 4,
                        borderSkipped: false,
                      },
                      {
                        label: 'High',
                        data: highData,
                        backgroundColor: '#f97316',
                        borderColor: '#f97316',
                        borderWidth: 0,
                        borderRadius: 4,
                        borderSkipped: false,
                      },
                      {
                        label: 'Medium',
                        data: mediumData,
                        backgroundColor: '#eab308',
                        borderColor: '#eab308',
                        borderWidth: 0,
                        borderRadius: 4,
                        borderSkipped: false,
                      },
                      {
                        label: 'Low',
                        data: lowData,
                        backgroundColor: '#22c55e',
                        borderColor: '#22c55e',
                        borderWidth: 0,
                        borderRadius: 4,
                        borderSkipped: false,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                          size: 14,
                        },
                        bodyFont: {
                          size: 13,
                        },
                        cornerRadius: 8,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0,
                          color: '#9ca3af',
                          font: {
                            size: 12,
                          },
                        },
                        grid: {
                          color: 'rgba(156, 163, 175, 0.1)',
                        },
                        border: {
                          display: false,
                        },
                      },
                      x: {
                        ticks: {
                          color: '#9ca3af',
                          font: {
                            size: 12,
                          },
                        },
                        grid: {
                          display: false,
                        },
                        border: {
                          display: false,
                        },
                      },
                    },
                    layout: {
                      padding: {
                        top: 10,
                      },
                    },
                    elements: {
                      bar: {
                        borderRadius: 4,
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution Chart */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                    Reports by Status
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    Current status distribution
                  </p>
                </div>
              </div>

              {/* Status Legend - Simple horizontal layout */}
              <div className="flex items-center flex-wrap gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Open</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Resolved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Canceled</span>
                </div>
              </div>

              {/* Status Summary - Clean number display */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <span>
                    Total Reports:{' '}
                    {(reportSummary?.byStatus?.open || 0) +
                      (reportSummary?.byStatus?.in_progress || 0) +
                      (reportSummary?.byStatus?.resolved || 0) +
                      (reportSummary?.byStatus?.canceled || 0)}
                  </span>
                  <span>
                    Resolution Rate:{' '}
                    {reportSummary?.total
                      ? (
                          (reportSummary.byStatus.resolved /
                            reportSummary.total) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-64">
                <Bar
                  data={{
                    labels: ['Open', 'In Progress', 'Resolved', 'Canceled'],
                    datasets: [
                      {
                        label: 'Reports',
                        data: [
                          reportSummary?.byStatus?.open || 0,
                          reportSummary?.byStatus?.in_progress || 0,
                          reportSummary?.byStatus?.resolved || 0,
                          reportSummary?.byStatus?.canceled || 0,
                        ],
                        backgroundColor: [
                          '#3b82f6', // Blue for Open
                          '#8b5cf6', // Purple for In Progress
                          '#22c55e', // Green for Resolved
                          '#6b7280', // Gray for Canceled
                        ],
                        borderColor: [
                          '#3b82f6',
                          '#8b5cf6',
                          '#22c55e',
                          '#6b7280',
                        ],
                        borderWidth: 0,
                        borderRadius: 6,
                        borderSkipped: false,
                      },
                    ],
                  }}
                  options={{
                    indexAxis: 'y' as const, // This makes it horizontal
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                          size: 14,
                        },
                        bodyFont: {
                          size: 13,
                        },
                        cornerRadius: 8,
                        callbacks: {
                          label: function (context) {
                            const dataset = context.dataset.data as number[];
                            const total = dataset.reduce((a, b) => a + b, 0);
                            const value = context.parsed.x as number;
                            const percentage =
                              total > 0
                                ? ((value / total) * 100).toFixed(1)
                                : '0';
                            return `${context.label}: ${value} (${percentage}%)`;
                          },
                        },
                      },
                    },
                    scales: {
                      x: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0,
                          color: '#9ca3af',
                          font: {
                            size: 12,
                          },
                        },
                        grid: {
                          color: 'rgba(156, 163, 175, 0.1)',
                        },
                        border: {
                          display: false,
                        },
                      },
                      y: {
                        ticks: {
                          color: '#374151',
                          font: {
                            size: 13,
                            weight: 500,
                          },
                        },
                        grid: {
                          display: false,
                        },
                        border: {
                          display: false,
                        },
                      },
                    },
                    layout: {
                      padding: {
                        top: 10,
                        bottom: 10,
                      },
                    },
                    elements: {
                      bar: {
                        borderRadius: 6,
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Statistics Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            User Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Total Users
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {userStats?.totalUsers || 0}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <span>{userStats?.activePercentage || '0%'} active</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Active Users
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {userStats?.activeUsers || 0}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <span>Currently active</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      New Users
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {userStats?.newUsersLast7Days || 0}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <span>Last 7 days</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Verified
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {userStats?.verifiedUsers || 0}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <span>
                        {userStats?.verifiedPercentage || '0%'} verified
                      </span>
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
