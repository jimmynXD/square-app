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
    if (!teamData || teamData.length === 0) {
      return res.status(404).json({ message: 'No team data found' });
    }

    const { error } = await supabase.from('teams').upsert(teamData, {
      onConflict: 'team_id',
    });

    if (error) {
      return next(error);
    }

    return res.status(200).json({ message: 'Teams data updated successfully' });
  } catch (error) {
    return next(error);
  }
};

// get all teams information
export const getTeamsData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('display_name', { ascending: true });

    if (error) {
      return next(error);
    }

    return res.json(data);
  } catch (error) {
    return next(error);
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
    const uppercaseAbbreviation = abbreviation.toUpperCase();
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('abbreviation', uppercaseAbbreviation)
      .single();

    if (error) {
      return next(error);
    }

    return res.json(data);
  } catch (error) {
    return next(error);
  }
};
