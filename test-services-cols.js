import { createClient } from '@supabase/supabase-js';

const url = 'https://pzbiydpbwrkmjjvhfokm.supabase.co';
const key = 'sb_publishable_bTK6xfHwOuri1jiG4wrmZw_nQigy42y';
const supabase = createClient(url, key);

async function run() {
  console.log('Testing inserting a service with category and image_url...');
  const { data, error } = await supabase.from('services').insert([
    {
      name: 'Test Category Service',
      description: 'Test description',
      price: 100,
      duration_minutes: 30,
      category: 'Hair',
      image_url: 'images/test.jpg'
    }
  ]).select();

  if (error) {
    console.error('Insert error:', error.message, error.details);
  } else {
    console.log('Insert succeeded! Row:', data);
    
    // Clean it up
    console.log('Cleaning up...');
    const { error: delError } = await supabase.from('services').delete().eq('id', data[0].id);
    if (delError) {
      console.error('Error cleaning up:', delError);
    } else {
      console.log('Clean up succeeded.');
    }
  }
}

run();
