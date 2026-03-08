import {
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui';
import { MonitorType } from '@/types';
import { ChevronDown } from 'lucide-react';

type MonitorTypeFilter = MonitorType | 'all';

const MonitorTypeConfig: Record<
  MonitorTypeFilter,
  { label: string; color: string }
> = {
  all: { label: 'All', color: 'bg-secondary-500' },
  [MonitorType.Custom]: { label: 'Custom', color: 'bg-gray-500' },
  [MonitorType.Prometheus]: { label: 'Prometheus', color: 'bg-orange-500' },
  [MonitorType.Grafana]: { label: 'Grafana', color: 'bg-green-500' },
};

interface MatricSelectTypeProps {
  currentType: MonitorTypeFilter;
  onTypeChange: (type: MonitorTypeFilter) => void;
}

const MatricSelectType: React.FC<MatricSelectTypeProps> = ({
  currentType,
  onTypeChange,
}) => {
  const currentConfig = MonitorTypeConfig[currentType];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <Badge variant="secondary" className="text-white px-3 py-1">
            {currentConfig.label}
          </Badge>
          <ChevronDown size={16} className="text-gray-500" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {Object.entries(MonitorTypeConfig).map(([type, config]) => (
          <DropdownMenuItem
            key={type}
            onClick={() => onTypeChange(type as MonitorTypeFilter)}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${config.color}`} />
              <span>{config.label}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { MatricSelectType, MonitorTypeConfig };
export type { MonitorTypeFilter };
