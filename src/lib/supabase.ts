import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL loaded:', !!supabaseUrl);
console.log('Supabase Key loaded:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables — check .env.local');
}

const url = supabaseUrl || 'https://pzbiydpbwrkmjjvhfokm.supabase.co';
const key = supabaseKey || 'sb_publishable_bTK6xfHwOuri1jiG4wrmZw_nQigy42y';

export const supabase = createClient<Database>(url, key);
