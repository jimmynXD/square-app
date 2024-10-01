import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './generated/database.types';

export type TypedSupabaseClient = SupabaseClient<Database>;

export type CellTypes = Database['public']['Tables']['cell_assignments']['Row'];
export type ScheduleTypes = Database['public']['Tables']['nfl_schedule']['Row'];

export type GridInfoType = Database['public']['Tables']['grids']['Row'] & {
  nfl_schedule: ScheduleTypes;
};
