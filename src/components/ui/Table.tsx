import React from 'react';
import { twMerge } from 'tailwind-merge';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { PAGE_SIZES } from '../../config';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className }) => {
  return (
    <div className="table-container">
      <table className={twMerge('table', className)}>{children}</table>
    </div>
  );
};

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};

interface TableFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const TableFooter: React.FC<TableFooterProps> = ({ children, className }) => {
  return <tfoot className={className}>{children}</tfoot>;
};

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
}

export const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
  return <tr className={className}>{children}</tr>;
};

interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
}

export const TableHead: React.FC<TableHeadProps> = ({ children, className }) => {
  return <th className={className}>{children}</th>;
};

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

export const TableCell: React.FC<TableCellProps> = ({ children, className }) => {
  return <td className={className}>{children}</td>;
};

interface PaginationProps {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  totalCount,
  pageSize,
  currentPage,
  onPageChange,
  onPageSizeChange,
  className,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  
  return (
    <div className={twMerge('flex items-center justify-between mt-4 text-sm', className)}>
      <div className="flex items-center space-x-2">
        <span className="text-gray-600">Rows per page:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="select h-8 text-xs"
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex items-center">
        <span className="mr-4 text-gray-600">
          {`${((currentPage - 1) * pageSize) + 1}-${Math.min(currentPage * pageSize, totalCount)} of ${totalCount}`}
        </span>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="btn-ghost h-8 w-8 p-0 flex items-center justify-center rounded-md disabled:opacity-50"
            aria-label="First Page"
          >
            <ChevronsLeft size={16} />
          </button>
          
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn-ghost h-8 w-8 p-0 flex items-center justify-center rounded-md disabled:opacity-50"
            aria-label="Previous Page"
          >
            <ChevronLeft size={16} />
          </button>
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn-ghost h-8 w-8 p-0 flex items-center justify-center rounded-md disabled:opacity-50"
            aria-label="Next Page"
          >
            <ChevronRight size={16} />
          </button>
          
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="btn-ghost h-8 w-8 p-0 flex items-center justify-center rounded-md disabled:opacity-50"
            aria-label="Last Page"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};