'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Loader2 } from 'lucide-react';
import { UserList } from '@/libs';
import { Input } from '@/components/ui';
import { logDebug } from '../../utils/logger';

interface UserSelectProps {
  value?: string;
  onValueChange: (userId: string) => void;
  placeholder?: string;
}

export function UserSelect({
  value,
  onValueChange,
  placeholder = 'All Users',
}: UserSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [actualSearchQuery, setActualSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const params = {
    search: actualSearchQuery || undefined,
    page_size: 10,
  };

  const { users, isLoading, pagination } = UserList(
    currentPage,
    params,
    currentPage
  );

  // Accumulate users when loading more
  useEffect(() => {
    if (users && currentPage === 1) {
      setAllUsers(users);
    } else if (users && currentPage > 1) {
      setAllUsers((prev) => [...prev, ...users]);
    }
  }, [users, currentPage]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setActualSearchQuery(searchQuery.trim());
      setCurrentPage(1);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActualSearchQuery('');
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    if (currentPage < pagination.total_page) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleSelectUser = (userId: string, userName: string) => {
    onValueChange(userId);
    logDebug('..', userName);
    setIsOpen(false);
  };
  const selectedUser = allUsers.find((u) => u.id === value);
  const displayValue =
    value === 'all' || !value
      ? placeholder
      : selectedUser
      ? selectedUser.firstName && selectedUser.lastName
        ? `${selectedUser.firstName} ${selectedUser.lastName}`
        : selectedUser.username
      : placeholder;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-[180px] h-8 px-4 bg-white border border-gray-300 rounded-md flex items-center justify-between hover:bg-gray-50"
      >
        <span className="text-xs truncate">{displayValue}</span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-[280px] mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {/* Search Input */}
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                className="pl-8 pr-8 h-8 text-xs rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* User List */}
          <div className="max-h-[300px] overflow-y-auto">
            <div
              className="px-3 py-2 text-xs hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectUser('all', 'All Users')}
            >
              All Users
            </div>

            {isLoading && currentPage === 1 ? (
              <div className="px-3 py-4 text-xs text-gray-500 flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading...
              </div>
            ) : (
              allUsers?.map((user) => (
                <div
                  key={user.id}
                  className="px-3 py-2 text-xs hover:bg-gray-100 cursor-pointer"
                  onClick={() =>
                    handleSelectUser(
                      user.id,
                      user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.username
                    )
                  }
                >
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.username}
                  <span className="text-xs text-gray-500 ml-2">
                    @{user.username}
                  </span>
                </div>
              ))
            )}

            {/* Load More Button */}
            {currentPage < pagination.total_page && (
              <div className="p-2 border-t">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="w-full py-2 text-xs text-blue-600 hover:bg-blue-50 rounded-md disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading...
                    </span>
                  ) : (
                    `Load More (${
                      pagination.total - allUsers.length
                    } remaining)`
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
