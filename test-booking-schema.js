import { createClient } from '@supabase/supabase-js';

const url = 'https://pzbiydpbwrkmjjvhfokm.supabase.co';
const key = 'sb_publishable_bTK6xfHwOuri1jiG4wrmZw_nQigy42y';
const supabase = createClient(url, key);

async function testColumn(colName) {
  const { data, error } = await supabase.from('bookings').select(colName).limit(1);
  if (error) {
    console.log(`Column '${colName}': Error ->`, error.message);
  } else {
    console.log(`Column '${colName}': Success!`);
  }
}

async function run() {
  const columns = [
    'id',
    'customer_id',
    'service_id',
    'booking_time',
    'status',
    'created_at',
    'stylist_id',
    'start_time',
    'customer_name'
  ];
  
  for (const col of columns) {
    await testColumn(col);
  }
}

run();
