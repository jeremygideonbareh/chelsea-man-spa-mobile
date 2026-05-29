import { createClient } from '@supabase/supabase-js';

const url = 'https://pzbiydpbwrkmjjvhfokm.supabase.co';
const key = 'sb_publishable_bTK6xfHwOuri1jiG4wrmZw_nQigy42y';
const supabase = createClient(url, key);

async function testProfiles() {
  const timestamp = Date.now();
  const password = 'password123';

  // Test 1: Staff role
  const email1 = `staff_p_${timestamp}@example.com`;
  console.log('1. Signing up staff user:', email1);
  const { data: u1 } = await supabase.auth.signUp({
    email: email1,
    password,
    options: { data: { role: 'staff' } }
  });
  await supabase.auth.signInWithPassword({ email: email1, password });
  
  const { data: d1, error: e1 } = await supabase
    .from('profiles')
    .insert([{ id: u1.user?.id, role: 'staff' }])
    .select();
  
  console.log('Staff insert result:', d1, 'Error:', e1?.message);
  await supabase.auth.signOut();

  // Test 2: Admin role
  const email2 = `admin_p_${timestamp}@example.com`;
  console.log('\n2. Signing up admin user:', email2);
  const { data: u2 } = await supabase.auth.signUp({
    email: email2,
    password,
    options: { data: { role: 'admin' } }
  });
  await supabase.auth.signInWithPassword({ email: email2, password });

  const { data: d2, error: e2 } = await supabase
    .from('profiles')
    .insert([{ id: u2.user?.id, role: 'admin' }])
    .select();

  console.log('Admin insert result:', d2, 'Error:', e2?.message);
  await supabase.auth.signOut();
}

testProfiles();
