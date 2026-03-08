'use client';

import { Container } from '@/components';
import { RefreshButton } from '@/components/button/refresh.button';
import { Heading } from '@/components/design';
import { ErrorLoading } from '@/components/loading/error';
import {
  useDetailedHealth,
  type ServiceHealth,
} from '@/hooks/health/useHealth';
import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Server,
  Database,
  Cpu,
  HardDrive,
  Clock,
  Activity,
} from 'lucide-react';

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'healthy') {
    return <CheckCircle className="w-6 h-6 text-green-500" />;
  }
  if (status === 'unhealthy') {
    return <XCircle className="w-6 h-6 text-red-500" />;
  }
  return <AlertCircle className="w-6 h-6 text-yellow-500" />;
};

const StatusBadge = ({ status }: { status: string }) => {
  const colors = {
    healthy: 'bg-green-100 text-green-800 border-green-200',
    unhealthy: 'bg-red-100 text-red-800 border-red-200',
    degraded: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    unknown: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  return (
    <span
      className={`px-3 py-1 text-sm font-medium border ${
        colors[status as keyof typeof colors] || colors.unknown
      }`}
    >
      {status.toUpperCase()}
    </span>
  );
};

const ServiceCard = ({ service }: { service: ServiceHealth }) => {
  const borderColor = {
    healthy: 'border-l-green-500',
    unhealthy: 'border-l-red-500',
    unknown: 'border-l-gray-400',
  };

  return (
    <div
      className={`bg-white p-5 border-l-4 shadow-sm ${
        borderColor[service.status]
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Server className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-lg">{service.name}</h3>
        </div>
        <StatusIcon status={service.status} />
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Status</span>
          <StatusBadge status={service.status} />
        </div>

        {service.responseTime !== undefined && (
          <div className="flex justify-between">
            <span className="text-gray-500">Response Time</span>
            <span className="font-medium">{service.responseTime}ms</span>
          </div>
        )}

        {service.error && (
          <div className="mt-2 p-2 bg-red-50 text-red-700 text-xs">
            {service.error}
          </div>
        )}

        {service.components && (
          <div className="mt-3 pt-3 border-t space-y-1">
            <span className="text-xs text-gray-400 uppercase">Components</span>
            {Object.entries(service.components).map(([name, comp]) => (
              <div key={name} className="flex justify-between items-center">
                <span className="text-gray-600 capitalize">{name}</span>
                <span
                  className={`text-xs px-2 py-0.5 ${
                    comp.status === 'healthy'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {comp.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const formatUptime = (seconds: number) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (days > 0) return `${days}d ${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h ${mins}m ${secs}s`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
};

const Page = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { data, isLoading, isError } = useDetailedHealth(refreshKey);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 50000);

    return () => clearInterval(interval);
  }, []);

  if (isError) {
    return (
      <Container>
        <ErrorLoading />
      </Container>
    );
  }

  return (
    <Container>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Heading name="System Monitor" />
          <RefreshButton onClick={handleRefresh} />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
          </div>
        ) : data ? (
          <>
            {/* Overall Status */}
            <div
              className={`p-6 ${
                data.status === 'healthy'
                  ? 'bg-green-50 border-green-200'
                  : data.status === 'degraded'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-red-50 border-red-200'
              } border`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Activity
                    className={`w-8 h-8 ${
                      data.status === 'healthy'
                        ? 'text-green-600'
                        : data.status === 'degraded'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  />
                  <div>
                    <h2 className="text-xl font-bold">System Status</h2>
                    <p className="text-sm text-gray-600">
                      Last updated: {new Date(data.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <StatusBadge status={data.status} />
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 shadow-sm border-l-4 border-l-blue-500">
                <div className="flex items-center gap-3 mb-2">
                  <Server className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-500 text-sm">Total Services</span>
                </div>
                <p className="text-3xl font-bold">{data.summary.total}</p>
              </div>

              <div className="bg-white p-5 shadow-sm border-l-4 border-l-green-500">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-500 text-sm">Healthy</span>
                </div>
                <p className="text-3xl font-bold text-green-600">
                  {data.summary.healthy}
                </p>
              </div>

              <div className="bg-white p-5 shadow-sm border-l-4 border-l-red-500">
                <div className="flex items-center gap-3 mb-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="text-gray-500 text-sm">Unhealthy</span>
                </div>
                <p className="text-3xl font-bold text-red-600">
                  {data.summary.unhealthy}
                </p>
              </div>

              <div className="bg-white p-5 shadow-sm border-l-4 border-l-purple-500">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-500 text-sm">Gateway Uptime</span>
                </div>
                <p className="text-2xl font-bold">
                  {formatUptime(data.uptime)}
                </p>
              </div>
            </div>

            {/* Services Grid */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.services.map((service) => (
                  <ServiceCard key={service.name} service={service} />
                ))}
              </div>
            </div>

            {/* Gateway Details */}
            {data.gateway && (
              <div className="bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Cpu className="w-5 h-5" />
                  API Gateway
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <HardDrive className="w-4 h-4" />
                      Memory (Heap)
                    </div>
                    <p className="text-xl font-semibold">
                      {data.gateway.memory.heapUsed} /{' '}
                      {data.gateway.memory.heapTotal} {data.gateway.memory.unit}
                    </p>
                    <div className="w-full bg-gray-200 h-2 mt-2">
                      <div
                        className="bg-blue-500 h-2"
                        style={{
                          width: `${
                            (data.gateway.memory.heapUsed /
                              data.gateway.memory.heapTotal) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Database className="w-4 h-4" />
                      RSS Memory
                    </div>
                    <p className="text-xl font-semibold">
                      {data.gateway.memory.rss} {data.gateway.memory.unit}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Cpu className="w-4 h-4" />
                      CPU Usage
                    </div>
                    <p className="text-xl font-semibold">
                      {data.gateway.cpu.user + data.gateway.cpu.system}{' '}
                      {data.gateway.cpu.unit}
                    </p>
                    <p className="text-xs text-gray-400">
                      User: {data.gateway.cpu.user} | System:{' '}
                      {data.gateway.cpu.system}
                    </p>
                  </div>

                  <div>
                    <div className="text-gray-500 text-sm mb-1">
                      Environment
                    </div>
                    <p className="font-medium">{data.gateway.nodeVersion}</p>
                    <p className="text-xs text-gray-400">
                      {data.gateway.platform} | PID: {data.gateway.pid}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </Container>
  );
};

export default Page;
