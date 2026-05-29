import { createClient } from '@supabase/supabase-js';

const url = 'https://pzbiydpbwrkmjjvhfokm.supabase.co';
const key = 'sb_publishable_bTK6xfHwOuri1jiG4wrmZw_nQigy42y';
const supabase = createClient(url, key);

async function testInsert() {
  const email = `test_opt_${Date.now()}@example.com`;
  const fullName = `Test Option User`;

  console.log('--- Test 1: Anonymous insert without ID ---');
  const { data: d1, error: e1 } = await supabase
    .from('customers')
    .insert([{ full_name: fullName, email }])
    .select();
  if (e1) {
    console.log('Anon insert without ID failed:', e1.message);
  } else {
    console.log('Anon insert without ID succeeded:', d1);
  }

  console.log('--- Test 2: Anonymous insert with random UUID ID ---');
  const randomUuid = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  const { data: d2, error: e2 } = await supabase
    .from('customers')
    .insert([{ id: randomUuid, full_name: fullName + ' UUID', email: 'uuid_' + email }])
    .select();
  if (e2) {
    console.log('Anon insert with UUID ID failed:', e2.message);
  } else {
    console.log('Anon insert with UUID ID succeeded:', d2);
  }

  // Now register and log in a user
  console.log('\nRegistering a test customer user...');
  const userEmail = `cust_${Date.now()}@example.com`;
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: userEmail,
    password: 'password123',
    options: {
      data: { full_name: 'Auth Customer' }
    }
  });

  if (signUpError) {
    console.error('Sign up failed:', signUpError.message);
    return;
  }

  const userId = signUpData.user?.id;
  console.log('Signed up user ID:', userId);

  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: userEmail,
    password: 'password123'
  });

  if (signInError) {
    console.error('Sign in failed:', signInError.message);
    return;
  }

  console.log('Authenticated session active.');

  console.log('--- Test 3: Authenticated customer insert without ID ---');
  const { data: d3, error: e3 } = await supabase
    .from('customers')
    .insert([{ full_name: 'Auth Customer Name', email: userEmail }])
    .select();
  if (e3) {
    console.log('Auth insert without ID failed:', e3.message);
  } else {
    console.log('Auth insert without ID succeeded:', d3);
  }

  console.log('--- Test 4: Authenticated customer insert with ID = auth.uid() ---');
  const { data: d4, error: e4 } = await supabase
    .from('customers')
    .insert([{ id: userId, full_name: 'Auth Customer with ID', email: 'id_' + userEmail }])
    .select();
  if (e4) {
    console.log('Auth insert with ID = auth.uid() failed:', e4.message);
  } else {
    console.log('Auth insert with ID = auth.uid() succeeded:', d4);
  }
}

testInsert();
