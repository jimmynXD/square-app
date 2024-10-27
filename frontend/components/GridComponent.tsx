import { GridAPI } from '@/queries/grid.api';
import { CellTypes, WinnerJsonType, WinnerTypes } from '@/utils/types';
import { QueryData } from '@supabase/supabase-js';
import clsx from 'clsx';

interface GridComponentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gridInfo: any | QueryData<typeof GridAPI.v0.getGrid>; // Replace 'any' with a more specific type if available
  cellsData: CellTypes[]; // Replace 'any' with a more specific type if available
  winnersData?: WinnerTypes | null;
}

export default function GridComponent({
  gridInfo,
  cellsData,
  winnersData,
}: GridComponentProps) {
  if (!gridInfo || !cellsData) return null;
  const winners = (winnersData?.winners as WinnerJsonType[]) || [];
  const gameTime = new Date(gridInfo.nfl_schedule?.date || '');
  const currentTime = new Date();
  const gameStarted = currentTime >= gameTime;

  return (
    <div className="relative">
      <div className="text-center text-2xl font-bold">
        {gridInfo.nfl_schedule?.away_team?.name}
      </div>

      <div className="text-2xl font-bold absolute top-1/2 left-3 -translate-x-1/2 origin-top-left -rotate-90">
        {gridInfo.nfl_schedule?.home_team?.name}
      </div>
      <table className="w-full table-fixed border-collapse border-spacing-0">
        <thead>
          <tr className="">
            <th />
            {Array.from({ length: gridInfo.num_cols }).map((_, colIndex) => (
              <th
                key={colIndex}
                className={clsx(
                  'border text-secondary-foreground bg-secondary'
                )}
              >
                {gameStarted ||
                (gridInfo.locked_at &&
                  new Date(gridInfo.locked_at).getTime() > 0)
                  ? cellsData.find((cell) => cell.col_index === colIndex)
                      ?.assigned_col_value
                  : '-'}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: gridInfo.num_rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              <th className="bg-secondary text-secondary-foreground border">
                {gameStarted ||
                (gridInfo.locked_at &&
                  new Date(gridInfo.locked_at).getTime() > 0)
                  ? cellsData.find((cell) => cell.row_index === rowIndex)
                      ?.assigned_row_value
                  : '-'}
              </th>
              {Array.from({ length: gridInfo.num_cols }).map((_, colIndex) => {
                const cell = cellsData.find(
                  (cell) =>
                    cell.row_index === rowIndex && cell.col_index === colIndex
                );

                const winnerIndices = winners.reduce((acc, winner, index) => {
                  if (
                    winner.x === cell?.assigned_col_value &&
                    winner.y === cell?.assigned_row_value
                  ) {
                    acc.push(index + 1);
                  }
                  return acc;
                }, [] as number[]);

                const anyWinner = winnerIndices.length > 0;
                return (
                  <td
                    key={colIndex}
                    className={clsx(
                      'border overflow-hidden text-ellipsis relative p-2 text-center whitespace-nowrap',
                      {
                        'font-bold': gridInfo.locked_at && anyWinner,
                      }
                    )}
                  >
                    {gridInfo.locked_at && anyWinner && (
                      <div className="absolute top-0 left-0 bg-green-300/80 border border-green-400 h-4 text-xs text-center rounded rounded-tl-none px-1">
                        {winnerIndices.join(', ')}
                      </div>
                    )}
                    <span className="py-8" title={cell?.assigned_value || ''}>
                      {cell?.assigned_value}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
