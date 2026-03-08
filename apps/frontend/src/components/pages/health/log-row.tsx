import { ChevronRight } from 'lucide-react';

export interface LogEntry {
  id: string;
  timestamp: string;
  duration?: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  method: string;
  service: string;
  statusCode: number;
  traceId: string;
  type: string;
  url: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  _id: string;
  _index: string;
  _score: string | null;
}

interface LogRowProps {
  log: LogEntry;
}

export function LogRow({ log }: LogRowProps) {
  // Extract keys to highlight, ignoring internal/metadata keys that aren't prominent in the screenshot
  const entries = Object.entries(log).filter(
    ([key]) => key !== 'id' && !key.startsWith('_')
  );

  return (
    <div className="grid grid-cols-[32px_32px_220px_1fr] border-b hover:bg-accent/50 transition-colors py-2 items-start text-sm group">
      <div className="flex justify-center pt-0.5">
        <ChevronRight className="h-4 w-4 text-muted-foreground cursor-pointer" />
      </div>
      <div className="flex justify-center pt-0.5">
        {/* <Checkbox className="h-4 w-4" /> */}
      </div>
      <div className="font-mono text-xs tabular-nums text-muted-foreground pl-2 pt-0.5">
        {log.timestamp}
      </div>
      <div className="font-mono text-xs leading-relaxed px-4 break-words">
        {Object.entries(log).map(([key, value], index) => {
          if (key === 'id' || key === 'timestamp') return null;

          return (
            <span key={key} className="inline-block mr-2 mb-1">
              <span className="font-bold text-foreground">{key}</span>{' '}
              <span className="text-muted-foreground">
                {value === null ? 'null' : String(value)}
              </span>
              {/* Add a separator if it's not the last visible item */}
              {index < Object.keys(log).length - 1 && ' '}
            </span>
          );
        })}
      </div>
    </div>
  );
}
