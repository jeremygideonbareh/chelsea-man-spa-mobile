// test-insert.js
import { createClient } from '@supabase/supabase-js';

const url = 'https://pzbiydpbwrkmjjvhfokm.supabase.co';
const key = 'sb_publishable_bTK6xfHwOuri1jiG4wrmZw_nQigy42y';

const supabase = createClient(url, key);

async function run() {
  const email = `test_insert_${Date.now()}@chelseaspa.com`;
  const password = 'password123';
  const fullName = 'Insert Test User';

  console.log('Signing up user:', email);
  try {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (signUpError) {
      console.error('Sign up failed:', signUpError.message);
      return;
    }

    const userId = signUpData.user?.id;
    console.log('Sign up succeeded! ID:', userId);

    // Let's log in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      console.error('Sign in failed:', signInError.message);
      return;
    }

    console.log('Sign in succeeded! Session Active.');

    // Try inserting into profiles table
    console.log('Attempting to insert into profiles...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([{ id: userId, role: 'customer' }]);

    if (profileError) {
      console.log('Profiles insert failed:', profileError.message);
    } else {
      console.log('Profiles insert succeeded:', profileData);
    }

    // Try inserting into customers table
    console.log('Attempting to insert into customers...');
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .insert([{ id: userId, full_name: fullName, email }]);

    if (customerError) {
      console.log('Customers insert failed:', customerError.message);
    } else {
      console.log('Customers insert succeeded:', customerData);
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

run();
