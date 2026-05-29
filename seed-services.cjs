const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://pzbiydpbwrkmjjvhfokm.supabase.co',
  'sb_publishable_bTK6xfHwOuri1jiG4wrmZw_nQigy42y'
);

const services = [
  { name: 'Hair Cut & Beard', price: 190, duration_minutes: 60, description: 'Complete haircut with beard trim and shaping.' },
  { name: "Men's Hair Cut", price: 130, duration_minutes: 30, description: 'Precision haircut tailored to your style.' },
  { name: 'Skin Fade (Perfect Skin Fade Hair Cut)', price: 160, duration_minutes: 30, description: 'Perfect skin fade haircut for a clean look.' },
  { name: 'Buzz Cut', price: 110, duration_minutes: 20, description: 'Quick and clean buzz cut.' },
  { name: 'Kids Hair Cut (Juniors)', price: 110, duration_minutes: 30, description: 'Haircut for juniors in a comfortable setting.' },
  { name: 'Line Up & Clean The Neck (From the back)', price: 55, duration_minutes: 15, description: 'Neat line up and neck clean-up.' },
  { name: 'Hair Wash and Blow Dry', price: 80, duration_minutes: 15, description: 'Refreshing hair wash with blow dry finish.' },
  { name: 'Shades of Colors (Zero Ammonia)', price: 160, duration_minutes: 15, description: 'Ammonia-free color shades for a natural look.' },
  { name: 'Hair Color for Men', price: 160, duration_minutes: 40, description: 'Professional hair color application for men.' },
  { name: 'Silver Hair Color', price: 600, duration_minutes: 60, description: 'Premium silver hair color treatment.' },
  { name: 'Highlights (Short Hair)', price: 360, duration_minutes: 60, description: 'Professional highlights for short hair.' },
  { name: 'Highlights (Long Hair)', price: 485, duration_minutes: 60, description: 'Professional highlights for long hair.' },
  { name: 'Beard Color / Dye', price: 80, duration_minutes: 15, description: 'Beard color and dye application.' },
  { name: 'Mask Hair Treatment (Deep conditioning)', price: 150, duration_minutes: 15, description: 'Deep conditioning mask treatment for healthy hair.' },
  { name: 'Keratin Treatment', price: 550, duration_minutes: 60, description: 'Smoothing keratin treatment for frizz-free hair.' },
  { name: 'Collagen Hair Treatment', price: 600, duration_minutes: 60, description: 'Collagen hair restoration treatment.' },
  { name: 'Beard Style (Trim/Shaping)', price: 80, duration_minutes: 30, description: 'Beard trim and shaping for a sharp look.' },
  { name: 'Royal Shave Spa', price: 160, duration_minutes: 30, description: 'Luxurious straight razor shave with hot towels.' },
  { name: 'Shave (Razor / Straight Razor)', price: 65, duration_minutes: 15, description: 'Clean shave with razor or straight razor.' },
  { name: 'Express Shave Machine', price: 60, duration_minutes: 15, description: 'Quick and precise machine shave.' },
  { name: 'Manicure', price: 90, duration_minutes: 30, description: 'Professional manicure for well-groomed hands.' },
  { name: 'Pedicure', price: 120, duration_minutes: 45, description: 'Professional pedicure for refreshed feet.' },
  { name: 'Manicure & Pedicure', price: 190, duration_minutes: 60, description: 'Complete hand and foot grooming package.' },
  { name: 'Spa Manicure', price: 150, duration_minutes: 60, description: 'Luxury spa manicure experience.' },
  { name: 'Spa Pedicure', price: 180, duration_minutes: 60, description: 'Luxury spa pedicure experience.' },
  { name: 'Nails Cut & Shape', price: 60, duration_minutes: 60, description: 'Nail cutting and shaping service.' },
  { name: 'Paraffin Wax Treatments (Feet and Hands)', price: 200, duration_minutes: 60, description: 'Paraffin wax treatment for soft hands and feet.' },
  { name: 'Soothing Facial', price: 250, duration_minutes: 60, description: 'Relaxing and rejuvenating facial treatment.' },
  { name: 'Facial Deep Cleansing Skin', price: 400, duration_minutes: 60, description: 'Deep cleansing facial for clear, healthy skin.' },
  { name: 'Facial for Sensitive Skin', price: 350, duration_minutes: 60, description: 'Gentle facial treatment for sensitive skin.' },
  { name: 'Face Massage', price: 50, duration_minutes: 15, description: 'Quick face massage for relaxation.' },
  { name: 'Underarms Waxing', price: 60, duration_minutes: 60, description: 'Underarm waxing for smooth skin.' },
  { name: 'Full Arms/Legs Wax Hair Removal', price: 150, duration_minutes: 60, description: 'Full arm or leg waxing service.' },
  { name: 'Full Chest Wax Hair Removal', price: 100, duration_minutes: 60, description: 'Full chest waxing for a smooth look.' },
  { name: 'Full Back Wax Hair Removal', price: 150, duration_minutes: 60, description: 'Full back waxing service.' },
];

(async () => {
  let { data: oldServices } = await supabase.from('services').select('id');
  if (oldServices && oldServices.length > 0) {
    const oldIds = oldServices.map(s => s.id);
    const { error: bkErr } = await supabase.from('bookings').delete().in('service_id', oldIds);
    if (bkErr) console.error('Booking delete error:', bkErr.message);
    const { error: delErr } = await supabase.from('services').delete().in('id', oldIds);
    if (delErr) { console.error('Delete error:', delErr.message); return; }
    console.log('Cleared ' + oldServices.length + ' old service(s)');
  } else {
    console.log('No old services to clear');
  }

  const { data, error } = await supabase.from('services').insert(services).select();
  if (error) { console.error('Insert error:', error.message); return; }
  console.log('Inserted ' + data.length + ' services:');
  data.forEach(s => console.log('  - ' + s.name + ' (AED ' + s.price + ')'));
})();
