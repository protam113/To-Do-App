'use client';

import React, { useState, useMemo } from 'react';
import {
  format,
  subDays,
  subHours,
  subMinutes,
  startOfDay,
  endOfDay,
} from 'date-fns';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Input,
  Card,
  CardContent,
} from '@/components/ui';
import { CalendarIcon, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export interface TimeRange {
  from: Date;
  to: Date;
  label: string;
}

interface TimeRangePickerProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

const QUICK_RANGES = [
  {
    label: 'Last 5 minutes',
    getValue: () => ({
      from: subMinutes(new Date(), 5),
      to: new Date(),
    }),
  },
  {
    label: 'Last 15 minutes',
    getValue: () => ({
      from: subMinutes(new Date(), 15),
      to: new Date(),
    }),
  },
  {
    label: 'Last 30 minutes',
    getValue: () => ({
      from: subMinutes(new Date(), 30),
      to: new Date(),
    }),
  },
  {
    label: 'Last 1 hour',
    getValue: () => ({
      from: subHours(new Date(), 1),
      to: new Date(),
    }),
  },
  {
    label: 'Last 3 hours',
    getValue: () => ({
      from: subHours(new Date(), 3),
      to: new Date(),
    }),
  },
  {
    label: 'Last 6 hours',
    getValue: () => ({
      from: subHours(new Date(), 6),
      to: new Date(),
    }),
  },
  {
    label: 'Last 12 hours',
    getValue: () => ({
      from: subHours(new Date(), 12),
      to: new Date(),
    }),
  },
  {
    label: 'Last 24 hours',
    getValue: () => ({
      from: subHours(new Date(), 24),
      to: new Date(),
    }),
  },
  {
    label: 'Last 2 days',
    getValue: () => ({
      from: subDays(new Date(), 2),
      to: new Date(),
    }),
  },
  {
    label: 'Last 7 days',
    getValue: () => ({
      from: subDays(new Date(), 7),
      to: new Date(),
    }),
  },
  {
    label: 'Last 30 days',
    getValue: () => ({
      from: subDays(new Date(), 30),
      to: new Date(),
    }),
  },
  {
    label: 'Last 90 days',
    getValue: () => ({
      from: subDays(new Date(), 90),
      to: new Date(),
    }),
  },
];

export const TimeRangePicker: React.FC<TimeRangePickerProps> = ({
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customFrom, setCustomFrom] = useState(
    format(value.from, "yyyy-MM-dd'T'HH:mm")
  );
  const [customTo, setCustomTo] = useState(
    format(value.to, "yyyy-MM-dd'T'HH:mm")
  );

  const displayText = useMemo(() => {
    if (value.label) {
      return value.label;
    }
    return `${format(value.from, 'dd/MM/yyyy HH:mm')} - ${format(
      value.to,
      'dd/MM/yyyy HH:mm'
    )}`;
  }, [value]);

  const handleQuickRangeSelect = (range: any) => {
    const { from, to } = range.getValue();
    onChange({
      from,
      to,
      label: range.label,
    });
    setIsOpen(false);
  };

  const handleCustomApply = () => {
    const from = new Date(customFrom);
    const to = new Date(customTo);

    if (from && to && from <= to) {
      onChange({
        from,
        to,
        label: '',
      });
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-gray-200 hover:bg-gray-50 min-w-[200px] justify-between px-3 py-2 h-9"
        >
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="truncate text-sm">{displayText}</span>
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0" align="end" side="bottom">
        <div className="flex">
          {/* Quick Ranges */}
          <div className="w-40 border-r border-gray-200 bg-gray-50">
            <div className="p-3 border-b border-gray-200">
              <h4 className="font-medium text-sm text-gray-900">
                Quick ranges
              </h4>
            </div>
            <div className="p-2 max-h-80 overflow-y-auto">
              {QUICK_RANGES.map((range) => (
                <button
                  key={range.label}
                  onClick={() => handleQuickRangeSelect(range)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 rounded transition-colors"
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Range */}
          <div className="flex-1 p-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-3">
                  Absolute time range
                </h4>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    From
                  </label>
                  <Input
                    type="datetime-local"
                    value={customFrom}
                    onChange={(e) => setCustomFrom(e.target.value)}
                    className="w-full text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    To
                  </label>
                  <Input
                    type="datetime-local"
                    value={customTo}
                    onChange={(e) => setCustomTo(e.target.value)}
                    className="w-full text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleCustomApply}
                  className="text-white bg-blue-600 hover:bg-blue-700"
                >
                  Apply time range
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
