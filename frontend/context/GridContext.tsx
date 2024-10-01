'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { GridAPI } from '@/queries/grid.api';
import useSupabaseBrowser from '@/utils/supabase/client';
import { shuffle } from '@/utils/utils';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { useUser } from './UserContext';
import { useToast } from '@/hooks/use-toast';
import { CellTypes, GridInfoType } from '@/utils/types';

interface GridContextType {
  cellsData: CellTypes[];
  gridInfo: GridInfoType;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  handleAssign: (rowIndex: number, colIndex: number) => Promise<void>;
  handleRandomAssign: (bulkCount: number) => Promise<void>;
  bulkCount: number;
  setBulkCount: React.Dispatch<React.SetStateAction<number>>;
  handleDelete: (cellId: number) => Promise<void>;
  handleReset: () => Promise<void>;
  numRows: number;
  numCols: number;
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
  const { toast } = useToast();

  const { data: allGrids, refetch: refetchAllGrids } = useQuery(
    GridAPI.v0.getManyGrids(supabase, userId)
  );

  const { data: gridInfo } = useQuery(GridAPI.v0.getGrid(supabase, gridId));

  const { data: cellsData, refetch: refetchCells } = useQuery(
    GridAPI.v0.getManyCells(supabase, gridId)
  );

  const [name, setName] = useState('');
  const [bulkCount, setBulkCount] = useState<number>(1);

  const handleAssign = useCallback(
    async (rowIndex: number, colIndex: number) => {
      const { error } = await GridAPI.v0.updateCell(
        supabase,
        gridId,
        rowIndex,
        colIndex,
        name
      );

      if (error) {
        console.error('Error updating cell:', error);
        return;
      }

      refetchCells();
      refetchAllGrids();
      setName('');
    },
    [name, supabase, gridId, refetchCells, refetchAllGrids]
  );

  const handleRandomAssign = useCallback(
    async (bulkCount: number = 1) => {
      const emptyCells = cellsData!.filter((cell) => !cell.assigned_value);

      if (emptyCells.length === 0) return;

      const cellsToAssign = shuffle(emptyCells).slice(0, bulkCount);

      const idsToAssign = cellsToAssign.map((cell) => cell.id) as number[];
      const cellCoordinates = cellsToAssign.map((cell) => ({
        rowIndex: cell.row_index,
        colIndex: cell.col_index,
      }));
      console.log('cellCoordinates', cellCoordinates);
      let error;

      if (cellsToAssign.length === 1) {
        // Single assignment
        ({ error } = await GridAPI.v0.updateCell(
          supabase,
          gridId,
          cellsToAssign[0].id,
          name
        ));
      } else {
        // Bulk assignment
        ({ error } = await GridAPI.v0.updateManyCells(
          supabase,
          gridId,
          idsToAssign,
          name
        ));
      }

      if (error) {
        console.error('Error updating cell(s):', error.message);
        return;
      }

      refetchCells();
      refetchAllGrids();
      setName('');
      setBulkCount(1);
      toast({
        title: `${name} assigned ${bulkCount} cells`,
        description: `${name} assigned to ${cellCoordinates.map(({ rowIndex, colIndex }) => `Row ${rowIndex + 1} Col ${colIndex + 1}`).join(', ')}`,
        variant: 'default',
      });
    },
    [cellsData, name, supabase, gridId, refetchCells, refetchAllGrids, toast]
  );

  const handleDelete = useCallback(
    async (cellId: number) => {
      const { error } = await GridAPI.v0.updateCell(
        supabase,
        gridId,
        cellId,
        null
      );

      const cellInfo = cellsData?.find((cell) => cell.id === cellId);

      if (error) {
        console.error('Error deleting cell:', error);
        return;
      }

      refetchCells();
      refetchAllGrids();

      if (cellInfo) {
        toast({
          title: `${cellInfo.assigned_value} deleted`,
          description: `Row: ${cellInfo.row_index + 1} Col: ${cellInfo.col_index + 1}`,
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
    setBulkCount(1);
    setName('');
    toast({
      title: 'Grid reset',
      description: 'All cells have been reset',
      variant: 'default',
    });
  }, [
    supabase,
    gridId,
    refetchCells,
    refetchAllGrids,
    setBulkCount,
    setName,
    toast,
  ]);

  const contextValue: GridContextType = {
    cellsData: cellsData as CellTypes[],
    gridInfo: gridInfo as GridInfoType,
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
    // rowAssignments: rowAssignments ?? [],
    // colAssignments: colAssignments ?? [],
    // handleGenerateAssignments,
    // assignmentsGenerated:
    //   allGrids?.some(
    //     (grid) => grid.uuid === gridId && grid.assignments_generated
    //   ) ?? false,
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
