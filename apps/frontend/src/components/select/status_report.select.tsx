'use client';

import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui';

const ReportStatusSelect = ({
  handleStatusChange,
}: {
  handleStatusChange: (value: string) => void;
}) => {
  return (
    <Select onValueChange={handleStatusChange}>
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
        <SelectItem value="open" className="rounded-md">
          Open
        </SelectItem>
        <SelectItem value="in_progress" className="rounded-md">
          In Process
        </SelectItem>
        <SelectItem value="resolved" className="rounded-md">
          Resolved
        </SelectItem>
        <SelectItem value="canceled" className="rounded-md">
          Canceled
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ReportStatusSelect;
