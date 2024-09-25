import { Request, Response, NextFunction } from 'express';
import sportsDataService from '../services/sportsDataService';
import supabase from '../utils/SupabaseClient';
import { TeamTypes } from '../utils/types';

// get all teams information
export const updateTeamsData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const teamData: TeamTypes[] = await sportsDataService.fetchTeamData();
    if (teamData.length > 0) {
      const { error } = await supabase.from('teams').upsert(teamData, {
        onConflict: 'team_id',
      });
      if (error) {
        next(error);
      }
    }
    res.status(200).json({ message: 'Teams data updated successfully' });
  } catch (error) {
    next(error);
  }
};

// get all teams information
export const getTeamsData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data, error: fetchError } = await supabase
      .from('teams')
      .select('*')
      .order('display_name', { ascending: true });

    if (fetchError) {
      next(fetchError);
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
};

// get team by abbreviation
export const getTeamByAbbreviation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { abbreviation } = req.params;
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('abbreviation', abbreviation)
      .single();

    if (error) {
      next(error);
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
};
