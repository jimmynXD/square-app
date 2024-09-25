import { Request, Response, NextFunction } from 'express';
import sportsDataService from '../services/sportsDataService';
import supabase from '../utils/SupabaseClient';
import { NFLGamesOfWeekTypes } from '../utils/types';

export const updateNFLGamesOfWeekData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const gamesData: NFLGamesOfWeekTypes[] =
      await sportsDataService.fetchNFLGamesOfWeekData();

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
      .json({ message: 'NFL games of week data updated successfully' });
  } catch (error) {
    next(error);
  }
};

// get all teams information
export const getNFLGamesOfWeekData = async (
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
      .from('games')
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
