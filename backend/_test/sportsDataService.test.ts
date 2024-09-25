import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import sportsDataService from '../src/services/sportsDataService';
import {
  TeamTypes,
  NFLScheduleTypes,
  NFLGamesOfWeekTypes,
} from '../src/utils/types';

vi.mock('axios');

describe('sportsDataService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('fetchTeamData', () => {
    it('should fetch and return team data', async () => {
      const mockResponse = {
        data: {
          sports: [
            {
              leagues: [
                {
                  teams: [
                    {
                      team: {
                        abbreviation: 'ABC',
                        alternateColor: '000000',
                        color: 'FFFFFF',
                        displayName: 'Team ABC',
                        isActive: true,
                        location: 'Location ABC',
                        logos: [],
                        name: 'ABC',
                        nickname: 'ABC',
                        shortDisplayName: 'ABC',
                        slug: 'abc',
                        id: 1,
                        uid: 'uid1',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      };

      vi.spyOn(axios, 'get').mockResolvedValue(mockResponse);

      const result = await sportsDataService.fetchTeamData();
      expect(result).toEqual([
        {
          abbreviation: 'ABC',
          alternate_color: '000000',
          color: 'FFFFFF',
          display_name: 'Team ABC',
          is_active: true,
          location: 'Location ABC',
          logos: [],
          name: 'ABC',
          nickname: 'ABC',
          short_display_name: 'ABC',
          slug: 'abc',
          team_id: 1,
          uid: 'uid1',
        },
      ] as TeamTypes[]);
    });

    it('should throw an error if fetching team data fails', async () => {
      vi.spyOn(axios, 'get').mockRejectedValue(new Error('Network Error'));

      await expect(sportsDataService.fetchTeamData()).rejects.toThrow(
        'Network Error'
      );
    });
  });

  describe('fetchNFLScheduleData', () => {
    it('should fetch and return NFL schedule data', async () => {
      const mockTeamsResponse = {
        data: {
          sports: [
            {
              leagues: [
                {
                  teams: [
                    {
                      team: {
                        abbreviation: 'ABC',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      };

      const mockScheduleResponse = {
        data: {
          events: [
            {
              id: 1,
              date: '2023-10-01',
              competitions: [
                {
                  competitors: [
                    { homeAway: 'home', team: { id: 1 } },
                    { homeAway: 'away', team: { id: 2 } },
                  ],
                  venue: { fullName: 'Stadium 1' },
                },
              ],
              name: 'Game 1',
              seasonType: { name: 'Regular', id: 1 },
              season: { year: 2023 },
              shortName: 'G1',
              week: { number: 1 },
            },
          ],
        },
      };

      vi.spyOn(axios, 'get')
        .mockResolvedValueOnce(mockTeamsResponse)
        .mockResolvedValueOnce(mockScheduleResponse);

      const result = await sportsDataService.fetchNFLScheduleData();
      expect(result).toEqual([
        {
          away_team_id: 2,
          date: '2023-10-01',
          event_id: 1,
          home_team_id: 1,
          name: 'Game 1',
          season_type: 'Regular',
          season_type_id: 1,
          season_year: 2023,
          short_name: 'G1',
          venue: 'Stadium 1',
          week: 1,
        },
      ] as NFLScheduleTypes[]);
    });

    it('should throw an error if fetching schedule data fails', async () => {
      vi.spyOn(axios, 'get').mockRejectedValue(new Error('Network Error'));

      await expect(sportsDataService.fetchNFLScheduleData()).rejects.toThrow(
        'Network Error'
      );
    });
  });

  describe('fetchNFLGamesOfWeekData', () => {
    it('should fetch and return NFL games of the week data', async () => {
      const mockResponse = {
        data: {
          events: [
            {
              id: 1,
              competitions: [
                {
                  competitors: [
                    {
                      homeAway: 'home',
                      score: '24',
                      linescores: [
                        { value: 7.0 },
                        { value: 7.0 },
                        { value: 7.0 },
                        { value: 3.0 },
                      ],
                    },
                    {
                      homeAway: 'away',
                      score: '17',
                      linescores: [
                        { value: 3.0 },
                        { value: 7.0 },
                        { value: 7.0 },
                        { value: 0.0 },
                      ],
                    },
                  ],
                },
              ],
              status: {
                type: { state: 'post', completed: true },
                period: 4,
                displayClock: '0:00',
              },
            },
          ],
        },
      };

      vi.spyOn(axios, 'get').mockResolvedValue(mockResponse);

      const result = await sportsDataService.fetchNFLGamesOfWeekData();
      expect(result).toEqual([
        {
          event_id: 1,
          home_score: 24,
          away_score: 17,
          home_quarter_scores: [
            { value: 7.0 },
            { value: 7.0 },
            { value: 7.0 },
            { value: 3.0 },
          ],
          away_quarter_scores: [
            { value: 3.0 },
            { value: 7.0 },
            { value: 7.0 },
            { value: 0.0 },
          ],
          game_status: 'post',
          current_quarter: 4,
          current_time_left: Number(0),
          completed: true,
        },
      ] as NFLGamesOfWeekTypes[]);
    });

    it('should throw an error if fetching games of the week data fails', async () => {
      vi.spyOn(axios, 'get').mockRejectedValue(new Error('Network Error'));

      await expect(sportsDataService.fetchNFLGamesOfWeekData()).rejects.toThrow(
        'Network Error'
      );
    });
  });
});
