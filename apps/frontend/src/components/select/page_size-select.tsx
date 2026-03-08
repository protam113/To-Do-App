'use client';

import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui';

const PageSizeSelect = ({
  handlePageSizeChange,
  pageSize,
}: {
  handlePageSizeChange: (value: string) => void;
  pageSize: number;
}) => {
  return (
    <Select onValueChange={handlePageSizeChange} value={String(pageSize)}>
      <SelectTrigger
        className="w-[80px] rounded-md bg-white px-4 "
        size="default"
      >
        <SelectValue placeholder={pageSize} />
      </SelectTrigger>
      <SelectContent className="rounded-md bg-white min-w-[80px]" align="start">
        <SelectItem value="5" className="rounded-md">
          5
        </SelectItem>
        <SelectItem value="10" className="rounded-md">
          10
        </SelectItem>
        <SelectItem value="20" className="rounded-md">
          20
        </SelectItem>
        <SelectItem value="50" className="rounded-md">
          50
        </SelectItem>
        <SelectItem value="100" className="rounded-md">
          100
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default PageSizeSelect;
