import axios from 'axios';
import { convertToDisplayClock } from '../utils/utils';
import {
  NFLScheduleTypes,
  TeamTypes,
  NFLGamesOfWeekTypes,
  NFLGameScoreTypes,
} from '../utils/types';
import dotenv from 'dotenv';

dotenv.config();

const fetchTeamData = async (): Promise<TeamTypes[]> => {
  try {
    const response = await axios.get(process.env.NFL_TEAMS_ENDPOINT!);
    // get records from each team through the abbreviation at end of nfl_teams_endpoint
    const teamsPromises = response.data.sports[0].leagues[0].teams.map(
      async (teamData: any) => {
        const team = teamData.team;
        const teamAbbreviation = team.abbreviation;

        let record = 'N/A';
        try {
          const teamRecord = await axios.get(
            `${process.env.NFL_TEAMS_ENDPOINT!}/${teamAbbreviation}`
          );

          record = teamRecord.data.team.record.items[0].summary;
        } catch (recordError) {
          console.warn(
            `Failed to fetch record for team ${teamAbbreviation}:`,
            recordError
          );
        }
        return {
          abbreviation: team.abbreviation,
          alternate_color: team.alternateColor,
          color: team.color,
          display_name: team.displayName,
          is_active: team.isActive,
          location: team.location,
          logos: team.logos,
          name: team.name,
          nickname: team.nickname,
          short_display_name: team.shortDisplayName,
          slug: team.slug,
          team_id: team.id,
          uid: team.uid,
          record,
        } as TeamTypes;
      }
    );
    const teams = await Promise.all(teamsPromises);
    return teams;
  } catch (error) {
    console.error('Error fetching team data:', error);
    throw error;
  }
};

const fetchNFLScheduleData = async (): Promise<NFLScheduleTypes[]> => {
  try {
    const teams = await fetchTeamData();
    const teamAbbreviations = teams.map((team) => team.abbreviation);

    const schedulePromises = teamAbbreviations.map((abbreviation) =>
      axios.get(
        process.env.NFL_SCHEDULE_ENDPOINT!.replace('{team}', abbreviation)
      )
    );

    const scheduleResponses = await Promise.all(schedulePromises);

    const scheduleData = scheduleResponses.flatMap((response) => {
      return response.data.events.map((event: any) => ({
        away_team_id: event.competitions[0].competitors.find(
          (comp: any) => comp.homeAway === 'away'
        ).team.id,
        date: event.date,
        event_id: event.id,
        home_team_id: event.competitions[0].competitors.find(
          (comp: any) => comp.homeAway === 'home'
        ).team.id,
        name: event.name,
        season_type: event.seasonType.name,
        season_type_id: event.seasonType.id,
        season_year: event.season.year,
        short_name: event.shortName,
        venue: event.competitions[0].venue.fullName,
        week: event.week.number,
      }));
    });

    // Filter out duplicate events based on event_id
    const uniqueScheduleData = Array.from(
      new Map(scheduleData.map((event) => [event.event_id, event])).values()
    );

    return uniqueScheduleData;
  } catch (error) {
    console.error('Error fetching NFL schedule data:', error);
    throw error;
  }
};

const fetchLiveScoresData = async (): Promise<NFLGameScoreTypes[]> => {
  try {
    const response = await axios.get(process.env.NFL_LIVE_SCOREBOARD_ENDPOINT!);

    const scoresData = response.data.events.flatMap((event: any) => ({
      event_id: event.id,
      game_status: event.status.type.state,
      home_score: parseInt(
        event.competitions[0].competitors.find(
          (comp: any) => comp.homeAway === 'home'
        ).score,
        10
      ),
      away_score: parseInt(
        event.competitions[0].competitors.find(
          (comp: any) => comp.homeAway === 'away'
        ).score,
        10
      ),
      home_quarter_scores: event.competitions[0].competitors.find(
        (comp: any) => comp.homeAway === 'home'
      ).linescores,
      away_quarter_scores: event.competitions[0].competitors.find(
        (comp: any) => comp.homeAway === 'away'
      ).linescores,
      current_quarter: event.status.period,
      current_time_left: convertToDisplayClock(event.status.displayClock),
    }));

    return scoresData;
  } catch (error) {
    console.error('Error fetching NFL games of the week data:', error);
    throw error;
  }
};

const fetchAllScoresData = async (): Promise<NFLGameScoreTypes[]> => {
  try {
    const fullSchedule = await fetchNFLScheduleData();
    const eventIds = fullSchedule.map((event) => event.event_id);

    const scoresPromises = eventIds.map((eventId) =>
      axios.get(
        process.env.NFL_GAME_SCORE_ENDPOINT!.replace('{eventId}', eventId)
      )
    );

    const scoresResponse = await Promise.all(scoresPromises);

    const combinedScoresData = scoresResponse.flatMap((response) => {
      const games = Array.isArray(response.data)
        ? response.data
        : [response.data];

      return games.map((game: any) => ({
        event_id: game.id,
        game_status: game.status.type.state,
        home_score:
          parseInt(
            game.competitions[0].competitors.find(
              (comp: any) => comp.homeAway === 'home'
            ).score,
            10
          ) || 0,
        away_score:
          parseInt(
            game.competitions[0].competitors.find(
              (comp: any) => comp.homeAway === 'away'
            ).score,
            10
          ) || 0,
        home_quarter_scores: game.competitions[0].competitors.find(
          (comp: any) => comp.homeAway === 'home'
        ).linescores,
        away_quarter_scores: game.competitions[0].competitors.find(
          (comp: any) => comp.homeAway === 'away'
        ).linescores,
        current_quarter: game.status.period!,
        current_time_left: convertToDisplayClock(game.status.displayClock),
      }));
    }) as NFLGameScoreTypes[];

    return combinedScoresData;
  } catch (error) {
    console.error('Error fetching NFL games of the week data:', error);
    throw error;
  }
};
export default {
  fetchTeamData,
  fetchNFLScheduleData,
  fetchLiveScoresData,
  fetchAllScoresData,
};
