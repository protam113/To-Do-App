'use client';

import { ErrorLoading, LoadingSpin } from '@/components/loading';
import { UserRoleStatis } from '@/libs';
import React, { useState } from 'react';

export const StatisUserRole = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const { statistics, isLoading, isError } = UserRoleStatis(refreshKey);

  if (isLoading) {
    return (
      <div>
        <LoadingSpin />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <ErrorLoading />
      </div>
    );
  }

  return (
    <div className="space-y-2 p-4">
      <h2 className="font-bold text-lg">User Growth</h2>

      <div className="space-y-2">
        {statistics?.map((item, idx) => (
          <div
            key={idx}
            className="p-3 border   bg-white shadow-sm flex flex-col"
          >
            <span>
              <strong>Period:</strong> {item.activeCount}
            </span>
            <span>
              <strong>New Users:</strong> {item.blockedCount}
            </span>
            <span>
              <strong>Total Users:</strong> {item.count}
            </span>
            <span>
              <strong>Total Users:</strong> {item.percentage}
            </span>
            <span>
              <strong>Total Users:</strong> {item.role}
            </span>
          </div>
        ))}
      </div>

      {/* Nút reload */}
      <button
        onClick={() => setRefreshKey((prev) => prev + 1)}
        className="mt-4 px-4 py-2 bg-black text-white  "
      >
        Reload
      </button>
    </div>
  );
};
