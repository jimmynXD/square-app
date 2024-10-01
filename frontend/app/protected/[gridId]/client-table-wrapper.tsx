'use client';
import { DataTable } from './data-table';
import { columns } from './columns';
import { useGridContext } from '@/context/GridContext';

export default function ClientTableWrapper() {
  const { cellsData } = useGridContext();
  return (
    <div>
      <DataTable data={cellsData} columns={columns} />
    </div>
  );
}
