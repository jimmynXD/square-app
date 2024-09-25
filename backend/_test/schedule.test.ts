import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import supabase from '../src/utils/SupabaseClient';
import sportsDataService from '../src/services/sportsDataService';

describe('Schedule Controller', () => {
  describe('getSchedulesData', () => {
    it('should retrieve all schedules data', async () => {
      const mockData = [
        {
          event_id: 1,
          date: '2023-10-01',
          home_team_id: 1,
          away_team_id: 2,
          name: 'Game 1',
          season_type: 'Regular',
          season_type_id: 1,
          season_year: 2023,
          short_name: 'G1',
          venue: 'Stadium 1',
          week: 1,
        },
        {
          event_id: 2,
          date: '2023-10-08',
          home_team_id: 2,
          away_team_id: 1,
          name: 'Game 2',
          season_type: 'Regular',
          season_type_id: 1,
          season_year: 2023,
          short_name: 'G2',
          venue: 'Stadium 2',
          week: 2,
        },
      ];

      const mockSelect = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
        }),
      });

      vi.spyOn(supabase, 'from').mockImplementation(() => mockSelect());

      const response = await request(app).get('/api/schedule');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });
  });

  describe('getTeamScheduleByAbbreviation', () => {
    it('should retrieve a team schedule by abbreviation', async () => {
      const abbreviation = 'ABC';
      const mockTeam = { team_id: 1 };
      const mockSchedule = [
        {
          event_id: 1,
          date: '2023-10-01',
          home_team_id: 1,
          away_team_id: 2,
          name: 'Game 1',
          season_type: 'Regular',
          season_type_id: 1,
          season_year: 2023,
          short_name: 'G1',
          venue: 'Stadium 1',
          week: 1,
        },
      ];

      const mockTeamSelect = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockTeam, error: null }),
          }),
        }),
      });

      const mockScheduleSelect = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          or: vi.fn().mockReturnValue({
            order: vi
              .fn()
              .mockResolvedValue({ data: mockSchedule, error: null }),
          }),
        }),
      });

      vi.spyOn(supabase, 'from').mockImplementation((table) => {
        if (table === 'teams') return mockTeamSelect();
        if (table === 'nfl_schedule') return mockScheduleSelect();
        return null;
      });

      const response = await request(app).get(`/api/schedule/${abbreviation}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSchedule);
    });
  });

  describe('updateSchedulesData', () => {
    it('should update schedules data', async () => {
      const mockData = [
        {
          event_id: 1,
          date: '2023-10-01',
          home_team_id: 1,
          away_team_id: 2,
          name: 'Game 1',
          season_type: 'Regular',
          season_type_id: 1,
          season_year: 2023,
          short_name: 'G1',
          venue: 'Stadium 1',
          week: 1,
        },
        {
          event_id: 2,
          date: '2023-10-08',
          home_team_id: 2,
          away_team_id: 1,
          name: 'Game 2',
          season_type: 'Regular',
          season_type_id: 1,
          season_year: 2023,
          short_name: 'G2',
          venue: 'Stadium 2',
          week: 2,
        },
      ];

      vi.spyOn(sportsDataService, 'fetchNFLScheduleData').mockResolvedValue(
        mockData
      );

      const mockUpsert = vi.fn().mockResolvedValue({ error: null });
      vi.spyOn(supabase, 'from').mockReturnValue({
        upsert: mockUpsert,
      } as any);

      const response = await request(app).put('/api/schedule/update');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'NFL schedule data updated successfully',
      });
      expect(mockUpsert).toHaveBeenCalledWith(mockData, {
        onConflict: 'event_id',
      });
    });
  });
});
