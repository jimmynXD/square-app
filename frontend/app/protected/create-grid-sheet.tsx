'use client';

import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { GridAPI } from '@/queries/grid.api';
import { useRouter } from 'next/navigation';
import useSupabaseBrowser from '@/utils/supabase/client';
import { useUser } from '@/context/UserContext';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import LoadingOverlay from '@/components/LoadingOverlay';
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
import { ScheduleTypes } from '@/utils/types';
import { Toggle } from '@/components/ui/toggle';

export default function CreateGridSheet() {
  const router = useRouter();
  const supabase = useSupabaseBrowser();
  const { userId } = useUser();

  const [open, setOpen] = useState<boolean>(false);
  const [gridName, setGridName] = useState<string>('');
  const [size] = useState<{ cols: number; rows: number }>({
    cols: 10,
    rows: 10,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [event, setEvent] = useState<string>('');

  const { refetch } = useQuery(GridAPI.v0.getManyGrids(supabase, userId));
  const { data: scheduleData } = useQuery(
    GridAPI.v0.getUpcomingSchedules(supabase)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await GridAPI.v0.createGrid(
      supabase,
      userId,
      gridName,
      size.cols,
      size.rows,
      event
    );

    if (error) {
      console.error('Error creating grid:', error);
      setLoading(false); // Reset loading state
      return;
    }

    const newGridId = data.uuid;

    const { error: cellsError } = await GridAPI.v0.createManyCells(
      supabase,
      newGridId!,
      size.cols,
      size.rows
    );

    if (cellsError) {
      console.error('Error creating grid cells:', cellsError);
      setLoading(false); // Reset loading state
      return;
    }

    const { error: winnersError } = await GridAPI.v0.createWinners(
      supabase,
      newGridId!
    );

    if (winnersError) {
      console.error('Error creating winners:', winnersError);
      setLoading(false); // Reset loading state
      return;
    }

    setOpen(false);
    setLoading(true); // Set loading to true when form is submitted
    refetch();

    router.push(`/protected/${newGridId}`);
  };

  const handleEventChange = useCallback((value: string) => {
    setEvent(value);
  }, []);
  return (
    <>
      <LoadingOverlay isLoading={loading} />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button>Create New Grid</Button>
        </SheetTrigger>
        <SheetContent aria-describedby="create-grid-description">
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
            <div className="f">
              <Label htmlFor="layout">Layout</Label>
              <div>
                <Toggle variant="outline" id="layout" pressed disabled>
                  <span className=" leading-none">10x10</span>
                </Toggle>
              </div>
            </div>
            {/* <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="layout">Layout</Label>
                <ToggleGroup
                  id="layout"
                  variant="outline"
                  type="single"
                  defaultValue="10"
                  disabled
                  onValueChange={(value) => {
                    if (value === '10') setSize({ cols: 10, rows: 10 });
                    if (value === '5') setSize({ cols: 5, rows: 5 });
                  }}
                  className="justify-start"
                >
                  <ToggleGroupItem
                    value="10"
                    aria-label="Toggle bold"
                    defaultChecked
                  >
                    <span className="text-sm w-12 h-4 leading-none">10x10</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem disabled value="5" aria-label="Toggle italic">
                    <span className="text-sm w-12 h-4 leading-none">5x5</span>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div> */}
            <div>
              <Label htmlFor="game">Game</Label>
              <Select onValueChange={handleEventChange}>
                <SelectTrigger className="w-full" id="game">
                  <SelectValue placeholder="Select a game" />
                </SelectTrigger>
                <SelectContent>
                  {scheduleData &&
                    Object.entries(
                      scheduleData.reduce(
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
