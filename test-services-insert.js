import { createClient } from '@supabase/supabase-js';

const url = 'https://pzbiydpbwrkmjjvhfokm.supabase.co';
const key = 'sb_publishable_bTK6xfHwOuri1jiG4wrmZw_nQigy42y';
const supabase = createClient(url, key);

async function run() {
  console.log('Inserting test service...');
  try {
    const { data, error } = await supabase
      .from('services')
      .insert([{ name: 'Test Haircut', price: 150, duration: 45 }]);
    
    if (error) {
      console.log('Services insert error:', error.message);
    } else {
      console.log('Services insert success:', data);
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

run();
