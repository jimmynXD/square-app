'use client';

import { useGridContext } from '@/context/GridContext';
import { ColumnDef, Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CellTypes } from '@/utils/types';

const ActionCell = ({ row }: { row: Row<CellTypes> }) => {
  const { handleDelete } = useGridContext();
  const rowData = row.original;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="text-red-500"
          onClick={() => handleDelete(rowData.id)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<CellTypes>[] = [
  {
    accessorKey: 'assigned_value',
    header: 'Player',
    filterFn: (row) => row.getValue('assigned_value') !== null,
  },
  {
    accessorKey: 'row_index',
    header: 'Row',
    cell: ({ row }) => {
      return row.original.row_index + 1;
    },
  },
  {
    accessorKey: 'col_index',
    header: 'Column',
    cell: ({ row }) => {
      return row.original.col_index + 1;
    },
  },
  {
    id: 'actions',
    cell: ActionCell,
  },
];
