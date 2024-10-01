'use client';

import { useGridContext } from '@/context/GridContext';

export default function ClientGrid() {
  const { cellsData, gridInfo } = useGridContext();

  return (
    <div>
      <table className="w-full table-fixed border-collapse border-spacing-0">
        <thead>
          <tr className="">
            <th />
            {Array.from({ length: gridInfo.num_cols }).map((_, colIndex) => (
              <th
                key={colIndex}
                className="border bg-secondary text-secondary-foreground"
              >
                {
                  cellsData.find((cell) => cell.col_index === colIndex)
                    ?.assigned_col_value
                }
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: gridInfo.num_rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              <th className="bg-secondary text-secondary-foreground border">
                {
                  cellsData.find((cell) => cell.row_index === rowIndex)
                    ?.assigned_row_value
                }
              </th>
              {Array.from({ length: gridInfo.num_cols }).map((_, colIndex) => (
                <td key={colIndex} className="border">
                  {
                    cellsData.find(
                      (cell) =>
                        cell.row_index === rowIndex &&
                        cell.col_index === colIndex
                    )?.assigned_value
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
