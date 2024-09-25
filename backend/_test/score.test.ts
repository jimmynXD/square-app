import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import supabase from '../src/utils/SupabaseClient';
import sportsDataService from '../src/services/sportsDataService';

describe('Score Controller', () => {
  describe('getNFLGamesOfWeekData', () => {
    it('should retrieve all NFL games of the week data', async () => {
      const mockData = [
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
          current_time_left: 0, // changed to seconds
          completed: true,
        },
        {
          event_id: 2,
          home_score: 14,
          away_score: 21,
          home_quarter_scores: [
            { value: 0.0 },
            { value: 7.0 },
            { value: 7.0 },
            { value: 0.0 },
          ],
          away_quarter_scores: [
            { value: 7.0 },
            { value: 7.0 },
            { value: 0.0 },
            { value: 7.0 },
          ],
          game_status: 'post',
          current_quarter: 4,
          current_time_left: 0, // changed to seconds
          completed: true,
        },
      ];

      const mockSelect = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
        }),
      });

      vi.spyOn(supabase, 'from').mockImplementation(() => mockSelect());

      const response = await request(app).get('/api/score');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });
  });

  describe('getGameByEventId', () => {
    it('should retrieve a game by event ID', async () => {
      const eventId = '1';
      const mockGame = {
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
        current_time_left: 0, // changed to seconds
        completed: true,
      };

      const mockSelect = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockGame, error: null }),
          }),
        }),
      });

      vi.spyOn(supabase, 'from').mockImplementation(() => mockSelect());

      const response = await request(app).get(`/api/score/${eventId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockGame);
    });
  });

  describe('updateNFLGamesOfWeekData', () => {
    it('should update NFL games of the week data', async () => {
      const mockData = [
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
          game_status: 'completed',
          current_quarter: 4,
          current_time_left: 0, // changed to seconds
          completed: true,
        },
        {
          event_id: 2,
          home_score: 14,
          away_score: 21,
          home_quarter_scores: [
            { value: 0.0 },
            { value: 7.0 },
            { value: 7.0 },
            { value: 0.0 },
          ],
          away_quarter_scores: [
            { value: 7.0 },
            { value: 7.0 },
            { value: 0.0 },
            { value: 7.0 },
          ],
          game_status: 'completed',
          current_quarter: 4,
          current_time_left: 0, // changed to seconds
          completed: true,
        },
      ];
      vi.spyOn(sportsDataService, 'fetchNFLGamesOfWeekData').mockResolvedValue(
        mockData as any
      );

      const mockUpsert = vi.fn().mockResolvedValue({ error: null });
      vi.spyOn(supabase, 'from').mockReturnValue({
        upsert: mockUpsert,
      } as any);

      const response = await request(app).put('/api/score/update');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'NFL games of week data updated successfully',
      });
      expect(mockUpsert).toHaveBeenCalledWith(mockData, {
        onConflict: 'event_id',
      });
    });
  });
});
