import React from 'react';
import { TableSkeleton } from './LoadingSkeleton';

export interface ColumnDef<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  emptyMessage?: string;
  keyExtractor: (row: T) => string;
}

function DataTable<T>({ data, columns, loading, emptyMessage = 'Ma\'lumot topilmadi', keyExtractor }: DataTableProps<T>) {
  if (loading) return <TableSkeleton rows={6} cols={columns.length} />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#2A2A2A]">
            {columns.map(col => (
              <th key={col.key} className={`text-left py-3 px-4 text-xs font-medium text-[#A1A1AA] uppercase tracking-wider ${col.className ?? ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center text-[#A1A1AA] text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map(row => (
              <tr key={keyExtractor(row)} className="border-b border-[#2A2A2A]/50 hover:bg-[#2A2A2A]/30 transition-colors">
                {columns.map(col => (
                  <td key={col.key} className={`py-3 px-4 text-sm text-[#FAFAFA] ${col.className ?? ''}`}>
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
