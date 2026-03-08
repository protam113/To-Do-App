'use client';

import { Container } from '@/components';
import React, { useState } from 'react';
import { BarChart3, Server, Activity, Shield } from 'lucide-react';
import { MetricsTab } from '@/components/pages/health/metrics-tab';
import { ServerTab } from '@/components/pages/health/server-tab';
import { PermissionsTab } from '@/components/pages/health/permissions-tab';

type TabType = 'metrics' | 'permissions' | 'server';

const HealthPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('metrics');

  const tabs = [
    { id: 'metrics' as TabType, label: 'Metrics', icon: BarChart3 },
    {
      id: 'permissions' as TabType,
      label: 'Permissions',
      icon: Shield,
    },
    { id: 'server' as TabType, label: 'Server', icon: Server },
  ];

  return (
    <Container>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                System Monitor
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Monitor system metrics and server status in real-time
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="flex px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 border-b-2 px-4 py-4 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'metrics' && <MetricsTab />}
              {activeTab === 'permissions' && <PermissionsTab />}
              {activeTab === 'server' && <ServerTab />}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default HealthPage;
