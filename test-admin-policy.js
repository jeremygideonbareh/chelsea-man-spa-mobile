import { createClient } from '@supabase/supabase-js';

const url = 'https://pzbiydpbwrkmjjvhfokm.supabase.co';
const key = 'sb_publishable_bTK6xfHwOuri1jiG4wrmZw_nQigy42y';
const supabase = createClient(url, key);

async function run() {
  const timestamp = Date.now();
  const custEmail = `cust_${timestamp}@example.com`;
  const adminEmail = `admin_${timestamp}@example.com`;
  const password = 'password123';

  // Get service
  const { data: services } = await supabase.from('services').select('id').limit(1);
  const serviceId = services?.[0]?.id;
  if (!serviceId) {
    console.error('No service found.');
    return;
  }

  // 1. Sign up and sign in customer
  console.log('1. Signing up customer...');
  const { data: custAuth } = await supabase.auth.signUp({
    email: custEmail,
    password,
    options: { data: { full_name: 'Test Customer Name' } }
  });
  const custId = custAuth.user?.id;
  await supabase.auth.signInWithPassword({ email: custEmail, password });
  await new Promise(r => setTimeout(r, 1000)); // wait for trigger

  // 2. Insert booking as customer
  console.log('2. Inserting booking as customer...');
  const { data: bookingResult, error: bookingErr } = await supabase
    .from('bookings')
    .insert([{
      customer_id: custId,
      service_id: serviceId,
      booking_time: new Date(Date.now() + 86400000).toISOString(),
      status: 'pending'
    }])
    .select();

  if (bookingErr) {
    console.error('Booking insert failed:', bookingErr.message);
    return;
  }
  const bookingId = bookingResult[0].id;
  console.log('Booking inserted with ID:', bookingId);

  // Sign out customer
  await supabase.auth.signOut();

  // 3. Sign up and sign in admin
  console.log('3. Signing up admin...');
  const { data: adminAuth } = await supabase.auth.signUp({
    email: adminEmail,
    password,
    options: { data: { full_name: 'Test Admin Name', role: 'admin' } }
  });
  const adminId = adminAuth.user?.id;
  await supabase.auth.signInWithPassword({ email: adminEmail, password });
  await new Promise(r => setTimeout(r, 1000));

  // 4. Query all bookings as admin
  console.log('4. Querying all bookings as admin...');
  const { data: allBookings, error: selectErr } = await supabase
    .from('bookings')
    .select('*');

  if (selectErr) {
    console.error('Select bookings failed:', selectErr.message);
  } else {
    console.log('Bookings visible to admin:', allBookings);
    const found = allBookings.some(b => b.id === bookingId);
    console.log(`Did admin see the customer booking? ${found ? 'YES!' : 'NO!'}`);
  }
}

run();
