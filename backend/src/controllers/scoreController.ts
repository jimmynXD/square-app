import { Request, Response, NextFunction } from 'express';
import sportsDataService from '../services/sportsDataService';
import supabase from '../utils/SupabaseClient';
import { NFLGameScoreTypes } from '../utils/types';

// get all teams information
export const getNFLGameScoresData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data, error: fetchError } = await supabase
      .from('nfl_scores')
      .select('*')
      .order('event_id', { ascending: true });

    if (fetchError) {
      next(fetchError);
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
};

// get scores by event id. it may have multiple rows for one event id
export const getGameByEventId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;
    const { data, error } = await supabase
      .from('nfl_scores')
      .select('*')
      .eq('event_id', eventId)
      .single();

    if (error) {
      next(error);
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
};

// run once a week
export const updateNFLGameScoresData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const gamesData: NFLGameScoreTypes[] =
      await sportsDataService.fetchAllScoresData();

    if (gamesData.length > 0) {
      const { error } = await supabase.from('nfl_scores').upsert(gamesData, {
        onConflict: 'event_id',
      });
      if (error) {
        return next(error);
      }
    }
    res
      .status(200)
      .json({ message: 'Full NFL game scores data updated successfully' });
  } catch (error) {
    next(error);
  }
};

// run on game days every 5 minutes
export const updateLiveScoresData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const gamesData: NFLGameScoreTypes[] =
      await sportsDataService.fetchLiveScoresData();

    if (gamesData.length > 0) {
      for (const game of gamesData) {
        const { error } = await supabase
          .from('nfl_scores')
          .update(game)
          .eq('event_id', game.event_id);
        if (error) {
          return next(error);
        }
      }
    }
    res.status(200).json({ message: 'Updated Live NFL games successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateLiveScoresAndWinnersData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const gamesData: NFLGameScoreTypes[] =
      await sportsDataService.fetchLiveScoresData();

    if (gamesData.length > 0) {
      for (const game of gamesData) {
        const { error } = await supabase
          .from('nfl_scores')
          .update(game)
          .eq('event_id', game.event_id);
        if (error) {
          return next(error);
        }

        const { data: gridIds, error: gridError } = await supabase
          .from('grids')
          .select('uuid')
          .eq('event_id', game.event_id);

        if (gridError) {
          return next(gridError);
        }

        // Then, fetch winners for these grids
        const { data: winnersData, error: winnersError } = await supabase
          .from('winners')
          .select('grid_id, status')
          .in(
            'grid_id',
            gridIds.map((grid) => grid.uuid)
          )
          .or('status.is.null,status.neq.post');

        if (!winnersData) {
          return next(new Error('No winners data found'));
        }

        if (winnersError) {
          return next(winnersError);
        }

        for (const grid of winnersData) {
          await updateWinnersDataForGrid(grid.grid_id!, game.event_id);
        }
      }
    }
    res
      .status(200)
      .json({ message: 'Updated live NFL games and winners successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateWinnerData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { gridId } = req.params;

  try {
    // Fetch the current status and event ID for the given grid
    const { data: winnerData, error: winnerError } = await supabase
      .from('winners')
      .select('grids (event_id), status')
      .eq('grid_id', gridId)
      .single();

    if (winnerError) {
      return next(winnerError);
    }

    await updateWinnersDataForGrid(gridId, winnerData.grids!.event_id!);

    res.status(200).json({ message: 'Winners data updated successfully' });

    res.status(200).json({ message: 'Winners data updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateAllWinnersData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Fetch all winners rows that don't have 'post' status
    const { data: winnersToUpdate, error: fetchError } = await supabase
      .from('winners')
      .select('grid_id, grids (event_id)')
      .or('status.is.null,status.neq.post');

    if (!winnersToUpdate) {
      return res.status(200).json({ message: 'No winners data to update' });
    }

    if (fetchError) {
      return next(fetchError);
    }

    // Update each winner row
    for (const winner of winnersToUpdate) {
      await updateWinnersDataForGrid(winner.grid_id!, winner.grids?.event_id!);
    }

    res.status(200).json({ message: 'All winners data updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Helper function to update winners data for a single grid
async function updateWinnersDataForGrid(gridId: string, eventId: string) {
  // Fetch the scores for the event
  const { data: scoresData, error: scoresError } = await supabase
    .from('nfl_scores')
    .select('*')
    .eq('event_id', eventId)
    .single();

  if (scoresError) {
    throw scoresError;
  }

  // If game hasn't started, skip this grid
  if (scoresData.game_status === 'pre') {
    return;
  }

  // Get cells_assignment
  const { data: cellsAssignmentData, error: cellsAssignmentError } =
    await supabase.from('cell_assignments').select('*').eq('grid_id', gridId);

  if (cellsAssignmentError) {
    throw cellsAssignmentError;
  }

  // Calculate winners (reuse logic from updateWinnersData)
  const winners = calculateWinners(scoresData, cellsAssignmentData);

  // Update the winners in the database
  const { error: updateError } = await supabase
    .from('winners')
    .update({ winners, status: scoresData.game_status })
    .eq('grid_id', gridId);

  if (updateError) {
    throw updateError;
  }
}

// Helper function to calculate winners (extracted from updateWinnersData)
function calculateWinners(scoresData: any, cellsAssignmentData: any[]) {
  const homeScores = (scoresData.home_quarter_scores as any[]).map(
    (q: any) => q.value
  );
  const awayScores = (scoresData.away_quarter_scores as any[]).map(
    (q: any) => q.value
  );

  // Calculate cumulative scores for each quarter
  const cumulativeHomeScores = homeScores.map((_, i) =>
    homeScores.slice(0, i + 1).reduce((acc, val) => acc + val, 0)
  );
  const cumulativeAwayScores = awayScores.map((_, i) =>
    awayScores.slice(0, i + 1).reduce((acc, val) => acc + val, 0)
  );

  // Calculate winners for each quarter
  const winners = [];
  const maxQuarters = Math.min(3, cumulativeHomeScores.length - 1);
  for (let i = 0; i < maxQuarters; i++) {
    const homeScore = cumulativeHomeScores[i] % 10;
    const awayScore = cumulativeAwayScores[i] % 10;
    const winner = cellsAssignmentData.find(
      (cell: any) =>
        cell.assigned_row_value === homeScore &&
        cell.assigned_col_value === awayScore
    )?.assigned_value;
    winners.push({
      name: winner,
      quarter: i + 1,
      score: `${cumulativeAwayScores[i]}-${cumulativeHomeScores[i]}`,
      x: awayScore,
      y: homeScore,
    });
  }

  // Handle final score for completed games
  if (scoresData.game_status === 'post') {
    const homeScore =
      cumulativeHomeScores[cumulativeHomeScores.length - 1] % 10;
    const awayScore =
      cumulativeAwayScores[cumulativeAwayScores.length - 1] % 10;
    const winner = cellsAssignmentData.find(
      (cell: any) =>
        cell.assigned_row_value === homeScore &&
        cell.assigned_col_value === awayScore
    )?.assigned_value;
    winners.push({
      name: winner,
      quarter: cumulativeHomeScores.length === 5 ? '4/OT' : 4,
      score: `${cumulativeAwayScores[cumulativeAwayScores.length - 1]}-${cumulativeHomeScores[cumulativeHomeScores.length - 1]}`,
      x: awayScore,
      y: homeScore,
    });
  }

  return winners;
}
