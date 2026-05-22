console.log('Auth module loaded');
console.log('Supabase status:', typeof window.supabase !== 'undefined' ? supabase : 'not loaded');

async function getSession() {
  var { data, error } = await window.supabaseClient.auth.getSession();
  if (error) return null;
  return data.session;
}

window.signIn = async function (email, password) {
  try {
    localStorage.removeItem('userRole');
    localStorage.removeItem('loginTime');

    var { data, error } = await window.supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (!data || !data.user) {
      alert('Login failed. Please try again.');
      return;
    }

    localStorage.setItem('loginTime', Date.now());

    var { data: profile, error: profileErr } = await window.supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profile) {
      localStorage.setItem('userRole', profile.role);
      window.location.href = 'index.html';
      return;
    }

    var { data: customer, error: custErr } = await window.supabaseClient
      .from('customers')
      .select('id')
      .eq('email', data.user.email)
      .maybeSingle();

    if (customer) {
      localStorage.setItem('userRole', 'customer');
      window.location.href = 'client-dashboard.html';
      return;
    }

    await window.supabaseClient.auth.signOut();
    alert('Account type not recognized.');

  } catch (err) {
    console.error('Sign in error:', err);
    alert('An unexpected error occurred. Please try again.');
  }
};

window.handleSignUp = async function (fullName, email, password) {
  try {
    var { data, error } = await window.supabaseClient.auth.signUp({
      email: email,
      password: password
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (data && data.user) {
      var { error: insertErr } = await window.supabaseClient
        .from('customers')
        .insert([{ id: data.user.id, email: email, name: fullName }]);

      if (insertErr) console.warn('Could not save customer profile:', insertErr.message);
    }

    alert('Account created! You can now log in');
    window.location.href = 'login.html';

  } catch (err) {
    console.error('Sign up error:', err);
    alert('An unexpected error occurred. Please try again.');
  }
};

async function signOut() {
  localStorage.removeItem('userRole');
  var { error } = await window.supabaseClient.auth.signOut();
  if (error) throw error;
}

async function logout() {
  await window.supabaseClient.auth.signOut();
  localStorage.clear();
  sessionStorage.clear();
  location.reload();
}

function onAuthStateChange(callback) {
  window.supabaseClient.auth.onAuthStateChange(function (event, session) {
    if (event === 'SIGNED_OUT') {
      localStorage.removeItem('userRole');
    }
    callback(event, session);
  });
}

async function requireAuth() {
  var session = await getSession();
  if (!session) {
    localStorage.removeItem('userRole');
    window.location.href = 'login.html';
    return null;
  }

  var currentRole = localStorage.getItem('userRole');
  if (!currentRole && session.user) {
    var { data: profile } = await window.supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    var role = (profile && profile.role) || 'staff';
    localStorage.setItem('userRole', role);
  }

  return session;
}

async function checkSessionExpiration() {
  var loginTime = localStorage.getItem('loginTime');
  if (loginTime) {
    var hoursElapsed = (Date.now() - loginTime) / (1000 * 60 * 60);
    if (hoursElapsed > 1) {
      await window.supabaseClient.auth.signOut();
      window.location.href = 'login.html';
    }
  }
}

checkSessionExpiration();
