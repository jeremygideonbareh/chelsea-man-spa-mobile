import { createClient } from '@supabase/supabase-js';

const url = 'https://pzbiydpbwrkmjjvhfokm.supabase.co';
const key = 'sb_publishable_bTK6xfHwOuri1jiG4wrmZw_nQigy42y';
const supabase = createClient(url, key);

async function run() {
  console.log('Testing bookings query with customer/services joins...');
  const { data, error } = await supabase
    .from('bookings')
    .select('*, services(name), customers(full_name)')
    .order('booking_time', { ascending: false });
    
  if (error) {
    console.error('Query Error:', error.message, error.details);
  } else {
    console.log('Query Success! Data:', data);
  }
}

run();
