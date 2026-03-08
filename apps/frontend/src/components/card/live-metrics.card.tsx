'use client';

import React, { useEffect, useState } from 'react';
import {
  Activity,
  Cpu,
  HardDrive,
  Database,
  Network,
  LucideIcon,
} from 'lucide-react';
import { useDetailedHealth } from '@/hooks/health/useHealth';

// Circular Progress Component
const CircularProgress = ({
  percentage,
  color,
  icon: Icon,
  label,
  value,
}: {
  percentage: number;
  color: string;
  icon: LucideIcon;
  label: string;
  value?: string;
}) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorClasses: Record<
    string,
    { stroke: string; bg: string; icon: string }
  > = {
    blue: {
      stroke: 'stroke-blue-500',
      bg: 'bg-blue-50',
      icon: 'text-blue-500',
    },
    red: { stroke: 'stroke-red-500', bg: 'bg-red-50', icon: 'text-red-500' },
    green: {
      stroke: 'stroke-green-500',
      bg: 'bg-green-50',
      icon: 'text-green-500',
    },
    yellow: {
      stroke: 'stroke-yellow-500',
      bg: 'bg-yellow-50',
      icon: 'text-yellow-500',
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-24 w-24">
        <svg className="h-24 w-24 -rotate-90 transform">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            className={colors.stroke}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
              transition: 'stroke-dashoffset 0.5s ease',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-full ${colors.bg}`}
          >
            <Icon className={`h-6 w-6 ${colors.icon}`} />
          </div>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-gray-700">{label}</p>
      <p className="text-sm text-gray-500">{value || `${percentage}%`}</p>
    </div>
  );
};

interface LiveMetricsCardProps {
  title?: string;
  refreshInterval?: number;
  autoRefresh?: boolean;
}

export function LiveMetricsCard({
  title = 'Live System Metrics',
  refreshInterval = 5000,
  autoRefresh = true,
}: LiveMetricsCardProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const { data, isLoading } = useDetailedHealth(refreshKey);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  if (isLoading && !data) {
    return (
      <div className="rounded-md bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <Activity className="h-5 w-5 text-purple-500" />
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-purple-500" />
        </div>
      </div>
    );
  }

  if (!data?.gateway?.memory) {
    return null;
  }

  const { gateway } = data;
  const memory = gateway.memory;
  const cpu = gateway.cpu;

  // Heap usage percentage (heapUsed / heapTotal)
  const heapPercentage = Math.min(
    100,
    Math.round((memory.heapUsed / memory.heapTotal) * 100)
  );

  // RSS (Resident Set Size) - total memory allocated
  const rssPercentage = Math.min(
    100,
    Math.round((memory.rss / (memory.heapTotal * 2)) * 100)
  );

  // CPU user time percentage
  const cpuUserPercentage = Math.min(100, Math.round(cpu.user));

  // CPU system time percentage
  const cpuSystemPercentage = Math.min(100, Math.round(cpu.system));

  // Format memory values
  const formatMemory = (bytes: number) => {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="rounded-md bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <Activity className="h-5 w-5 text-purple-500" />
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="ml-auto text-xs text-gray-500">
          Node {gateway.nodeVersion} • {gateway.platform}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        <CircularProgress
          percentage={heapPercentage}
          color="blue"
          icon={Cpu}
          label="Heap Used"
          value={formatMemory(memory.heapUsed)}
        />
        <CircularProgress
          percentage={rssPercentage}
          color="red"
          icon={HardDrive}
          label="RSS Memory"
          value={formatMemory(memory.rss)}
        />
        <CircularProgress
          percentage={cpuUserPercentage}
          color="green"
          icon={Database}
          label="CPU User"
          value={`${cpu.user.toFixed(1)}%`}
        />
        <CircularProgress
          percentage={cpuSystemPercentage}
          color="yellow"
          icon={Network}
          label="CPU System"
          value={`${cpu.system.toFixed(1)}%`}
        />
      </div>
    </div>
  );
}
