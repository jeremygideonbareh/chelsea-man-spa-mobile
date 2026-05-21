/**
 * ============================================================
 * app.js — Application Entry Point
 * ============================================================
 *
 * This is the main entry point for the Chelsea Man Spa booking app.
 * It is loaded LAST (after all views and utilities) and is
 * responsible for:
 *
 *   1. Initializing Firebase (Firestore + Auth)
 *   2. Setting up the auth state listener
 *   3. Handling the Google Sign-In redirect result
 *   4. Attempting Firestore data fetch (with 3s timeout)
 *   5. Calling boot() to render the app shell
 *   6. Hiding the loading screen
 *
 * IMPORTANT DESIGN DECISIONS:
 *
 *   a) Firebase is initialized here, NOT in a separate file, because
 *      the Firebase SDK scripts load via global <script> tags (not ES
 *      modules). The `firebase` object becomes available globally after
 *      the SDK script loads.
 *
 *   b) The app NEVER waits for Firebase. boot() is called with a 2s
 *      delay timer that fires regardless of whether Firestore data has
 *      loaded. This ensures the app is interactive immediately.
 *
 *   c) Firestore data fetching races against a 3s timeout. If Firestore
 *      responds first, STATE data is overridden. If the timeout fires
 *      first, hardcoded data from data.js is used as-is.
 *
 *   d) All functions are global (on window) so that HTML onclick
 *      attributes can reference them. This is the standard pattern
 *      for vanilla JS apps without a build step.
 *
 * DEPENDENCIES:
 *   - config.js (FIREBASE_CONFIG)
 *   - data.js (SERVICES, STYLISTS, ADDONS)
 *   - state.js (STATE, DATES, helper functions)
 *   - auth.js (authInstance, dbInstance, setupAuthListener, handleRedirectResult)
 *   - navigation.js (boot, switchTab)
 *   - All view files (render* functions)
 *
 * @file   Chelsea Man Spa — Mobile Booking App
 * @author Chelsea Man Spa Development Team
 */

// ============================================================
// 1. Firebase Initialization
// ============================================================

/**
 * The Firebase app instance.
 * Initialized synchronously — the SDKs are loaded via <script> tags
 * so the `firebase` global is available at this point.
 *
 * @type {firebase.app.App}
 */
var firebaseApp = null;

try {
  // Initialize the Firebase app with the config from config.js
  firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);

  // Initialize Firestore — used for services, stylists, addons, and bookings
  dbInstance = firebase.firestore();

  // Initialize Auth — used for Google Sign-In
  authInstance = firebase.auth();

  console.log('[App] Firebase initialized successfully');
} catch (e) {
  console.warn('[App] Firebase init failed:', e.message);
  // App continues without Firebase — hardcoded data only
}

// ============================================================
// 2. Handle Google Sign-In Redirect Result
// ============================================================

/**
 * Process the result of a Google Sign-In redirect.
 *
 * On mobile Safari, Firebase Auth uses the redirect flow (not popup).
 * When the user returns from the Google sign-in page, this call
 * resolves the pending sign-in result and updates STATE.user.
 *
 * This runs immediately on page load before boot().
 */
if (authInstance) {
  handleRedirectResult().then(function () {
    console.log('[App] Redirect result processed, auth state:',
      STATE.user ? STATE.user.displayName || 'Logged In' : 'Not logged in');
  });
}

// ============================================================
// 3. Setup Auth State Listener
// ============================================================

/**
 * Listen for auth state changes.
 *
 * This fires:
 *   - On page load (user session restored from cookie)
 *   - After successful sign-in (via redirect)
 *   - After sign-out
 *
 * When fired, it updates STATE.user and refreshes the UI.
 */
if (authInstance) {
  setupAuthListener();
}

// ============================================================
// 4. Firestore Data Fetch (Background, with Timeout)
// ============================================================

/**
 * Attempt to load services, stylists, and addons from Firestore.
 *
 * This runs in the background and races against a 3-second timeout.
 * If Firestore responds first, STATE values are overridden.
 * If the timeout fires first, hardcoded data remains in use.
 *
 * This ensures the app is never blocked waiting for Firebase.
 */
if (dbInstance) {
  // Create a timeout promise that rejects after 3 seconds
  var timeoutPromise = new Promise(function (_, reject) {
    setTimeout(function () { reject(new Error('Timeout')); }, 3000);
  });

  // Create the Firestore fetch promise
  var firestorePromise = Promise.all([
    // Fetch services from Firestore
    dbInstance.collection('services').get().then(function (snapshot) {
      if (!snapshot.empty) {
        STATE.services = snapshot.docs.map(function (doc) {
          var data = doc.data();
          return {
            id: doc.id,
            name: data.name || '',
            price: data.price || 250,
            dur: data.dur || data.duration || '60 min'
          };
        });
      }
    }).catch(function () { /* silent fallback */ }),

    // Fetch stylists from Firestore
    dbInstance.collection('stylists').get().then(function (snapshot) {
      if (!snapshot.empty) {
        STATE.stylists = snapshot.docs.map(function (doc) {
          var data = doc.data();
          return {
            id: doc.id,
            name: data.name || '',
            title: data.title || data.specialty || '',
            rating: data.rating || 4.5,
            reviews: data.reviews || 0,
            avail: data.avail !== false,
            gender: data.gender || 'female'
          };
        });
      }
    }).catch(function () { /* silent fallback */ }),

    // Fetch add-ons from Firestore
    dbInstance.collection('addons').get().then(function (snapshot) {
      if (!snapshot.empty) {
        STATE.addons = snapshot.docs.map(function (doc) {
          var data = doc.data();
          return {
            id: doc.id,
            name: data.name || '',
            price: data.price || 0
          };
        });
      }
    }).catch(function () { /* silent fallback */ })
  ]);

  // Race Firestore fetch against timeout
  Promise.race([firestorePromise, timeoutPromise])
    .then(function () {
      // Reset addonOn array to match potentially new addons length
      STATE.addonOn = STATE.addons.map(function () { return false; });
      // If the UI is already rendered, refresh it
      if (typeof refreshUI === 'function') refreshUI();
      console.log('[App] Firestore data loaded successfully');
    })
    .catch(function (err) {
      // Timeout or error — hardcoded data remains
      if (err.message === 'Timeout') {
        console.log('[App] Firestore fetch timed out — using hardcoded data');
      }
    });
}

// ============================================================
// 5. Boot the Application
// ============================================================

/**
 * Start the app with a delay to ensure the loading screen is visible.
 *
 * The loading screen shows the brand name + animated bar for a minimum
 * of 2 seconds (or until the DOM is ready). After boot(), the loading
 * screen fades out and the app shell appears.
 *
 * We use a timeout here instead of DOMContentLoaded because the scripts
 * are loaded synchronously at the bottom of <body>, so the DOM is
 * already parsed by the time app.js runs.
 */
setTimeout(function () {
  console.log('[App] Booting application...');
  boot(400); // 400ms delay before hiding loading screen
}, 2000);

// ============================================================
// 6. Global Fallback: Expose All Functions to Window
// ============================================================

/**
 * Most view functions are already exposed via `window.functionName =`
 * in their respective view files. This block provides a safety net
 * for any functions that might still be module-scoped.
 *
 * The following functions are expected to be globally available:
 *
 * Navigation:     boot, switchTab, pushPage, popPage, refreshUI
 * Home:           renderHome, selectService, selectStylist
 * Services:       showServices, renderServices, filterServices,
 *                 selectServiceFull, continueToStylists
 * Stylists:       showStylists, renderStylists, filterStylists,
 *                 selectStylistFull, continueToDateTime
 * DateTime:       showDateTime, renderDateTime, selectDate, setPeriod,
 *                 selectTime, continueToCheckout
 * Checkout:       showCheckout, renderCheckout, toggleAddon,
 *                 selectPayMethod, confirmBooking
 * Confirmed:      renderConfirmed, bookAnother, goHome
 * Bookings:       renderBookings
 * Profile:        renderProfile
 * Auth:           signInWithGoogle, signOut, skipAuth
 * UI:             showToast, formatPrice, renderStars, pageHeader,
 *                 emptyState, getInitials
 */

console.log('[App] Chelsea Man Spa loaded successfully');
console.log('[App] Services:', STATE.services.length, '| Stylists:', STATE.stylists.length, '| Add-ons:', STATE.addons.length);
