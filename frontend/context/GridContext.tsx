'use client';

import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from 'react';
import { GridAPI } from '@/queries/grid.api';
import useSupabaseBrowser from '@/utils/supabase/client';
import { shuffle } from '@/utils/utils';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { useUser } from './UserContext';
import { useToast } from '@/hooks/use-toast';
import { CellTypes, WinnerTypes } from '@/utils/types';
import { QueryData } from '@supabase/supabase-js';

interface GridContextType {
  cellsData: CellTypes[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gridInfo: any;
  handleRandomAssign: (
    assignments: { name: string; count: number }[]
  ) => Promise<void>;

  handleDelete: (cellId: number | number[]) => Promise<void>;
  handleReset: () => Promise<void>;
  numRows: number;
  numCols: number;
  numEmptyCells: number;
  winnersData: WinnerTypes;
  handleLockGrid: (locked: boolean) => Promise<void>;
}

const GridContext = createContext<GridContextType | null>(null);

export function GridProvider({
  children,
  gridId,
}: {
  children: React.ReactNode;
  gridId: string;
}) {
  const supabase = useSupabaseBrowser();
  const { userId } = useUser();
  const { toast } = useToast();
  const [winners, setWinners] = useState<WinnerTypes | null>(null);

  const { data: allGrids, refetch: refetchAllGrids } = useQuery(
    GridAPI.v0.getManyGrids(supabase, userId)
  );

  const { data: gridInfo, refetch: refetchGridInfo } = useQuery(
    GridAPI.v0.getGrid(supabase, gridId)
  );

  const { data: cellsData, refetch: refetchCells } = useQuery(
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
        setWinners(payload.new);
      }
    );

    return () => {
      channel.unsubscribe();
    };
  }, [supabase, gridId, initialWinners]);

  const handleRandomAssign = useCallback(
    async (assignments: { name: string; count: number }[]) => {
      let allEmptyCells = cellsData!.filter((cell) => !cell.assigned_value);
      const allAssignments: { id: number; assigned_value: string }[] = [];

      for (const assignment of assignments) {
        if (allEmptyCells.length === 0 || assignment.count === 0) return;

        const cellsToAssign = shuffle(allEmptyCells).slice(0, assignment.count);

        const idsToAssign = cellsToAssign.map((cell) => cell.id) as number[];

        allAssignments.push(
          ...idsToAssign.map((id) => ({ id, assigned_value: assignment.name }))
        );

        allEmptyCells = allEmptyCells.filter(
          (cell) => !idsToAssign.includes(cell.id)
        );
      }

      if (allAssignments.length === 0) return;

      const { error: updateManyError } = await GridAPI.v0.updateManyCellsV2(
        supabase,
        allAssignments
      );

      if (updateManyError) {
        console.error('Error updating cell(s):', updateManyError.message);
        return;
      }

      refetchCells();
      refetchAllGrids();

      toast({
        title: `assigned cells`,
        description: `assigned`,
        variant: 'default',
      });
    },
    [cellsData, supabase, refetchCells, refetchAllGrids, toast]
  );

  const handleDelete = useCallback(
    async (cellId: number | number[]) => {
      const cellIds = Array.isArray(cellId) ? cellId : [cellId];
      // find all the cell names that are being deleted
      const cellNames = cellIds.map(
        (id) => cellsData?.find((cell) => cell.id === id)?.assigned_value
      );
      const cellInfo = cellsData?.find((cell) => cell.id === cellId);

      const { error } = await GridAPI.v0.updateManyCells(
        supabase,
        gridId,
        cellIds,
        null
      );

      if (error) {
        console.error('Error deleting cell:', error);
        return;
      }
      refetchCells();

      refetchAllGrids();

      if (cellInfo) {
        toast({
          title: `Names deleted`,
          description: `${cellNames.join(', ')} has been deleted`,
          variant: 'destructive',
        });
      }
    },
    [supabase, gridId, refetchCells, refetchAllGrids, toast, cellsData]
  );

  const handleReset = useCallback(async () => {
    const { error } = await GridAPI.v0.resetManyCells(supabase, gridId);
    if (error) {
      console.error('Error resetting grid:', error);
      return;
    }

    refetchCells();
    refetchAllGrids();
    toast({
      title: 'Grid reset',
      description: 'All cells have been reset',
      variant: 'default',
    });
  }, [supabase, gridId, refetchCells, refetchAllGrids, toast]);

  const handleLockGrid = useCallback(
    async (locked: boolean) => {
      const lockedAt = locked ? new Date().toISOString() : null;
      const { error } = await GridAPI.v0.updateGridLockedAt(
        supabase,
        gridId,
        lockedAt
      );
      if (error) {
        console.error('Error locking grid:', error);
        return;
      }
      refetchAllGrids();
      refetchGridInfo();

      toast({
        title: `Grid ${locked ? 'locked' : 'unlocked'}`,
        description: `${locked ? 'Grid has been locked' : 'Grid has been unlocked'}`,
        variant: 'default',
      });
    },
    [supabase, gridId, refetchAllGrids, refetchGridInfo, toast]
  );

  const contextValue: GridContextType = {
    cellsData: cellsData as CellTypes[],
    gridInfo: gridInfo as QueryData<typeof GridAPI.v0.getGrid>,
    handleRandomAssign,
    handleDelete,
    handleReset,
    numRows: allGrids?.find((grid) => grid.uuid === gridId)?.num_rows || 10,
    numCols: allGrids?.find((grid) => grid.uuid === gridId)?.num_cols || 10,
    numEmptyCells:
      allGrids?.find((grid) => grid.uuid === gridId)?.total_empty_cells || 0,
    winnersData: winners as WinnerTypes,
    handleLockGrid,
  };

  return (
    <GridContext.Provider value={contextValue}>{children}</GridContext.Provider>
  );
}

export const useGridContext = (): GridContextType => {
  const context = useContext(GridContext);
  if (context === null) {
    throw new Error('useGridContext must be used within a GridProvider');
  }
  return context;
};
