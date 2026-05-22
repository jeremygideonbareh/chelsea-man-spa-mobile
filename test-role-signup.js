import { createClient } from '@supabase/supabase-js';

const url = 'https://pzbiydpbwrkmjjvhfokm.supabase.co';
const key = 'sb_publishable_bTK6xfHwOuri1jiG4wrmZw_nQigy42y';
const supabase = createClient(url, key);

async function run() {
  const email = `admin_test_${Date.now()}@chelseaspa.com`;
  const password = 'password123';
  const fullName = 'Admin Test User';

  console.log('Registering user with role metadata:', email);
  try {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name: fullName,
          role: 'admin'
        },
      },
    });

    if (signUpError) {
      console.error('Sign up error:', signUpError.message);
      return;
    }

    console.log('Sign up successful! User ID:', signUpData.user?.id);

    if (signUpData.user) {
      // Authenticate as the new user
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        console.log('Sign in failed:', signInError.message);
        return;
      }

      console.log('Sign in succeeded!');

      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', signUpData.user.id)
        .single();

      if (profileError) {
        console.log('Profile fetch error:', profileError.message);
      } else {
        console.log('Created Profile:', profile);
      }
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

run();
