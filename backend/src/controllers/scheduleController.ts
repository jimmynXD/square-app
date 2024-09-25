import { Request, Response, NextFunction } from 'express';
import sportsDataService from '../services/sportsDataService';
import supabase from '../utils/SupabaseClient';
import { NFLScheduleTypes } from '../utils/types';

export const updateSchedulesData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const scheduleData: NFLScheduleTypes[] =
      await sportsDataService.fetchNFLScheduleData();

    if (scheduleData.length > 0) {
      const { error } = await supabase
        .from('nfl_schedule')
        .upsert(scheduleData, { onConflict: 'event_id' });
      if (error) {
        return next(error);
      }
    }

    res.status(200).json({ message: 'NFL schedule data updated successfully' });
  } catch (error) {
    next(error);
  }
};
export const getSchedulesData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data, error } = await supabase
      .from('nfl_schedule')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      return next(error);
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
};

// get team schedule by abbreviation
export const getTeamScheduleByAbbreviation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { abbreviation } = req.params;
    const upperAbbreviation = abbreviation.toUpperCase(); // Convert to uppercase

    const { data: teamData, error: teamError } = await supabase
      .from('teams')
      .select('team_id')
      .eq('abbreviation', upperAbbreviation)
      .single();

    if (teamError) {
      return next(teamError);
    }
    if (!teamData) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const { data, error } = await supabase
      .from('nfl_schedule')
      .select('*')
      .or(
        `away_team_id.eq.${teamData.team_id},home_team_id.eq.${teamData.team_id}`
      )
      .order('date', { ascending: true });

    if (error) {
      return next(error);
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
};
