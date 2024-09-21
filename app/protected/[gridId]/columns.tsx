'use client';

import { GridCell, useGridContext } from '@/context/GridContext';
import { ColumnDef, Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ActionCell = ({ row }: { row: Row<GridCell> }) => {
  const { handleDelete, assignmentsGenerated } = useGridContext();
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
          disabled={assignmentsGenerated}
          onClick={() => handleDelete(rowData.uuid as string)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<GridCell>[] = [
  {
    accessorKey: 'name',
    header: 'Player',
    filterFn: (row) => row.getValue('name') !== null,
  },
  {
    accessorKey: 'row',
    header: 'Row',
    cell: ({ row }) => {
      return row.original.row + 1;
    },
  },
  {
    accessorKey: 'col',
    header: 'Column',
    cell: ({ row }) => {
      return row.original.col + 1;
    },
  },
  {
    id: 'actions',
    cell: ActionCell,
  },
];
