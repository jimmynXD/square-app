'use client';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { GridAPI } from '@/queries/grid.api';
import useSupabaseBrowser from '@/utils/supabase/client';
import { ScheduleTypes } from '@/utils/types';
import { formattedDate } from '@/utils/utils';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';

type GameSelectDropdownProps = {
  handleEventChange: (eventId: string) => void;
  defaultValue?: string;
};

export default function GameSelectDropdown({
  handleEventChange,
  defaultValue,
}: GameSelectDropdownProps) {
  const supabase = useSupabaseBrowser();

  const { data: scheduleData, isLoading } = useQuery(
    GridAPI.v0.getUpcomingSchedules(supabase)
  );

  function _handleEventChange(eventId: string) {
    console.log('eventId', eventId);
    handleEventChange(eventId);
  }
  if (isLoading) return <Skeleton className="min-w-56 w-full h-10" />;
  return (
    <Select onValueChange={_handleEventChange} defaultValue={defaultValue}>
      <SelectTrigger className="w-full" id="game">
        <SelectValue placeholder="Select a game" />
      </SelectTrigger>
      <SelectContent>
        {scheduleData &&
          Object.entries(
            scheduleData.reduce(
              (acc, game) => {
                const week = game.week ? `Week ${game.week}` : 'Regular Season';
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
                  <SelectItem key={game.event_id} value={game.event_id}>
                    {game.short_name} | {formattedDate(date)}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          ))}
      </SelectContent>
    </Select>
  );
}
