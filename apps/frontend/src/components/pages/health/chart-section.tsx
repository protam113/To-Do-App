'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useLogStat } from '@/hooks';
import { useState, useMemo } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function ChartSection() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [breakdownBy, setBreakdownBy] = useState<'service' | 'level'>(
    'service'
  );

  const { data, isLoading, isError } = useLogStat({}, refreshKey);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  // Chart data for logs over time (Bar chart)
  const overTimeChartData = useMemo(() => {
    if (!data?.overTime) return null;
    return {
      labels: data.overTime.map((item: any) =>
        new Date(item.key_as_string).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
      ),
      datasets: [
        {
          label: 'Logs',
          data: data.overTime.map((item: any) => item.doc_count),
          backgroundColor: 'oklch(0.696 0.17 162.48)',
          borderRadius: 4,
        },
      ],
    };
  }, [data?.overTime]);

  // Chart data for breakdown (Doughnut)
  const breakdownChartData = useMemo(() => {
    const source = breakdownBy === 'service' ? data?.byService : data?.byLevel;
    if (!source) return null;

    const colors =
      breakdownBy === 'level'
        ? ['#22c55e', '#ef4444', '#eab308', '#3b82f6']
        : ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#22c55e'];

    return {
      labels: source.map((item: any) => item.key),
      datasets: [
        {
          data: source.map((item: any) => item.doc_count),
          backgroundColor: colors.slice(0, source.length),
          borderWidth: 0,
        },
      ],
    };
  }, [data?.byService, data?.byLevel, breakdownBy]);

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 } },
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { font: { size: 10 } },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: { font: { size: 11 } },
      },
    },
    cutout: '60%',
  };

  if (isError) {
    return (
      <div className="border-b bg-background p-4 text-red-500">
        Error loading log statistics
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight">
            {isLoading ? '...' : data?.total ?? 0}
          </span>
          <span className="text-muted-foreground text-sm">total logs</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Break down by</span>
            <Select
              value={breakdownBy}
              onValueChange={(v) => setBreakdownBy(v as 'service' | 'level')}
            >
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="level">Level</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleRefresh}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-[120px] flex items-center justify-center">
          <div className="animate-spin  h-8 w-8 border-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bar Chart - Logs over time */}
          <div className="bg-white p-4 ">
            <p className="text-sm font-medium mb-2">Logs Over Time</p>
            <div className="h-[150px]">
              {overTimeChartData && (
                <Bar data={overTimeChartData} options={barOptions} />
              )}
            </div>
          </div>

          {/* Doughnut Chart - Breakdown */}
          <div className="bg-white p-4 ">
            <p className="text-sm font-medium mb-2">
              By {breakdownBy === 'service' ? 'Service' : 'Level'}
            </p>
            <div className="h-[150px]">
              {breakdownChartData && (
                <Doughnut data={breakdownChartData} options={doughnutOptions} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
