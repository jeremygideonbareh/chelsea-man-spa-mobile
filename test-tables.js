import { createClient } from '@supabase/supabase-js';

const url = 'https://pzbiydpbwrkmjjvhfokm.supabase.co';
const key = 'sb_publishable_bTK6xfHwOuri1jiG4wrmZw_nQigy42y';
const supabase = createClient(url, key);

async function run() {
  const tables = ['profiles', 'customers', 'services', 'bookings', 'stylists'];
  for (const table of tables) {
    console.log(`Checking table '${table}'...`);
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`  Table '${table}' error:`, error.message);
      } else {
        console.log(`  Table '${table}' success! Rows fetched:`, data.length);
        if (data.length > 0) {
          console.log(`  Sample row:`, data[0]);
        }
      }
    } catch (e) {
      console.log(`  Exception for '${table}':`, e.message);
    }
  }
}

run();
