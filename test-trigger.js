import { createClient } from '@supabase/supabase-js';

const url = 'https://pzbiydpbwrkmjjvhfokm.supabase.co';
const key = 'sb_publishable_bTK6xfHwOuri1jiG4wrmZw_nQigy42y';
const supabase = createClient(url, key);

async function testTrigger() {
  const email = `test_trig_${Date.now()}@example.com`;
  const password = 'password123';
  const fullName = 'Trigger Test User';

  console.log('1. Signing up user:', email);
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }
    }
  });

  if (signUpError) {
    console.error('Sign up failed:', signUpError.message);
    return;
  }

  const userId = signUpData.user?.id;
  console.log('User ID:', userId);

  console.log('2. Signing in user...');
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (signInError) {
    console.error('Sign in failed:', signInError.message);
    return;
  }

  console.log('3. Querying profile for ID:', userId);
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId);

  console.log('Profile result:', profile, 'Error:', profileErr?.message);

  console.log('4. Querying customer for ID:', userId);
  const { data: customer, error: customerErr } = await supabase
    .from('customers')
    .select('*')
    .eq('id', userId);

  console.log('Customer result:', customer, 'Error:', customerErr?.message);
}

testTrigger();
