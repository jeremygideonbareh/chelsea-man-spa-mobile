// test-signup.js
import { createClient } from '@supabase/supabase-js';

const url = 'https://pzbiydpbwrkmjjvhfokm.supabase.co';
const key = 'sb_publishable_bTK6xfHwOuri1jiG4wrmZw_nQigy42y';

const supabase = createClient(url, key);

async function run() {
  const email = `test_${Date.now()}@chelseaspa.com`;
  const password = 'password123';
  const fullName = 'Test User';

  console.log('Registering user with email:', email);
  try {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (signUpError) {
      console.error('Sign up error:', signUpError.message);
      return;
    }

    console.log('Sign up successful! User ID:', signUpData.user?.id);
    console.log('User status:', signUpData.user?.identities);

    // Let's check if a profile was created
    if (signUpData.user) {
      // Authenticate as the new user to read their own profile (in case RLS permits it)
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        console.log('Sign in immediately after sign up failed:', signInError.message);
      } else {
        console.log('Sign in immediately after sign up succeeded!');
        
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
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

run();
