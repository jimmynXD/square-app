'use client';
import { GridAPI } from '@/queries/grid.api';
import useSupabaseBrowser from '@/utils/supabase/client';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { DataTable } from './data-table';
import { columns } from './columns';

type ClientTableWrapperProps = {
  gridId: string;
};
export default function ClientTableWrapper({
  gridId,
}: ClientTableWrapperProps) {
  const supabase = useSupabaseBrowser();
  const { data } = useQuery(GridAPI.getGridCells(supabase, gridId));
  return (
    <div>
      <DataTable data={data!} columns={columns} />
    </div>
  );
}
