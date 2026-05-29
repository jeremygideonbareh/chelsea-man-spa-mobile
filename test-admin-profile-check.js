import { createClient } from '@supabase/supabase-js';

const url = 'https://pzbiydpbwrkmjjvhfokm.supabase.co';
const key = 'sb_publishable_bTK6xfHwOuri1jiG4wrmZw_nQigy42y';
const supabase = createClient(url, key);

async function run() {
  const timestamp = Date.now();
  const adminEmail = `admin_check_${timestamp}@example.com`;
  const password = 'password123';

  console.log('1. Signing up admin:', adminEmail);
  const { data: signUpData } = await supabase.auth.signUp({
    email: adminEmail,
    password,
    options: {
      data: {
        full_name: 'Admin Check Profile',
        role: 'admin'
      }
    }
  });
  const adminId = signUpData.user?.id;
  console.log('Admin user ID:', adminId);

  // Sign in
  await supabase.auth.signInWithPassword({ email: adminEmail, password });
  await new Promise(r => setTimeout(r, 1500)); // wait for trigger

  console.log('2. Querying profiles for admin ID:', adminId);
  const { data: profiles, error: pErr } = await supabase
    .from('profiles')
    .select('*');
  console.log('Profiles returned:', profiles, 'Error:', pErr?.message);

  console.log('3. Querying customers for admin ID:', adminId);
  const { data: customers, error: cErr } = await supabase
    .from('customers')
    .select('*');
  console.log('Customers returned:', customers, 'Error:', cErr?.message);
}

run();
