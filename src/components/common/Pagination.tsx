'use client';

import { Button } from '@/src/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between mt-4 px-6 py-6">
      {/* Left Side: total items + page size */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="text-gray-600 font-semibold">Total: {totalItems}</span>
        <select
          value={pageSize}
          onChange={e => onPageSizeChange(Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        >
          {[10, 20, 50, 100].map(size => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>

      {/* Right Side: Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Prev Button */}
        <Button variant="outline" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
          Prev
        </Button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <Button key={page} variant={page === currentPage ? 'default' : 'outline'} onClick={() => onPageChange(page)}>
            {page}
          </Button>
        ))}

        {/* Next Button */}
        <Button
          variant="outline"
          disabled={currentPage === totalPages || totalItems <= pageSize}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
