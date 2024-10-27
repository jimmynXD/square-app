import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './generated/database.types';

export type TypedSupabaseClient = SupabaseClient<Database>;

export type TeamTypes = Database['public']['Tables']['teams']['Row'];

export type NFLScheduleTypes =
  Database['public']['Tables']['nfl_schedule']['Row'];

export type NFLGamesOfWeekTypes =
  Database['public']['Tables']['nfl_scores']['Row'];

export type NFLGameScoreTypes =
  Database['public']['Tables']['nfl_scores']['Row'];
