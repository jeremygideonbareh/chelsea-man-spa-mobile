document.getElementById('submit-login').addEventListener('click', function () {
  var customId = document.getElementById('custom-id').value.trim().toUpperCase();
  var password = document.getElementById('password').value;
  var email = customId + '@chelseaspa.internal';
  var errEl = document.getElementById('login-error');

  if (!customId || !password) {
    errEl.textContent = 'Please enter both Staff ID and password';
    errEl.style.display = 'block';
    return;
  }

  errEl.style.display = 'none';
  document.getElementById('submit-login').disabled = true;
  document.getElementById('submit-login').textContent = 'Signing in...';

  window.supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
  }).then(function (result) {
    if (result.error) throw result.error;
    var user = result.data.user;
    return window.supabaseClient
      .from('profiles')
      .select('custom_id, role')
      .eq('id', user.id)
      .single()
      .then(function (profileResult) {
        if (profileResult.error) throw profileResult.error;
        console.log('Login Success!', profileResult.data);
        STATE.user = {
          id: user.id,
          custom_id: profileResult.data.custom_id,
          role: profileResult.data.role,
          email: email
        };
        var loading = document.getElementById('loading');
        if (loading) loading.classList.add('hide');
        setTimeout(function () {
          if (typeof boot === 'function') boot();
        }, 500);
      });
  }).catch(function (err) {
    console.error('Login failed:', err.message);
    errEl.textContent = 'Invalid staff ID or password';
    errEl.style.display = 'block';
    document.getElementById('submit-login').disabled = false;
    document.getElementById('submit-login').textContent = 'Sign In';
  });
});
