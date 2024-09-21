'use client';
import { GridAPI } from '@/queries/grid.api';
import useSupabaseBrowser from '@/utils/supabase/client';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';

export default function ClientWrapper({
  children,
  gridId,
}: {
  children: React.ReactNode;
  gridId: string;
}) {
  const supabase = useSupabaseBrowser();
  const { data: gridInfo } = useQuery(GridAPI.getGridInfo(supabase, gridId));
  return (
    <div className="flex-1 space-y-4 xl:max-w-7xl xl:mx-auto p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{gridInfo?.name}</h2>
      </div>
      {children}
    </div>
  );
}
