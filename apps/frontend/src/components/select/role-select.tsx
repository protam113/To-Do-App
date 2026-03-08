'use client';

import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui';
const RoleSelect = ({
  handleRoleChange,
}: {
  handleRoleChange: (value: string) => void;
}) => {
  return (
    <Select onValueChange={handleRoleChange}>
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
        <SelectItem value="admin" className="rounded-md">
          Admin
        </SelectItem>
        <SelectItem value="manager" className="rounded-md">
          Manager
        </SelectItem>
        <SelectItem value="user" className="rounded-md">
          User
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default RoleSelect;
