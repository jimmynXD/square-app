import { Skeleton } from '@/components/ui/skeleton';
import { useGridContext } from '@/context/GridContext';
import { GridAPI } from '@/queries/grid.api';
import useSupabaseBrowser from '@/utils/supabase/client';
import { formattedScoreboardDate } from '@/utils/utils';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import Image from 'next/image';

interface TeamInfoProps {
  team: {
    logos: { href: string }[];
    display_name: string;
    record: string;
  };
}

const TeamInfo = ({ team }: TeamInfoProps) => (
  <div className="flex flex-col items-center">
    <Image
      src={team.logos[0].href}
      alt={`${team.display_name} logo`}
      width={50}
      height={50}
    />
    <div className="flex flex-col items-center">
      <p>{team.display_name}</p>
      <p className="text-sm">({team.record})</p>
    </div>
  </div>
);

export default function Scoreboard() {
  const supabase = useSupabaseBrowser();
  const { gridInfo } = useGridContext();

  const {
    data: currentScore,
    error,
    isLoading,
  } = useQuery(
    GridAPI.v0.getScore(supabase, gridInfo?.nfl_schedule?.event_id || '')
  );

  if (error) {
    console.error('Error fetching current scores:', error);
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4 items-center">
        <Skeleton className="w-full h-[106px] aspect-square" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-[106px] aspect-square" />
      </div>
    );
  }

  const { dayOfWeek, monthDay, time } = formattedScoreboardDate(
    new Date(gridInfo?.nfl_schedule?.date || '')
  );

  if (currentScore?.game_status === 'pre') {
    return (
      <div className="flex justify-center items-center gap-12">
        {/* away team logo */}
        <TeamInfo team={gridInfo?.nfl_schedule?.away_team} />
        <div className="flex flex-col items-center">
          <p className="text-sm">
            {dayOfWeek} {monthDay}
          </p>
          <p className="font-semibold">{time}</p>
        </div>
        {/* home team logo */}
        <TeamInfo team={gridInfo?.nfl_schedule?.home_team} />
      </div>
    );
  }
  return (
    <div className="flex justify-between">
      <table className="table-fixed">
        <thead>
          <tr>
            <th className="w-16 text-left">Team</th>
            {Array.from({
              length: Math.max(
                4,
                Array.isArray(currentScore?.away_quarter_scores)
                  ? currentScore.away_quarter_scores.length
                  : 0,
                Array.isArray(currentScore?.home_quarter_scores)
                  ? currentScore.home_quarter_scores.length
                  : 0
              ),
            }).map((_, index, arr) => (
              <th key={`quarter-${index}`} className="w-8">
                {arr.length === 5 && index === 4 ? 'O' : index + 1}
              </th>
            ))}
            <th className="w-8">T</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{gridInfo?.nfl_schedule?.away_team?.abbreviation}</td>
            {Array.from({
              length: Math.max(
                4,
                Array.isArray(currentScore?.away_quarter_scores)
                  ? currentScore.away_quarter_scores.length
                  : 0,
                Array.isArray(currentScore?.home_quarter_scores)
                  ? currentScore.home_quarter_scores.length
                  : 0
              ),
            }).map((_, index) => (
              <td key={`away-q${index}`} className="text-center">
                {Array.isArray(currentScore?.away_quarter_scores) &&
                currentScore.away_quarter_scores[index]
                  ? (currentScore.away_quarter_scores[index] as WinnerScoreType)
                      .value
                  : '-'}
              </td>
            ))}
            <td className="text-center">{currentScore?.away_score}</td>
          </tr>
          <tr>
            <td>{gridInfo?.nfl_schedule?.home_team?.abbreviation}</td>
            {Array.from({
              length: Math.max(
                4,
                Array.isArray(currentScore?.away_quarter_scores)
                  ? currentScore.away_quarter_scores.length
                  : 0,
                Array.isArray(currentScore?.home_quarter_scores)
                  ? currentScore.home_quarter_scores.length
                  : 0
              ),
            }).map((_, index) => (
              <td key={`home-q${index}`} className="text-center">
                {Array.isArray(currentScore?.home_quarter_scores) &&
                currentScore.home_quarter_scores[index]
                  ? (currentScore.home_quarter_scores[index] as WinnerScoreType)
                      .value
                  : '-'}
              </td>
            ))}
            <td className="text-center">{currentScore?.home_score}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
