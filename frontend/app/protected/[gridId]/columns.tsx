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
import { CellTypes, WinnerJsonType } from '@/utils/types';
import { Checkbox } from '@/components/ui/checkbox';

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

export const columns = (lockedAt: string | null): ColumnDef<CellTypes>[] => [
  {
    id: 'select',
    header: ({ table }) =>
      !lockedAt ? (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ) : null,
    cell: ({ row }) =>
      !lockedAt ? (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ) : null,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'assigned_value',
    header: 'Player',
    filterFn: (row) => row.getValue('assigned_value') !== null,
  },
  {
    accessorKey: 'row_index',
    header: 'Row',
    cell: ({ row }) => {
      return row.original.row_index! + 1;
    },
  },
  {
    accessorKey: 'col_index',
    header: 'Column',
    cell: ({ row }) => {
      return row.original.col_index! + 1;
    },
  },
  // disable actions if grid is locked
  {
    id: 'actions',
    cell: () => (lockedAt ? null : ActionCell),
  },
];

export const winnersColumns: ColumnDef<WinnerJsonType>[] = [
  {
    accessorKey: 'name',
    header: 'Player',
  },

  {
    accessorKey: 'quarter',
    header: 'Quarter',
    cell: ({ row }) => {
      const quarter = row.original.quarter;
      return quarter;
    },
  },
  {
    accessorKey: 'y',
    header: 'Row Score',
  },
  {
    accessorKey: 'x',
    header: 'Column Score',
  },
];
