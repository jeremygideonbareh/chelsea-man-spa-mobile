import { createClient } from '@supabase/supabase-js';

const url = 'https://pzbiydpbwrkmjjvhfokm.supabase.co';
const key = 'sb_publishable_bTK6xfHwOuri1jiG4wrmZw_nQigy42y';
const supabase = createClient(url, key);

async function run() {
  const { data: services } = await supabase.from('services').select('id').limit(1);
  const serviceId = services?.[0]?.id;
  if (!serviceId) {
    console.error('No service found.');
    return;
  }

  console.log('--- Test 1: Anonymous booking insert with customer_id = null ---');
  const { data: d1, error: e1 } = await supabase
    .from('bookings')
    .insert([{
      service_id: serviceId,
      booking_time: new Date(Date.now() + 86400000).toISOString(),
      status: 'pending'
    }])
    .select();

  if (e1) {
    console.log('Anon booking insert failed:', e1.message);
  } else {
    console.log('Anon booking insert succeeded:', d1);
  }

  // Let's sign in a client user
  const email = `client_null_${Date.now()}@example.com`;
  const password = 'password123';
  await supabase.auth.signUp({ email, password });
  await supabase.auth.signInWithPassword({ email, password });

  console.log('--- Test 2: Authenticated booking insert with customer_id = null ---');
  const { data: d2, error: e2 } = await supabase
    .from('bookings')
    .insert([{
      service_id: serviceId,
      booking_time: new Date(Date.now() + 86400000).toISOString(),
      status: 'pending'
    }])
    .select();

  if (e2) {
    console.log('Auth booking insert failed:', e2.message);
  } else {
    console.log('Auth booking insert succeeded:', d2);
  }
}

run();
