'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { GridAPI } from '@/queries/grid.api';
import { useRouter } from 'next/navigation';
import useSupabaseBrowser from '@/utils/supabase/client';
import { useUser } from '@/context/UserContext';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import LoadingOverlay from './LoadingOverlay';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Database } from '@/utils/generated/database.types';
import { formattedDate } from '@/utils/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';

export type ScheduleTypes = Database['public']['Tables']['nfl_schedule']['Row'];

export function CreateGridSheet() {
  const [open, setOpen] = useState(false);
  const [gridName, setGridName] = useState('');
  const [numCols, setNumCols] = useState(10);
  const [numRows, setNumRows] = useState(10);
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState('');

  const router = useRouter();
  const supabase = useSupabaseBrowser();
  const { userId } = useUser();

  const { refetch } = useQuery(GridAPI.getAll(supabase, userId));
  const { data: schedule } = useQuery(GridAPI.getSchedule(supabase));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await GridAPI.addGrid(
      supabase,
      userId,
      gridName,
      numCols,
      numRows,
      event
    );

    if (error) {
      console.error('Error creating grid:', error);
      setLoading(false); // Reset loading state
      return;
    }

    const newGridId = data.uuid;

    const { error: cellsError } = await GridAPI.createGridCells(
      supabase,
      newGridId!,
      numCols,
      numRows
    );

    if (cellsError) {
      console.error('Error creating grid cells:', cellsError);
      setLoading(false); // Reset loading state
      return;
    }
    setOpen(false);
    setLoading(true); // Set loading to true when form is submitted
    refetch();

    router.push(`/protected/${newGridId}`);
  };

  return (
    <>
      <LoadingOverlay isLoading={loading} />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button>Create New Grid</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Create New Grid</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-8 mt-4">
            <div>
              <Label htmlFor="gridName">Grid Name</Label>
              <Input
                id="gridName"
                value={gridName}
                onChange={(e) => setGridName(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="numCols">Columns</Label>
                <ToggleGroup
                  variant="outline"
                  type="single"
                  value={String(numCols)}
                  onValueChange={(value) => {
                    if (value) setNumCols(Number(value));
                  }}
                  className="justify-start"
                >
                  <ToggleGroupItem value="10" aria-label="Toggle bold">
                    <span className="text-sm w-4 h-4 leading-none">10</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="5" aria-label="Toggle italic">
                    <span className="text-sm w-4 h-4 leading-none">5</span>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div>
                <Label htmlFor="numRows">Rows</Label>
                <ToggleGroup
                  variant="outline"
                  type="single"
                  value={String(numRows)}
                  onValueChange={(value) => {
                    if (value) setNumRows(Number(value));
                  }}
                  className="justify-start"
                >
                  <ToggleGroupItem value="10" aria-label="Toggle bold">
                    <span className="text-sm w-4 h-4 leading-none">10</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="5" aria-label="Toggle italic">
                    <span className="text-sm w-4 h-4 leading-none">5</span>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
            <div>
              <Select onValueChange={(value) => setEvent(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a game" />
                </SelectTrigger>
                <SelectContent>
                  {schedule &&
                    Object.entries(
                      schedule.reduce(
                        (acc, game) => {
                          const week = game.week
                            ? `Week ${game.week}`
                            : 'Regular Season';
                          if (!acc[week]) acc[week] = [];
                          acc[week].push(game);
                          return acc;
                        },
                        {} as Record<string, ScheduleTypes[]>
                      )
                    ).map(([week, games]) => (
                      <SelectGroup key={week}>
                        <SelectLabel>{week}</SelectLabel>
                        {games.map((game) => {
                          // show date as SEP 10 @ 10:00AM
                          const date = new Date(game.date);

                          return (
                            <SelectItem
                              key={game.event_id}
                              value={game.event_id}
                            >
                              {game.short_name} | {formattedDate(date)}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" type="submit">
              Create Grid
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
