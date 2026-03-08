'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui';
import { PaginationProps } from '@/types';

export const CustomPagination = ({
  currentPage,
  totalPage,
  onPageChange,
}: PaginationProps) => {
  if (totalPage <= 1) return null;

  return (
    <div className="flex justify-center items-center scroll mt-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              aria-disabled={currentPage === 1}
              className="text-main"
            />
          </PaginationItem>

          {Array.from({ length: totalPage }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={currentPage === page}
                onClick={() => onPageChange(page)}
                className={
                  currentPage === page
                    ? 'border-2 bg-secondary text-white border-secondary-300 hover:bg-secondary-700 hover:border-secondary-200 px-4'
                    : 'border-2 bg-transparent text-secondary border-secondary hover:bg-main-50 hover:border-secondary-600 px-4'
                }
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPage))}
              aria-disabled={currentPage === totalPage}
              className="text-main"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
