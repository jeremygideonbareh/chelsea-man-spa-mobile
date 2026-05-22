import { createClient } from '@supabase/supabase-js';

const url = 'https://pzbiydpbwrkmjjvhfokm.supabase.co';
const key = 'sb_publishable_bTK6xfHwOuri1jiG4wrmZw_nQigy42y';
const supabase = createClient(url, key);

async function run() {
  console.log('Testing loadBookings query...');
  const { data, error } = await supabase
    .from('bookings')
    .select('*, services(name), stylists(name)')
    .order('start_time', { ascending: false });
    
  if (error) {
    console.error('Query Error:', error.message, error.details);
  } else {
    console.log('Query Success! Data:', data);
  }
}

run();
