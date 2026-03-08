'use client';

import React, { useState } from 'react';
import {
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  ExternalLink,
} from 'lucide-react';

const GRAFANA_URL =
  process.env.NEXT_PUBLIC_GRAFANA_URL || 'http://localhost:3001';
const PROMETHEUS_URL =
  process.env.NEXT_PUBLIC_PROMETHEUS_URL || 'http://localhost:9090';

export const ServerTab = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const servers = [
    {
      name: 'Prometheus Server',
      address: PROMETHEUS_URL,
      timeout: '30s',
      proxy: '-',
      useTLS: false,
      contacts: 'ops@example.com',
    },
    {
      name: 'Grafana Server',
      address: GRAFANA_URL,
      timeout: '30s',
      proxy: '-',
      useTLS: false,
      contacts: 'admin@example.com',
    },
  ];

  return (
    <div className="flex gap-6">
      {/* Left Sidebar */}
      <div className="w-48 shrink-0 space-y-1">
        <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-md bg-blue-50 text-blue-600 border border-blue-200">
          <Activity className="h-4 w-4" />
          Prometheus Server
        </button>
      </div>

      {/* Right Content */}
      <div className="flex-1 space-y-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href={`${PROMETHEUS_URL}/targets`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add prometheus
            </a>
            <button className="inline-flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
              Actions
              <ChevronRight className="h-4 w-4 rotate-90" />
            </button>
          </div>
          <button className="p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600 rounded-md transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>

        {/* Filters and Pagination */}
        <div className="flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by server name"
              className="border border-gray-300 bg-white rounded-md py-2 pl-9 pr-3 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-2">
            <button className="rounded p-1.5 text-gray-400 hover:bg-gray-100 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-8 w-8 rounded text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button className="rounded p-1.5 text-gray-400 hover:bg-gray-100 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Server name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Timeout
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Proxy
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Use TLS
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Contacts
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {servers.map((server, idx) => (
                <tr key={idx}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    <a
                      href={server.address}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-700"
                    >
                      {server.name}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {server.address}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {server.timeout}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {server.proxy}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {server.useTLS ? 'Yes' : 'No'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700700">
                    {server.contacts}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
