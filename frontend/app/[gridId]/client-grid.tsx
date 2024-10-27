'use client';

import GridComponent from '@/components/GridComponent';
import Scoreboard from '@/components/Scoreboard';
import { GridAPI } from '@/queries/grid.api';
import useSupabaseBrowser from '@/utils/supabase/client';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';

export default function ClientGrid({ gridId }: { gridId: string }) {
  const supabase = useSupabaseBrowser();

  const { data: gridInfo } = useQuery(GridAPI.v0.getGrid(supabase, gridId));

  const { data: cellsData } = useQuery(
    GridAPI.v0.getManyCells(supabase, gridId)
  );
  const { data: winnersData } = useQuery(
    GridAPI.v0.getWinners(supabase, gridId)
  );

  if (!gridInfo || !cellsData) return null;

  return (
    <div className="flex-1 space-y-4 xl:max-w-7xl xl:mx-auto p-8">
      <Scoreboard gridInfo={gridInfo} />
      <GridComponent
        gridInfo={gridInfo}
        cellsData={cellsData}
        winnersData={winnersData}
      />
    </div>
  );
}
