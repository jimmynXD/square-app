'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { GridAPI } from '@/queries/grid.api';
import useSupabaseBrowser from '@/utils/supabase/client';
import { shuffle } from '@/utils/utils';
import { Database } from '@/utils/generated/database.types';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { useUser } from './UserContext';

export type GridCell = Database['public']['Tables']['grid_cells']['Row'];
type RowAssignment =
  Database['public']['Tables']['grid_row_assignments']['Row'];
type ColAssignment =
  Database['public']['Tables']['grid_col_assignments']['Row'];

interface GridContextType {
  gridData: GridCell[];
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  handleAssign: (id: string) => Promise<void>;
  handleRandomAssign: (bulkCount: number) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  bulkCount: number;
  setBulkCount: React.Dispatch<React.SetStateAction<number>>;
  handleReset: () => Promise<void>;
  numRows: number;
  numCols: number;
  rowAssignments: RowAssignment[];
  colAssignments: ColAssignment[];
  handleGenerateAssignments: () => Promise<void>;
  assignmentsGenerated: boolean;
  numEmptyCells: number;
}

// Create the context with the correct type
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
  const { data: allGrids, refetch: refetchAllGrids } = useQuery(
    GridAPI.getAll(supabase, userId) // Ensure userId is available in the context
  );

  const { data: gridData, refetch } = useQuery(
    GridAPI.getGridCells(supabase, gridId)
  );

  const { data: rowAssignments, refetch: refetchRowAssignments } = useQuery(
    GridAPI.getGridRowAssignments(supabase, gridId)
  );

  const { data: colAssignments, refetch: refetchColAssignments } = useQuery(
    GridAPI.getGridColAssignments(supabase, gridId)
  );

  const [name, setName] = useState('');
  const [bulkCount, setBulkCount] = useState<number>(1);

  const handleAssign = useCallback(
    async (id: string) => {
      if (!name) return;

      const { error } = await GridAPI.update(supabase, gridId, id, name);

      if (error) {
        console.error('Error updating cell:', error);
        return;
      }

      refetch();
      refetchAllGrids();
      setName('');
    },
    [name, supabase, gridId, refetch, refetchAllGrids]
  );
  const handleRandomAssign = useCallback(
    async (bulkCount: number = 1) => {
      const emptyCells = gridData!.filter((cell) => !cell.name);
      if (emptyCells.length === 0) return;

      const cellsToAssign = shuffle(emptyCells).slice(0, bulkCount);
      const idsToAssign = cellsToAssign.map((cell) => cell.uuid) as string[];

      let error;
      if (idsToAssign.length === 1) {
        // Single assignment
        ({ error } = await GridAPI.update(
          supabase,
          gridId,
          idsToAssign[0],
          name
        ));
      } else {
        // Bulk assignment
        ({ error } = await GridAPI.updateMany(
          supabase,
          gridId,
          idsToAssign,
          name
        ));
      }

      if (error) {
        console.error('Error updating cell(s):', error);
        return;
      }

      refetch();
      refetchAllGrids();
      setName('');
      setBulkCount(1);
    },
    [gridData, name, supabase, gridId, refetch, refetchAllGrids]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const { error } = await GridAPI.update(supabase, gridId, id, null);

      if (error) {
        console.error('Error deleting cell:', error);
        return;
      }

      refetch();
      refetchAllGrids();
    },
    [supabase, gridId, refetch, refetchAllGrids]
  );

  const handleReset = useCallback(async () => {
    const { error } = await GridAPI.resetAll(supabase, gridId);
    if (error) {
      console.error('Error resetting grid:', error);
      return;
    }

    refetch();
    refetchAllGrids();
    setBulkCount(1);
    setName('');
  }, [supabase, gridId, refetch, refetchAllGrids, setBulkCount, setName]);

  const handleGenerateAssignments = useCallback(async () => {
    const { error: rowError } = await GridAPI.createGridRowAssignments(
      supabase,
      gridId,
      allGrids?.find((grid) => grid.uuid === gridId)?.num_rows || 10
    );

    if (rowError) {
      console.error('Error creating grid row assignments:', rowError);
      return;
    }

    const { error: colError } = await GridAPI.createGridColAssignments(
      supabase,
      gridId,
      allGrids?.find((grid) => grid.uuid === gridId)?.num_rows || 10
    );

    if (colError) {
      console.error('Error creating grid col assignments:', colError);
      return;
    }

    refetchRowAssignments();
    refetchColAssignments();
    refetchAllGrids();
  }, [
    supabase,
    gridId,
    refetchRowAssignments,
    refetchColAssignments,
    refetchAllGrids,
    allGrids,
  ]);
  const contextValue: GridContextType = {
    gridData: gridData ?? [],
    name,
    setName,
    bulkCount,
    setBulkCount,
    handleAssign,
    handleRandomAssign,
    handleDelete,
    handleReset,
    numRows: allGrids?.find((grid) => grid.uuid === gridId)?.num_rows || 10,
    numCols: allGrids?.find((grid) => grid.uuid === gridId)?.num_cols || 10,
    rowAssignments: rowAssignments ?? [],
    colAssignments: colAssignments ?? [],
    handleGenerateAssignments,
    assignmentsGenerated:
      allGrids?.some(
        (grid) => grid.uuid === gridId && grid.assignments_generated
      ) ?? false,
    numEmptyCells:
      allGrids?.find((grid) => grid.uuid === gridId)?.total_empty_cells || 0,
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
