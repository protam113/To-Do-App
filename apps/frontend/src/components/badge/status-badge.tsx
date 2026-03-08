import { Badge } from '@/components/ui';
import {
  Clock,
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  AlertCircle,
  Info,
  Zap,
} from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

interface SeverityBadgeProps {
  severity: string;
  className?: string;
}

const statusConfig = {
  open: {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Clock,
    label: 'Open',
  },
  in_progress: {
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Play,
    label: 'In Progress',
  },
  resolved: {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
    label: 'Resolved',
  },
  canceled: {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: XCircle,
    label: 'Canceled',
  },
};

const severityConfig = {
  low: {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: Info,
    label: 'Low',
  },
  medium: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: AlertTriangle,
    label: 'Medium',
  },
  high: {
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: AlertCircle,
    label: 'High',
  },
  critical: {
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: Zap,
    label: 'Critical',
  },
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig];

  if (!config) {
    return <Badge className={`h-8 ${className}`}>{status}</Badge>;
  }

  const Icon = config.icon;

  return (
    <Badge
      className={`h-8 border ${config.color} ${className} flex items-center gap-1.5 font-medium`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </Badge>
  );
}

export function SeverityBadge({
  severity,
  className = '',
}: SeverityBadgeProps) {
  const config = severityConfig[severity as keyof typeof severityConfig];

  if (!config) {
    return <Badge className={`h-8 ${className}`}>{severity}</Badge>;
  }

  const Icon = config.icon;

  return (
    <Badge
      className={`h-8 border ${config.color} ${className} flex items-center gap-1.5 font-medium`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </Badge>
  );
}
