/**
 * ============================================================
 * auth.js — Firebase Authentication (Google Sign-In via Redirect)
 * ============================================================
 *
 * Handles all authentication flows:
 *   1. Google Sign-In via redirect (required for mobile Safari)
 *   2. Sign-out
 *   3. Auth state change listener (wired in app.js)
 *
 * DESIGN RATIONALE:
 *   Firebase Auth offers two flows — popup and redirect. Safari on
 *   iOS blocks window.open() calls from async contexts, so popups
 *   fail silently. The redirect flow navigates the full page to
 *   Google's sign-in page, then redirects back to the app.
 *   getRedirectResult() picks up the result on return.
 *
 * DEPENDENCIES:
 *   - config.js (FIREBASE_CONFIG)
 *   - state.js (STATE.user)
 *   - navigation.js (refreshUI)
 *
 * @file   Chelsea Man Spa — Mobile Booking App
 * @author Chelsea Man Spa Development Team
 */

/**
 * Reference to the Firebase Auth instance.
 * Initialized in app.js after firebase.initializeApp().
 * @type {firebase.auth.Auth|null}
 */
var authInstance = null;

/**
 * Reference to the Firebase Firestore instance.
 * Initialized in app.js after firebase.initializeApp().
 * @type {firebase.firestore.Firestore|null}
 */
var dbInstance = null;

/**
 * Renders the Google Sign-In screen.
 *
 * Displays a centered auth card with:
 *   - Lock icon
 *   - Title: "Sign in to continue"
 *   - Subtitle explaining benefits (save bookings, quick booking)
 *   - "Continue with Google" button
 *   - Guest "Skip" link
 *
 * @returns {string} HTML string for the auth screen
 */
function renderAuthScreen() {
  return ''
    + '<div class="auth fade-in">'
    + '  <div class="auth-icon">'
    + '    <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">'
    + '      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>'
    + '      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>'
    + '    </svg>'
    + '  </div>'
    + '  <h2>Sign in to continue</h2>'
    + '  <p>Save your bookings, rebook in one tap, and never miss an appointment.</p>'
    + '  <button class="auth-btn" onclick="window.signInWithGoogle()">'
    + '    <svg viewBox="0 0 24 24">'
    + '      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>'
    + '      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>'
    + '      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>'
    + '      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>'
    + '    </svg>'
    + '    Continue with Google'
    + '  </button>'
    + '  <div class="auth-divider">or</div>'
    + '  <button class="btn btn-ghost" onclick="window.skipAuth()" style="font-size:0.875rem;">'
    + '    Continue as Guest'
    + '  </button>'
    + '</div>';
}

/**
 * Triggers Google Sign-In via the redirect flow.
 *
 * This navigates the browser to Google's sign-in page. After the
 * user signs in, the browser redirects back to the app where
 * getRedirectResult() resolves the result.
 *
 * IMPORTANT: Must be called from a user gesture (button click)
 * to avoid Safari's popup blocker.
 *
 * @returns {void}
 */
window.signInWithGoogle = function () {
  if (!authInstance) return;
  var provider = new firebase.auth.GoogleAuthProvider();
  authInstance.signInWithRedirect(provider);
};

/**
 * Signs the current user out and refreshes the UI.
 *
 * After sign-out:
 *   - STATE.user is set to null
 *   - The profile and bookings screens re-render to show auth prompts
 *
 * @returns {Promise<void>}
 */
window.signOut = function () {
  if (!authInstance) return Promise.resolve();
  return authInstance.signOut().then(function () {
    STATE.user = null;
    if (typeof refreshUI === 'function') refreshUI();
  });
};

/**
 * Skips authentication and proceeds as a guest.
 *
 * Sets STATE.user to a guest object and refreshes the UI to show
 * the main app screens. Guest users can still book appointments
 * but cannot sync bookings to Firestore.
 *
 * @returns {void}
 */
window.skipAuth = function () {
  STATE.user = { isGuest: true, displayName: 'Guest', email: null };
  if (typeof refreshUI === 'function') refreshUI();
};

/**
 * Handles the result of a Google Sign-In redirect.
 *
 * Must be called on every page load (app.js calls this on boot).
 * If the redirect was from Google sign-in, getRedirectResult()
 * returns the signed-in user. Otherwise it resolves to null.
 *
 * @returns {Promise<void>}
 */
function handleRedirectResult() {
  if (!authInstance) return Promise.resolve();
  return authInstance.getRedirectResult().then(function (result) {
    if (result && result.user) {
      STATE.user = result.user;
      // Load user's bookings from Firestore
      return loadUserBookings(result.user.uid);
    }
  }).catch(function (err) {
    // Silent fail — user remains null
    console.warn('Auth redirect error:', err.code, err.message);
  });
}

/**
 * Loads the authenticated user's bookings from Firestore.
 *
 * Merges Firestore bookings into STATE.bookings (avoiding dupes
 * by checking booking IDs). Firestore bookings are authoritative
 * and override localStorage entries with the same ID.
 *
 * @param {string} uid - Firebase Auth user UID
 * @returns {Promise<void>}
 */
function loadUserBookings(uid) {
  if (!dbInstance || !uid) return Promise.resolve();
  return dbInstance.collection('users').doc(uid).collection('bookings').get()
    .then(function (snapshot) {
      var fbBookings = [];
      snapshot.forEach(function (doc) {
        fbBookings.push(doc.data());
      });
      if (fbBookings.length === 0) return;

      // Merge: Firestore bookings override localStorage with same ID
      var merged = fbBookings.slice();
      STATE.bookings.forEach(function (localBk) {
        var exists = merged.some(function (fbBk) { return fbBk.bookingId === localBk.bookingId; });
        if (!exists) merged.push(localBk);
      });
      STATE.bookings = merged;
      localStorage.setItem('bks', JSON.stringify(STATE.bookings));
    })
    .catch(function () {
      // Firestore unavailable — use localStorage data only
    });
}

/**
 * Sets up a Firebase auth state change listener.
 *
 * This listener fires on:
 *   - Page load (if user is already signed in)
 *   - Sign-in completion (after redirect back)
 *   - Sign-out
 *
 * It updates STATE.user and triggers a UI refresh.
 *
 * @returns {void}
 */
function setupAuthListener() {
  if (!authInstance) return;
  authInstance.onAuthStateChanged(function (user) {
    if (user) {
      STATE.user = user;
      // Load user bookings in background
      loadUserBookings(user.uid);
    }
    if (typeof refreshUI === 'function') refreshUI();
  });
}
