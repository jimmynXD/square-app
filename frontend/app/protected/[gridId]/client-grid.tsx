'use client';

import GridComponent from '@/components/GridComponent';
import { useGridContext } from '@/context/GridContext';

export default function ClientGrid() {
  const { cellsData, gridInfo, winnersData } = useGridContext();

  return (
    <GridComponent
      gridInfo={gridInfo}
      cellsData={cellsData}
      winnersData={winnersData}
    />
  );
}
