import {
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui';
import { useUpdateReportStatus } from '@/hooks';
import { ChevronDown } from 'lucide-react';

const ReportStatusValues = [
  'open',
  'in_progress',
  'resolved',
  'canceled',
] as const;

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  open: { label: 'Open', color: '#3b82f6' },
  in_progress: { label: 'In Progress', color: '#a855f7' },
  resolved: { label: 'Resolved', color: '#10b981' },
  canceled: { label: 'Canceled', color: '#6b7280' },
};

const ReportSelectStatus: React.FC<{
  currentStatus: string;
  reportId: string;
  onUpdate?: () => void;
}> = ({ currentStatus, reportId, onUpdate }) => {
  const { mutate: updateStatus } = useUpdateReportStatus(reportId);

  const handleStatusUpdate = (status: string) => {
    updateStatus(
      { status },
      {
        onSuccess: () => {
          onUpdate?.();
        },
      }
    );
  };

  const currentConfig = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.open;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <Badge
            variant="secondary"
            className="text-white px-3 py-1 rounded-md"
            style={{ backgroundColor: currentConfig.color }}
          >
            {currentConfig.label}
          </Badge>
          <ChevronDown size={16} className="text-gray-500" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {ReportStatusValues.map((status) => {
          const config = STATUS_CONFIG[status];
          return (
            <DropdownMenuItem
              key={status}
              onClick={() => handleStatusUpdate(status)}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span>{config.label}</span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ReportSelectStatus };
