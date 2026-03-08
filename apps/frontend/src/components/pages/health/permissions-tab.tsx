'use client';

import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Shield,
  Eye,
  Settings,
  ChevronDown,
} from 'lucide-react';
import {
  Button,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui';
import { Icons } from '@/assets';

// Mock data - replace with real API
const mockPermissions = [
  {
    id: '1',
    userName: 'User A',
    email: 'usera@example.com',
    role: 'User',
    metrics: ['Latency'],
    servers: ['prod-api'],
    actions: ['view'],
  },
  {
    id: '2',
    userName: 'Manager B',
    email: 'manager@example.com',
    role: 'Manager',
    metrics: ['SuccessRate', 'Throughput', 'Latency'],
    servers: ['prod-api', 'staging-api', 'dev-api'],
    actions: ['view'],
  },
  {
    id: '3',
    userName: 'Admin C',
    email: 'admin@example.com',
    role: 'Admin',
    metrics: ['SuccessRate', 'Throughput', 'Latency'],
    servers: ['All Servers'],
    actions: ['view', 'create', 'edit', 'delete'],
  },
];

const roleColors: Record<string, string> = {
  User: 'bg-blue-100 text-blue-700',
  Manager: 'bg-purple-100 text-purple-700',
  Admin: 'bg-red-100 text-red-700',
};

const actionIcons: Record<string, React.ElementType> = {
  view: Eye,
  create: Plus,
  edit: Edit,
  delete: Trash2,
};

export const PermissionsTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [permissions] = useState(mockPermissions);

  const filteredPermissions = permissions.filter(
    (perm) =>
      perm.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      perm.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      perm.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Monitoring Permissions
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage user access to metrics and servers
          </p>
        </div>
        <Button className="inline-flex items-center gap-2 bg-blue-600 px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Add Permission
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by user, email or role..."
            className="w-full border border-gray-300 bg-white rounded-md py-2 pl-9 pr-3 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Permissions Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                Allowed Metrics
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                Allowed Servers
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                Actions
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredPermissions.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No permissions found
                </td>
              </tr>
            ) : (
              filteredPermissions.map((perm) => (
                <tr key={perm.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold">
                        {perm.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {perm.userName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {perm.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      className={`${
                        roleColors[perm.role]
                      } px-2.5 py-1 text-xs font-medium rounded-full`}
                    >
                      {perm.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {perm.metrics.map((metric) => (
                        <Badge
                          key={metric}
                          variant="outline"
                          className="px-2 py-0.5 text-xs border-blue-200 text-blue-700 bg-blue-50"
                        >
                          {metric}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {perm.servers.map((server) => (
                        <Badge
                          key={server}
                          variant="outline"
                          className="px-2 py-0.5 text-xs border-green-200 text-green-700 bg-green-50"
                        >
                          {server}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {perm.actions.map((action) => {
                        const Icon = actionIcons[action];
                        return (
                          <div
                            key={action}
                            className="p-1.5 rounded bg-gray-100 text-gray-600"
                            title={action}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <Icons.EllipsisVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 bg-white"
                      >
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Permission
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Permission
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-blue-900">User Role</div>
              <div className="text-xs text-blue-700 mt-0.5">
                Limited access to specific metrics and servers
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Eye className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-purple-900">
                Manager Role
              </div>
              <div className="text-xs text-purple-700 mt-0.5">
                View all metrics across multiple servers
              </div>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Settings className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-red-900">Admin Role</div>
              <div className="text-xs text-red-700 mt-0.5">
                Full access: create, edit, delete all resources
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
