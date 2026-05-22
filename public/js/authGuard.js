(async function () {
  try {
    var { data } = await window.supabaseClient.auth.getSession();
    if (!data.session) {
      window.location.href = 'login.html';
    }
  } catch (e) {
    window.location.href = 'login.html';
  }
})();
