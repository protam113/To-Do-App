'use client';

import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui';

const ReportSeveritySelect = ({
  handleSeverityChange,
}: {
  handleSeverityChange: (value: string) => void;
}) => {
  return (
    <Select onValueChange={handleSeverityChange}>
      <SelectTrigger className="w-[120px] rounded-md px-4 bg-white ">
        <SelectValue placeholder="all" />
      </SelectTrigger>
      <SelectContent
        className="rounded-md bg-white min-w-[120px]"
        align="start"
      >
        <SelectItem value="all" className="rounded-md">
          All
        </SelectItem>
        <SelectItem value="low" className="rounded-md">
          Low
        </SelectItem>
        <SelectItem value="medium" className="rounded-md">
          Medium
        </SelectItem>
        <SelectItem value="high" className="rounded-md">
          High
        </SelectItem>
        <SelectItem value="critical" className="rounded-md">
          Critical
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ReportSeveritySelect;
