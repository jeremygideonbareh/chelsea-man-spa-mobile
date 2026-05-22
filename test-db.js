// test-db.js
import { createClient } from '@supabase/supabase-js';

const url = 'https://pzbiydpbwrkmjjvhfokm.supabase.co';
const key = 'sb_publishable_bTK6xfHwOuri1jiG4wrmZw_nQigy42y';

const supabase = createClient(url, key);

async function run() {
  console.log('Fetching profiles...');
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    
    if (error) {
      console.log('Database error:', error.message);
    } else {
      console.log('Profiles in DB:', data);
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

run();
