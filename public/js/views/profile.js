/**
 * ============================================================
 * views/profile.js — User Profile View
 * ============================================================
 *
 * Renders the Profile tab, which shows:
 *   - User avatar (initials or photo)
 *   - User name and email
 *   - "My Bookings" link
 *   - Sign In / Sign Out button
 *
 * If the user is not signed in, the auth screen is shown instead
 * (via renderAuth()).
 *
 * DEPENDENCIES:
 *   - state.js (STATE.user)
 *   - auth.js (renderAuthScreen, signOut)
 *   - ui.js (getInitials)
 *   - navigation.js (switchTab)
 *
 * @file   Chelsea Man Spa — Mobile Booking App
 * @author Chelsea Man Spa Development Team
 */

/**
 * Renders the Profile page content.
 *
 * Checks if the user is authenticated. If yes, shows the profile
 * details and links. If no, shows the sign-in prompt.
 *
 * @returns {void}
 */
function renderProfile() {
  var container = document.getElementById('page-profile');
  if (!container) return;

  // If not authenticated, show sign-in screen
  if (!STATE.user || STATE.user.isGuest) {
    container.innerHTML = ''
      + '<div class="scroll full">'
      + renderAuthScreen()
      + '</div>';
    return;
  }

  var user = STATE.user;
  var displayName = user.displayName || 'Guest';
  var email = user.email || '';
  var photoUrl = user.photoURL || '';
  var initials = getInitials(displayName);

  container.innerHTML = ''
    + '<div class="scroll">'

    // Profile header
    + '  <div class="profile-header">'
    + '    <div class="profile-avatar">'
    + (photoUrl
      ? '<img src="' + photoUrl + '" alt="' + displayName + '" onerror="this.style.display=\'none\';this.parentNode.textContent=\'' + initials + '\'" />'
      : initials
    )
    + '    </div>'
    + '    <div class="profile-name">' + displayName + '</div>'
    + '    <div class="profile-email">' + email + '</div>'
    + '  </div>'

    // Quick stats
    + '  <div style="display:flex;gap:12px;padding:0 var(--pad) 24px;">'
    + '    <div style="flex:1;background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:14px;text-align:center;">'
    + '      <div style="font-size:1.25rem;font-weight:600;color:var(--gold);">' + STATE.bookings.length + '</div>'
    + '      <div style="font-size:0.75rem;color:var(--dim);">Booking' + (STATE.bookings.length !== 1 ? 's' : '') + '</div>'
    + '    </div>'
    + '  </div>'

    // Profile links
    + '  <div style="background:var(--card);border:1px solid var(--border);border-radius:var(--radius);margin:0 var(--pad);">'
    + '    <div class="profile-link" onclick="switchTab(\'bookings\')">'
    + '      <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">'
    + '        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>'
    + '        <polyline points="14 2 14 8 20 8"></polyline>'
    + '        <line x1="8" y1="13" x2="16" y2="13"></line>'
    + '        <line x1="8" y1="17" x2="16" y2="17"></line>'
    + '      </svg>'
    + '      <span class="pl-label">My Bookings</span>'
    + '      <span class="pl-arrow">&rsaquo;</span>'
    + '    </div>'
    + '  </div>'

    // Sign out button
    + '  <div style="padding:24px var(--pad);">'
    + '    <button class="btn btn-outline btn-full" onclick="window.signOut()">'
    + '      Sign Out'
    + '    </button>'
    + '  </div>'

    // App info
    + '  <div style="padding:0 var(--pad) 32px;text-align:center;">'
    + '    <div style="font-size:0.75rem;color:var(--dim);">Chelsea Man Spa v1.0</div>'
    + '    <div style="font-size:0.6875rem;color:var(--dim);margin-top:4px;">Dubai Marina, Dubai</div>'
    + '  </div>'

    + '</div>';
}
