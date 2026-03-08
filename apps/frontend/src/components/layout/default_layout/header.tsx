'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { CustomImage } from '../../design/image.component';

import SearchNavigation from './search-navigation';
import { SidebarTrigger } from '../../ui/sidebar';
import { cn } from '@/utils';
import { LayoutGrid } from 'lucide-react';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-sidebar min-h-[60px]'
        )}
      >
        <div className="ml-4 mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full min-h-[60px]">
            <div className="flex items-center space-x-4">
              <Button onClick={() => router.push(`/`)}>
                <LayoutGrid className="text-white" size={28} />
              </Button>
              <SidebarTrigger className="-ml-1 text-white hover:bg-gray-200" />
              <CustomImage
                src="/icons/logo.svg"
                alt="ATOM Solution Logo"
                width={42}
                height={42}
                className="shrink-0"
              />

              <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-bold tracking-wide text-white">
                  ATOM SOLUTION
                </span>
                <span className="text-[11px] text-gray-200 font-medium">
                  Global Operations Center
                </span>
              </div>
              <nav className="hidden md:flex items-center space-x-4">
                <Link
                  href={`/monitor`}
                  className={cn(
                    'px-3 py-3 text-lg font-medium text-white border-b border-gray-700 hover:text-main-600',
                    pathname === `/team` && 'text-main-600'
                  )}
                >
                  Monitors
                </Link>
                <Link
                  href={`/task`}
                  className={cn(
                    'px-3 py-3 text-lg font-medium text-white border-b border-gray-700 hover:text-main-600',
                    pathname === `/task` && 'text-main-600'
                  )}
                >
                  Report
                </Link>
                <Link
                  href={`/road-map`}
                  className={cn(
                    'px-3 py-3 text-lg font-medium text-white border-b border-gray-700 hover:text-main-600',
                    pathname === `/road-map` && 'text-main-600'
                  )}
                >
                  Road Map
                </Link>
                <Link
                  href={`/member`}
                  className={cn(
                    'px-3 py-3 text-lg font-medium text-white border-b border-gray-700 hover:text-main-600',
                    pathname === `/member` && 'text-main-600'
                  )}
                >
                  Members
                </Link>
              </nav>
            </div>

            {/* Contact and CTA (Desktop) */}
            <div className="hidden md:flex items-center space-x-4">
              <SearchNavigation />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
