import { Skeleton } from './ui/skeleton';
import { GridAPI } from '@/queries/grid.api';
import useSupabaseBrowser from '@/utils/supabase/client';
import { ScoreTypes } from '@/utils/types';
import { formattedScoreboardDate } from '@/utils/utils';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import Image from 'next/image';
import { useState, useEffect } from 'react';

type TeamInfoProps = {
  team: {
    logos: { href: string }[];
    display_name: string;
    record: string;
  };
};

type ScoreboardScoreProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gridInfo: any;
};
export default function Scoreboard({ gridInfo }: ScoreboardScoreProps) {
  const supabase = useSupabaseBrowser();
  const [liveScore, setLiveScore] = useState<ScoreTypes | null>(null);

  const {
    data: initialScore,
    error,
    isLoading,
  } = useQuery(
    GridAPI.v0.getScore(supabase, gridInfo?.nfl_schedule?.event_id || '')
  );

  useEffect(() => {
    if (!gridInfo?.nfl_schedule?.event_id) return;

    // Set initial score
    if (initialScore) {
      setLiveScore(initialScore);
    }

    // Subscribe to score updates
    const channel = GridAPI.v0.subscribeToScore(
      supabase,
      gridInfo.nfl_schedule.event_id,
      (payload) => {
        if (payload.eventType === 'DELETE') {
          setLiveScore(null);
        } else {
          setLiveScore(payload.new);
        }
      }
    );

    // Cleanup subscription
    return () => {
      channel.unsubscribe();
    };
  }, [supabase, gridInfo?.nfl_schedule?.event_id, initialScore]);

  const currentScore = liveScore;

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
        {currentScore?.game_status === 'pre' && (
          <p className="text-sm">({team.record})</p>
        )}
      </div>
    </div>
  );

  const LiveScore = () => (
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

  return (
    <div className="flex justify-center items-center gap-12">
      {/* away team logo */}
      <TeamInfo team={gridInfo?.nfl_schedule?.away_team} />
      <div className="flex flex-col items-center">
        {currentScore?.game_status === 'pre' ? (
          <>
            <p className="text-sm">
              {dayOfWeek} {monthDay}
            </p>
            <p className="font-semibold">{time}</p>
          </>
        ) : (
          <LiveScore />
        )}
      </div>
      {/* home team logo */}
      <TeamInfo team={gridInfo?.nfl_schedule?.home_team} />
    </div>
  );
}
