import { createClient } from '@supabase/supabase-js';

const url = 'https://pzbiydpbwrkmjjvhfokm.supabase.co';
const key = 'sb_publishable_bTK6xfHwOuri1jiG4wrmZw_nQigy42y';
const supabase = createClient(url, key);

async function run() {
  const email = `test_meta_${Date.now()}@example.com`;
  const password = 'password123';

  console.log('Registering user with multiple metadata fields...');
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: 'FullName With Underscore',
        name: 'Just Name',
        fullName: 'FullName CamelCase',
        display_name: 'Display Name Underscore',
        displayName: 'Display Name CamelCase'
      }
    }
  });

  if (signUpError) {
    console.error('Sign up failed:', signUpError.message);
    return;
  }

  const userId = signUpData.user?.id;
  console.log('User ID:', userId);

  // Sign in
  await supabase.auth.signInWithPassword({ email, password });

  // Query customers table
  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('id', userId);

  console.log('Customer row in DB:', customer);
}

run();
