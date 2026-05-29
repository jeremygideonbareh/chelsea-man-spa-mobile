import { createClient } from '@supabase/supabase-js';

const url = 'https://pzbiydpbwrkmjjvhfokm.supabase.co';
const key = 'sb_publishable_bTK6xfHwOuri1jiG4wrmZw_nQigy42y';
const supabase = createClient(url, key);

async function testBooking() {
  // Let's create a user and log in
  const email = `client_${Date.now()}@example.com`;
  const password = 'password123';
  const fullName = 'Client Test Booking';

  console.log('1. Signing up client...');
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
  console.log('Client user ID:', userId);

  console.log('2. Signing in client...');
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (signInError) {
    console.error('Sign in failed:', signInError.message);
    return;
  }

  // Get a service ID from DB
  const { data: services } = await supabase.from('services').select('id').limit(1);
  const serviceId = services?.[0]?.id;
  console.log('Using Service ID:', serviceId);

  if (!serviceId) {
    console.error('No service found in services table. Cannot test booking.');
    return;
  }

  console.log('3. Inserting booking for user ID:', userId);
  const payload = {
    customer_id: userId,
    service_id: serviceId,
    booking_time: new Date(Date.now() + 86400000).toISOString(),
    status: 'pending'
  };

  const { data, error: insertError } = await supabase
    .from('bookings')
    .insert([payload])
    .select();

  if (insertError) {
    console.error('Booking insert failed:', insertError);
  } else {
    console.log('Booking insert succeeded:', data);
  }
}

testBooking();
