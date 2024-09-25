import { createClient } from '@supabase/supabase-js';
import { TypedSupabaseClient } from './types';
import dotenv from 'dotenv';

dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Key');
}

const supabase: TypedSupabaseClient = createClient(supabaseUrl, supabaseKey);

export default supabase;
