import { createClient } from '@supabase/supabase-js';

const url = 'https://pzbiydpbwrkmjjvhfokm.supabase.co';
const key = 'sb_publishable_bTK6xfHwOuri1jiG4wrmZw_nQigy42y';
const supabase = createClient(url, key);

async function run() {
  const { data: customers, error: e1 } = await supabase.from('customers').select('*');
  console.log('Customers:', customers || e1);

  const { data: bookings, error: e2 } = await supabase.from('bookings').select('*');
  console.log('Bookings:', bookings || e2);

  const { data: profiles, error: e3 } = await supabase.from('profiles').select('*');
  console.log('Profiles:', profiles || e3);
}

run();
