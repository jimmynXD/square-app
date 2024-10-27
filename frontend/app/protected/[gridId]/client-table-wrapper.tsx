'use client';
import { DataTable } from './data-table';
import { columns, winnersColumns } from './columns';
import { useGridContext } from '@/context/GridContext';
import { WinnerJsonType } from '@/utils/types';

export default function ClientTableWrapper() {
  const { cellsData } = useGridContext();
  return (
    <div>
      <DataTable
        data={cellsData}
        columns={columns}
        initialColumnFilter={[
          {
            id: 'assigned_value',
            value: '',
          },
        ]}
      />
    </div>
  );
}

export function WinnersTableWrapper() {
  const { winnersData } = useGridContext();

  if (!winnersData || winnersData?.winners == null) {
    return <div>No winners found</div>;
  }
  return (
    <div>
      <DataTable
        data={winnersData.winners as WinnerJsonType[]}
        columns={winnersColumns}
      />
    </div>
  );
}
