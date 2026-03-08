'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui';
import { adminData } from '@/libs';
import { cn } from '@/utils';

interface NavItem {
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export default function SearchAdminNavigation() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const allNavItems = useMemo(() => {
    const items: NavItem[] = [];
    adminData.navMain.forEach((item) => items.push(item));
    adminData.navAdmin.forEach((item) => {
      items.push(item);
      item.items?.forEach((sub) => items.push(sub));
    });
    // adminData.navTeam.forEach((item) => {
    //   items.push(item);
    //   item.items?.forEach((sub) => items.push(sub));
    // });
    adminData.navService.forEach((item) => items.push(item));
    adminData.navSupport.forEach((item) => items.push(item));
    return items;
  }, []);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return allNavItems;
    const lowerQuery = query.toLowerCase();
    return allNavItems.filter((item) =>
      item.title.toLowerCase().includes(lowerQuery)
    );
  }, [query, allNavItems]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (url: string) => {
    router.push(url);
    setQuery('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredItems.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredItems.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredItems.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        handleSelect(filteredItems[selectedIndex].url);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
      <Input
        ref={inputRef}
        type="text"
        placeholder="Search pages..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        className="pl-10 text-xs bg-gray-200 border-gray-200 h-12 w-full"
      />

      {isOpen && filteredItems.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200   shadow-lg z-50 max-h-64 overflow-y-auto">
          {filteredItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={`${item.url}-${index}`}
                onClick={() => handleSelect(item.url)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors',
                  index === selectedIndex
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                {Icon && <Icon className="h-4 w-4 text-gray-500" />}
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>
      )}

      {isOpen && query && filteredItems.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200   shadow-lg z-50 p-4 text-center text-gray-500 text-sm">
          No pages found
        </div>
      )}
    </div>
  );
}
