'use client';

import { useGridContext } from '@/context/GridContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardFooter } from './ui/card';
import clsx from 'clsx';
import { Skeleton } from './ui/skeleton';
import { Fragment } from 'react';
import { Lock } from 'lucide-react';

export default function ClientGrid() {
  const {
    gridData,
    name,
    setName,
    bulkCount,
    setBulkCount,
    handleAssign,
    handleRandomAssign,
    handleDelete,
    handleReset,
    handleGenerateAssignments,
    numCols,
    numRows,
    rowAssignments,
    colAssignments,
    assignmentsGenerated,
    numEmptyCells,
  } = useGridContext();

  const twGridCols = {
    1: 'grid-cols-[2rem_repeat(1,7rem)]',
    2: 'grid-cols-[2rem_repeat(2,7rem)]',
    3: 'grid-cols-[2rem_repeat(3,7rem)]',
    4: 'grid-cols-[2rem_repeat(4,7rem)]',
    5: 'grid-cols-[2rem_repeat(5,7rem)]',
    6: 'grid-cols-[2rem_repeat(6,7rem)]',
    7: 'grid-cols-[2rem_repeat(7,7rem)]',
    8: 'grid-cols-[2rem_repeat(8,7rem)]',
    9: 'grid-cols-[2rem_repeat(9,7rem)]',
    10: 'grid-cols-[2rem_repeat(10,7rem)]',
  };
  console.log(numEmptyCells);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-end">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            className="border p-2 rounded"
            disabled={assignmentsGenerated || !numEmptyCells}
          />
        </div>
        <div className="grid w-full max-w-20 items-center gap-1.5">
          <Label htmlFor="bulkCount"># Squares</Label>
          <Input
            type="number"
            id="bulkCount"
            min={1}
            max={numEmptyCells || ''}
            value={bulkCount}
            onChange={(e) =>
              setBulkCount(Math.min(Number(e.target.value), numEmptyCells || 0))
            }
            placeholder="Enter bulk count"
            className="border p-2 rounded"
            disabled={assignmentsGenerated || !numEmptyCells}
          />
        </div>
        <Button
          variant={'default'}
          disabled={!name || assignmentsGenerated || !numEmptyCells}
          onClick={() => handleRandomAssign(bulkCount)}
        >
          Assign Name to Random Cell
        </Button>
        <Button
          variant={'destructive'}
          onClick={handleReset}
          disabled={assignmentsGenerated}
        >
          Reset Grid
        </Button>
        <Button
          variant={assignmentsGenerated ? 'ghost' : 'default'}
          onClick={handleGenerateAssignments}
          disabled={rowAssignments.length > 0 && colAssignments.length > 0}
        >
          {assignmentsGenerated ? (
            <Lock className="w-4 h-4" />
          ) : (
            'Generate Assignments'
          )}
        </Button>
      </div>
      <div
        className={`justify-center grid ${twGridCols[numCols as keyof typeof twGridCols]} gap-2`}
      >
        <div className="w-8" />
        {Array.from({ length: numCols }, (_, col) => (
          <div key={col} className="min-w-28">
            {colAssignments ? (
              <div className="h-8 flex items-center justify-center bg-secondary text-secondary-foreground font-bold">
                {colAssignments
                  .find((assignment) => assignment.col === col)
                  ?.value.toString() || ''}
              </div>
            ) : (
              <Skeleton className="w-full h-8" />
            )}
          </div>
        ))}
        {Array.from({ length: numRows }, (_, row) => (
          <Fragment key={`row-${row}`}>
            <div className="w-8">
              {rowAssignments ? (
                <div className="h-full flex items-center justify-center bg-secondary text-secondary-foreground font-bold">
                  {rowAssignments
                    .find((assignment) => assignment.row === row)
                    ?.value.toString() || ''}
                </div>
              ) : (
                <Skeleton className="h-full" />
              )}
            </div>
            {gridData.slice(row * numCols, (row + 1) * numCols).map((cell) => (
              <Card
                key={`${cell.row}-${cell.col}`}
                className={clsx('w-28 aspect-square ', {
                  'bg-green-400 border-green-600': cell.name,
                })}
              >
                <CardContent>{cell.name || ''}</CardContent>
                <CardFooter>
                  {!assignmentsGenerated && // Add this condition
                    (cell.name ? (
                      <Button
                        variant={'destructive'}
                        size={'sm'}
                        onClick={() => handleDelete(cell.uuid as string)}
                      >
                        Delete
                      </Button>
                    ) : (
                      <Button
                        size={'sm'}
                        disabled={!name}
                        onClick={() => handleAssign(cell.uuid as string)}
                      >
                        Assign
                      </Button>
                    ))}
                </CardFooter>
              </Card>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
