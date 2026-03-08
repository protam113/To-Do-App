'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui';
import { ErrorList } from '../../libs/responses/errorLib';

interface errorselectProps {
  value?: string;
  onValueChange: (errorId: string) => void;
  placeholder?: string;
}

export function ErrorSelect({
  value,
  onValueChange,
  placeholder = 'All errors',
}: errorselectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [actualSearchQuery, setActualSearchQuery] = useState('');
  const [allerrors, setAllerrors] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const params = {
    search: actualSearchQuery || undefined,
    page_size: 10,
  };

  const { errors, isLoading, pagination } = ErrorList(
    currentPage,
    params,
    currentPage
  );

  // Accumulate errors when loading more
  useEffect(() => {
    if (errors && currentPage === 1) {
      setAllerrors(errors);
    } else if (errors && currentPage > 1) {
      setAllerrors((prev) => [...prev, ...errors]);
    }
  }, [errors, currentPage]);

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

  const handleSelectError = (errorId: string) => {
    onValueChange(errorId);
    setIsOpen(false);
  };

  const selectedUser = allerrors.find((u) => u.id === value);
  const displayValue =
    value === 'all' || !value
      ? placeholder
      : selectedUser
      ? selectedUser.firstName && selectedUser.lastName
        ? `${selectedUser.firstName} ${selectedUser.lastName}`
        : selectedUser.username
      : placeholder;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-[180px] h-10 px-4 bg-white border border-gray-200 rounded-md flex items-center justify-between hover:bg-gray-50 text-sm"
      >
        <span className="truncate">{displayValue}</span>
        <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-[9999] w-[280px] mt-1 bg-white border border-gray-200 rounded-md shadow-lg right-0">
          {/* Search Input */}
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search errors..."
                className="pl-8 pr-8 h-8 text-sm rounded-md"
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
              className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectError('all')}
            >
              All errors
            </div>

            {isLoading && currentPage === 1 ? (
              <div className="px-3 py-4 text-sm text-gray-500 flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading...
              </div>
            ) : (
              allerrors?.map((error) => (
                <div
                  key={error.id}
                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectError(error.id)}
                >
                  {error.name && error.name ? `${error.name} ` : error.name}
                </div>
              ))
            )}

            {/* Load More Button */}
            {currentPage < pagination.total_page && (
              <div className="p-2 border-t">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="w-full py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading...
                    </span>
                  ) : (
                    `Load More (${
                      pagination.total - allerrors.length
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
