import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import supabase from '../src/utils/SupabaseClient';
import sportsDataService from '../src/services/sportsDataService';

describe('Team Controller', () => {
  describe('getTeamsData', () => {
    it('should retrieve all teams data', async () => {
      // Mock the data returned by fetchTeamData
      const mockData = [
        {
          team_id: 1,
          abbreviation: 'ABC',
          display_name: 'Team ABC',
          alternate_color: '000000',
          color: 'FFFFFF',
          is_active: true,
          location: 'Location ABC',
          logos: [],
          name: 'ABC',
          nickname: 'ABC',
          short_display_name: 'ABC',
          slug: 'abc',
          uid: 'uid1',
        },
        {
          team_id: 2,
          abbreviation: 'XYZ',
          display_name: 'Team XYZ',
          alternate_color: '111111',
          color: '222222',
          is_active: true,
          location: 'Location XYZ',
          logos: [],
          name: 'XYZ',
          nickname: 'XYZ',
          short_display_name: 'XYZ',
          slug: 'xyz',
          uid: 'uid2',
        },
      ];

      // Mock the fetchTeamData function
      vi.spyOn(sportsDataService, 'fetchTeamData').mockResolvedValue(
        mockData as any
      );

      // Mock the supabase response
      const mockSelect = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
        }),
      });

      vi.spyOn(supabase, 'from').mockImplementation(() => mockSelect());

      const response = await request(app).get('/v0/api/team');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });
  });

  describe('getTeamByAbbreviation', () => {
    it('should retrieve a team by abbreviation', async () => {
      const abbreviation = 'ABC';
      const mockTeam = {
        team_id: 1,
        abbreviation: 'ABC',
        display_name: 'Team ABC',
        alternate_color: '000000',
        color: 'FFFFFF',
        is_active: true,
        location: 'Location ABC',
        logos: [],
        name: 'ABC',
        nickname: 'ABC',
        short_display_name: 'ABC',
        slug: 'abc',
        uid: 'uid1',
      };

      // Mock the supabase response
      const mockSelect = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockTeam, error: null }),
          }),
        }),
      });

      vi.spyOn(supabase, 'from').mockImplementation(() => mockSelect());

      const response = await request(app).get(`/v0/api/team/${abbreviation}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTeam);
    });
  });

  describe('updateTeamsData', () => {
    it('should update teams data', async () => {
      // Mock the data returned by fetchTeamData
      const mockData = [
        {
          team_id: 1,
          abbreviation: 'ABC',
          display_name: 'Team ABC',
          alternate_color: '000000',
          color: 'FFFFFF',
          is_active: true,
          location: 'Location ABC',
          logos: [],
          name: 'ABC',
          nickname: 'ABC',
          short_display_name: 'ABC',
          slug: 'abc',
          uid: 'uid1',
        },
        {
          team_id: 2,
          abbreviation: 'XYZ',
          display_name: 'Team XYZ',
          alternate_color: '111111',
          color: '222222',
          is_active: true,
          location: 'Location XYZ',
          logos: [],
          name: 'XYZ',
          nickname: 'XYZ',
          short_display_name: 'XYZ',
          slug: 'xyz',
          uid: 'uid2',
        },
      ];

      // Mock the fetchTeamData function
      vi.spyOn(sportsDataService, 'fetchTeamData').mockResolvedValue(
        mockData as any
      );

      // Mock the supabase upsert response
      const mockUpsert = vi.fn().mockResolvedValue({ error: null });
      vi.spyOn(supabase, 'from').mockReturnValue({
        upsert: mockUpsert,
      } as any);

      const response = await request(app).put('/v0/api/team/update');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Teams data updated successfully',
      });
      expect(mockUpsert).toHaveBeenCalledWith(mockData, {
        onConflict: 'team_id',
      });
    });
  });
});
