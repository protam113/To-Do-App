'use client';

import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui';

const ReportTypeSelect = ({
  handleTypeChange,
}: {
  handleTypeChange: (value: string) => void;
}) => {
  return (
    <Select onValueChange={handleTypeChange}>
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
        <SelectItem value="daily" className="rounded-md">
          Daily
        </SelectItem>
        <SelectItem value="weekly" className="rounded-md">
          Weekly
        </SelectItem>
        <SelectItem value="incident" className="rounded-md">
          Incident
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ReportTypeSelect;
