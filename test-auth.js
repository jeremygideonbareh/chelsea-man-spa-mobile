// test-auth.js
import { createClient } from '@supabase/supabase-js';

const url = 'https://pzbiydpbwrkmjjvhfokm.supabase.co';
const key = 'sb_publishable_bTK6xfHwOuri1jiG4wrmZw_nQigy42y';

const supabase = createClient(url, key);

async function run() {
  console.log('Testing Supabase Client connection...');
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@chelseaspa.com', // Let's try some dummy email
      password: 'password123'
    });
    
    if (error) {
      console.log('Auth error returned:', error.message, 'Status:', error.status);
    } else {
      console.log('Auth success returned:', data);
    }
  } catch (err) {
    console.error('Exception thrown:', err);
  }
}

run();
