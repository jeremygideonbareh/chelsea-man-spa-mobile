console.log('Auth module loaded');
console.log('Supabase status:', typeof window.supabase !== 'undefined' ? supabase : 'not loaded');

async function getSession() {
  var { data, error } = await window.supabaseClient.auth.getSession();
  if (error) return null;
  return data.session;
}

window.signIn = async function (email, password) {
  localStorage.removeItem('userRole');
  localStorage.removeItem('loginTime');

  var { data, error } = await window.supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
  });
  if (error) throw error;

  var role = 'staff';

  if (data && data.user) {
    try {
      var { data: profile } = await window.supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      console.log('User ID:', data.user.id, 'Profile role:', profile ? profile.role : 'no profile');
      role = (profile && profile.role) || 'staff';
    } catch (profileErr) {
      console.warn('Could not fetch profile, defaulting to staff:', profileErr.message);
    }

    localStorage.setItem('userRole', role);
    localStorage.setItem('loginTime', Date.now());
    console.log('Role updated to:', role);
  }

  window.location.href = 'index.html';
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
