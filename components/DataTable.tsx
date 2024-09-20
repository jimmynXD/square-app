'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import Link from 'next/link';
import useSupabaseBrowser from '@/utils/supabase/client';
import { GridAPI } from '@/queries/grid.api';
import { Button } from './ui/button';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { useUser } from '@/context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';

export default function DataTable() {
  const supabase = useSupabaseBrowser();
  const { userId } = useUser();

  const { data: gridData, refetch } = useQuery(
    GridAPI.getAll(supabase, userId)
  );

  const handleDelete = async (id: string) => {
    const { error } = await GridAPI.deleteGrid(supabase, id);
    if (error) {
      console.error('Error deleting grid:', error.message);
    } else {
      refetch();
    }
  };

  return gridData && gridData.length > 0 ? (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead />
          <TableHead>Name</TableHead>
          <TableHead>Columns</TableHead>
          <TableHead>Rows</TableHead>
          <TableHead>Empty cells</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Updated At</TableHead>
          <TableHead>Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {gridData.map((grid) => (
          <TableRow key={grid.id}>
            <TableCell>
              {grid.assignments_generated ? (
                <FontAwesomeIcon icon={faLock} className="text-gray-500" />
              ) : (
                <FontAwesomeIcon icon={faLockOpen} className="text-gray-500" />
              )}
            </TableCell>
            <TableCell>
              <Link
                href={`/protected/${grid.uuid}`}
                className="text-primary hover:underline"
              >
                {grid.name}
              </Link>
            </TableCell>
            <TableCell>{grid.num_cols}</TableCell>
            <TableCell>{grid.num_rows}</TableCell>
            <TableCell>{grid.total_empty_cells}</TableCell>
            <TableCell>
              {grid.created_at
                ? new Date(grid.created_at).toLocaleString()
                : 'N/A'}
            </TableCell>
            <TableCell>
              {grid.updated_at
                ? new Date(grid.updated_at).toLocaleString()
                : 'N/A'}
            </TableCell>
            <TableCell>
              <Button
                variant={'destructive'}
                onClick={() => handleDelete(grid.uuid!)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <div>No grids found</div>
  );
}
