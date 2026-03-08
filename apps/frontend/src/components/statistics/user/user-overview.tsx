'use client';

import { UserOverviewStatis } from '@/libs';
import React, { createContext, useContext, ReactNode } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Heading } from '../../design/heading.design';
import { ErrorLoading, LoadingSpin } from '@/components/loading';
import { Users, Activity, CheckCircle, UserPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// Context để share data giữa các components
const UserOverviewContext = createContext<any>(null);

// Provider component - fetch data 1 lần duy nhất
export const UserOverviewProvider = ({ children }: { children: ReactNode }) => {
  const { statistics, isLoading, isError } = UserOverviewStatis(0);

  if (isLoading) {
    return (
      <div>
        {' '}
        <LoadingSpin />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        {' '}
        <ErrorLoading />
      </div>
    );
  }

  return (
    <UserOverviewContext.Provider value={statistics}>
      {children}
    </UserOverviewContext.Provider>
  );
};

// Hook để lấy data từ context
const useUserOverview = () => {
  const context = useContext(UserOverviewContext);
  if (!context) {
    throw new Error('useUserOverview must be used within UserOverviewProvider');
  }
  return context;
};

// 1. Summary Cards Component
export const UserSummaryCards = () => {
  const statistics = useUserOverview();

  const cards = [
    {
      title: 'Total Users',
      value: statistics?.totalUsers || 0,
      description: 'All registered users',
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      valueColor: 'text-gray-900',
    },
    {
      title: 'Active Rate',
      value: `${statistics?.activePercentage || '0'}%`,
      description: `${statistics?.activeUsers || 0} active users`,
      icon: Activity,
      gradient: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
      valueColor: 'text-green-600',
    },
    {
      title: 'Verified Rate',
      value: `${statistics?.verifiedPercentage || '0'}%`,
      description: `${statistics?.verifiedUsers || 0} verified users`,
      icon: CheckCircle,
      gradient: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      borderColor: 'border-cyan-200',
      valueColor: 'text-cyan-600',
    },
    {
      title: 'New (7 days)',
      value: statistics?.newUsersLast7Days || 0,
      description: 'Recently joined',
      icon: UserPlus,
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      valueColor: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card
            key={index}
            className={`relative overflow-hidden border ${card.borderColor} shadow-sm hover:shadow-md transition-all duration-300 group`}
          >
            {/* Gradient Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
            />

            <CardContent className="p-4 relative">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600 mb-1">
                    {card.title}
                  </p>
                  <h3 className={`text-2xl font-bold ${card.valueColor}`}>
                    {card.value}
                  </h3>
                </div>

                {/* Icon with background */}
                <div
                  className={`${card.bgColor} p-2 rounded-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
              </div>

              <p className="text-xs text-gray-500">{card.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export const UserCountCards = () => {
  const statistics = useUserOverview();

  return (
    <div className="p-2 border-l border-l-gray-400">
      <h3 className="text-main text-lg">Total Users</h3>
      <p className="text-3xl font-bold text-main">{statistics?.totalUsers}</p>
    </div>
  );
};

// 2. User Status Chart
export const UserStatusChart = () => {
  const statistics = useUserOverview();

  const userStatusData = {
    labels: ['Active Users', 'Inactive Users', 'Blocked Users'],
    datasets: [
      {
        data: [
          statistics?.activeUsers || 0,
          statistics?.inactiveUsers || 0,
          statistics?.blockedUsers || 0,
        ],
        backgroundColor: ['#539ce1', '#2a4b7e', '#ed1c24'],
        borderColor: ['#539ce1', '#2a4b7e', '#ed1c24'],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="space-y-4 p-2">
      <div className="bg-white p-6 shadow" style={{ height: '400px' }}>
        <h2 className="text-lg font-semibold mb-4 text-main">User Status</h2>
        <div className="h-64">
          <Doughnut data={userStatusData} options={doughnutOptions} />
        </div>
      </div>
    </div>
  );
};

// 3. User Verification Chart
export const UserVerificationChart = () => {
  const statistics = useUserOverview();

  const verificationData = {
    labels: ['Verified', 'Unverified'],
    datasets: [
      {
        data: [
          statistics?.verifiedUsers || 0,
          statistics?.unverifiedUsers || 0,
        ],
        backgroundColor: ['#3b82f6', '#94a3b8'],
        borderColor: ['#2563eb', '#64748b'],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="bg-white p-6  shadow">
      <h2 className="text-lg font-semibold mb-4 text-main">
        Verification Status
      </h2>
      <div className="h-64">
        <Doughnut data={verificationData} options={doughnutOptions} />
      </div>
    </div>
  );
};

// 4. User Growth Chart
export const UserGrowthChart = () => {
  const statistics = useUserOverview();

  const newUsersData = {
    labels: ['Last 7 Days', 'Last 30 Days'],
    datasets: [
      {
        label: 'New Users',
        data: [
          statistics?.newUsersLast7Days || 0,
          statistics?.newUsersLast30Days || 0,
        ],
        backgroundColor: ['#8b5cf6', '#6366f1'],
        borderColor: ['#7c3aed', '#4f46e5'],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-6 shadow md:col-span-2">
      <h2 className="text-lg font-semibold mb-4 text-main">New Users Growth</h2>
      <div className="h-64">
        <Bar data={newUsersData} options={barOptions} />
      </div>
    </div>
  );
};

// Component chính - sử dụng tất cả components con
export const StatisUserOverview = () => {
  return (
    <div className="p-6 space-y-6">
      <Heading name="User Overviews" />
      <UserOverviewProvider>
        <UserSummaryCards />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UserStatusChart />
          <UserVerificationChart />
          <UserGrowthChart />
        </div>
      </UserOverviewProvider>
    </div>
  );
};
