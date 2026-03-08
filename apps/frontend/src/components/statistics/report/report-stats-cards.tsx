'use client';

import React, { useMemo } from 'react';
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Activity,
  XCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui';
import { LoadingSpin } from '../../loading/spin';
import { useReportDailyStatis } from '@/hooks/statistics/useStatisticReport';

interface ReportStatsCardsProps {
  startDate: string;
  endDate: string;
  refreshKey: number;
}

export const ReportStatsCards = ({
  startDate,
  endDate,
  refreshKey,
}: ReportStatsCardsProps) => {
  const filters = {
    start_date: startDate,
    end_date: endDate,
  };

  const { data: statisticsData, isLoading } = useReportDailyStatis(
    filters,
    refreshKey
  );

  const statistics = useMemo(() => {
    if (
      !statisticsData ||
      !Array.isArray(statisticsData) ||
      statisticsData.length === 0
    ) {
      return {
        count: 0,
        byStatus: { open: 0, in_progress: 0, resolved: 0, canceled: 0 },
      };
    }
    if (statisticsData.length === 1) {
      return statisticsData[0];
    }
    return statisticsData.reduce(
      (acc, item) => ({
        count: (acc.count || 0) + item.count,
        byStatus: {
          open: (acc.byStatus?.open || 0) + (item.byStatus?.open || 0),
          in_progress:
            (acc.byStatus?.in_progress || 0) +
            (item.byStatus?.in_progress || 0),
          resolved:
            (acc.byStatus?.resolved || 0) + (item.byStatus?.resolved || 0),
          canceled:
            (acc.byStatus?.canceled || 0) + (item.byStatus?.canceled || 0),
        },
      }),
      {} as any
    );
  }, [statisticsData]);

  const count = statistics?.count ?? 0;
  const open = statistics?.byStatus?.open ?? 0;
  const inProgress = statistics?.byStatus?.in_progress ?? 0;
  const resolved = statistics?.byStatus?.resolved ?? 0;
  const canceled = statistics?.byStatus?.canceled ?? 0;
  const resolutionRate =
    count > 0 ? ((resolved / count) * 100).toFixed(1) : '0';

  const cards = [
    {
      title: 'Total Reports',
      value: count,
      description: 'All reports in period',
      icon: FileText,
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Open',
      value: open,
      description: 'Awaiting review',
      icon: Clock,
      gradient: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-200',
    },
    {
      title: 'In Progress',
      value: inProgress,
      description: 'Being processed',
      icon: Activity,
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
    },
    {
      title: 'Resolved',
      value: resolved,
      description: `${resolutionRate}% resolution rate`,
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
    },
    {
      title: 'Canceled',
      value: canceled,
      description: 'Canceled reports',
      icon: XCircle,
      gradient: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-50',
      iconColor: 'text-gray-600',
      borderColor: 'border-gray-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
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
                  <div className="flex items-baseline gap-1.5">
                    {isLoading ? (
                      <LoadingSpin />
                    ) : (
                      <>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {card.value}
                        </h3>
                        {card.title === 'Resolved' && count > 0 && (
                          <span className="flex items-center text-xs font-medium text-green-600">
                            <TrendingUp className="h-3 w-3 mr-0.5" />
                            {resolutionRate}%
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Icon with background */}
                <div
                  className={`${card.bgColor} p-2 rounded-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
              </div>

              <p className="text-xs text-gray-500">{card.description}</p>

              {/* Progress bar for visual interest */}
              {count > 0 && (
                <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${card.gradient} transition-all duration-500`}
                    style={{
                      width: `${Math.min((card.value / count) * 100, 100)}%`,
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
