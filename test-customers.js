// test-customers.js
import { createClient } from '@supabase/supabase-js';

const url = 'https://pzbiydpbwrkmjjvhfokm.supabase.co';
const key = 'sb_publishable_bTK6xfHwOuri1jiG4wrmZw_nQigy42y';

const supabase = createClient(url, key);

async function run() {
  console.log('Fetching customers...');
  try {
    const { data: customers, error } = await supabase
      .from('customers')
      .select('*')
      .order('id', { ascending: false })
      .limit(5);
    
    if (error) {
      console.log('Database error:', error.message);
    } else {
      console.log('Last 5 customers:', customers);
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

run();
