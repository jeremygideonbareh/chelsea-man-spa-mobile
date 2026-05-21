/**
 * ============================================================
 * views/auth.js — Sign-In Screen Renderer
 * ============================================================
 *
 * Renders the authentication screen prompting user to sign in
 * with Google or continue as a guest.
 *
 * This view is shown in the Profile tab when the user is not
 * authenticated, and optionally at the start of the booking flow.
 *
 * DEPENDENCIES:
 *   - auth.js (renderAuthScreen)
 *   - ui.js (emptyState)
 *
 * @file   Chelsea Man Spa — Mobile Booking App
 * @author Chelsea Man Spa Development Team
 */

/**
 * Renders the auth screen into a given container element.
 *
 * Delegates to renderAuthScreen() from auth.js for the actual
 * HTML markup. Wraps the result with scrollable container.
 *
 * @param {string} [containerId='page-profile'] - The ID of the container element
 * @returns {void}
 */
function renderAuth(containerId) {
  containerId = containerId || 'page-profile';
  var container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = ''
    + '<div class="scroll full">'
    + renderAuthScreen()
    + '</div>';
}
