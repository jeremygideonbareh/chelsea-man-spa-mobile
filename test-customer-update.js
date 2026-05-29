import { createClient } from '@supabase/supabase-js';

const url = 'https://pzbiydpbwrkmjjvhfokm.supabase.co';
const key = 'sb_publishable_bTK6xfHwOuri1jiG4wrmZw_nQigy42y';
const supabase = createClient(url, key);

async function run() {
  const email = `test_upd_wait_${Date.now()}@example.com`;
  const password = 'password123';
  const fullName = 'Update User Name';

  console.log('1. Signing up user...');
  const { data: signUpData } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  });

  const userId = signUpData.user?.id;
  console.log('User ID:', userId);

  // Sign in
  await supabase.auth.signInWithPassword({ email, password });

  // Wait 1.5 seconds for trigger/DB replication
  await new Promise(r => setTimeout(r, 1500));

  console.log('2. Fetching customer row before update...');
  const { data: before } = await supabase
    .from('customers')
    .select('*')
    .eq('id', userId);
  console.log('Before update:', before);

  console.log('3. Attempting to update customer full_name...');
  const { data: updateResult, error: updateErr } = await supabase
    .from('customers')
    .update({ full_name: fullName })
    .eq('id', userId)
    .select();

  if (updateErr) {
    console.log('Update failed:', updateErr.message);
  } else {
    console.log('Update result:', updateResult);
  }

  console.log('4. Fetching customer row after update...');
  const { data: after } = await supabase
    .from('customers')
    .select('*')
    .eq('id', userId);
  console.log('After update:', after);
}

run();
