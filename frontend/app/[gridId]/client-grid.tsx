'use client';

import GridComponent from '@/components/GridComponent';
import Scoreboard from '@/components/Scoreboard';
import { GridAPI } from '@/queries/grid.api';
import useSupabaseBrowser from '@/utils/supabase/client';
import { WinnerTypes } from '@/utils/types';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { useEffect, useState } from 'react';

export default function ClientGrid({ gridId }: { gridId: string }) {
  const supabase = useSupabaseBrowser();
  const [winners, setWinners] = useState<WinnerTypes | null>(null);

  const { data: gridInfo } = useQuery(GridAPI.v0.getGrid(supabase, gridId));
  const { data: cellsData } = useQuery(
    GridAPI.v0.getManyCells(supabase, gridId)
  );
  const { data: initialWinners } = useQuery(
    GridAPI.v0.getWinners(supabase, gridId)
  );
  useEffect(() => {
    if (initialWinners) {
      setWinners(initialWinners);
    }

    const channel = GridAPI.v0.subscribeToWinners(
      supabase,
      gridId,
      (payload) => {
        if (payload.eventType === 'DELETE') {
          setWinners(null);
        } else {
          setWinners(payload.new);
        }
      }
    );

    return () => {
      channel.unsubscribe();
    };
  }, [supabase, gridId, initialWinners]);

  if (!gridInfo || !cellsData) return null;

  return (
    <div className="flex-1 space-y-4 xl:max-w-7xl xl:mx-auto p-8">
      <Scoreboard gridInfo={gridInfo} />
      <GridComponent
        gridInfo={gridInfo}
        cellsData={cellsData}
        winnersData={winners}
      />
    </div>
  );
}
