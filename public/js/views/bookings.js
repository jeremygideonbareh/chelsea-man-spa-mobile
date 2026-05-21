/**
 * ============================================================
 * views/bookings.js — My Bookings List View
 * ============================================================
 *
 * Displays all of the user's confirmed bookings. Data comes from
 * STATE.bookings which is populated from:
 *   1. localStorage (always available)
 *   2. Firestore (if authenticated, loaded on sign-in)
 *
 * The list is sorted with the most recent booking first.
 * If there are no bookings, an empty state is shown.
 *
 * DEPENDENCIES:
 *   - state.js (STATE.bookings)
 *   - navigation.js (switchTab)
 *
 * @file   Chelsea Man Spa — Mobile Booking App
 * @author Chelsea Man Spa Development Team
 */

/**
 * Renders the My Bookings page content.
 *
 * Displays booking cards sorted by creation date (newest first).
 * Each card shows:
 *   - Booking ID and status badge
 *   - Service name and stylist
 *   - Date and time
 *   - Price
 *
 * @returns {void}
 */
function renderBookings() {
  var container = document.getElementById('page-bookings');
  if (!container) return;

  // Check if there are any bookings
  if (STATE.bookings.length === 0) {
    container.innerHTML = ''
      + '<div class="scroll full">'
      + '  <div style="padding:20px var(--pad) 0;">'
      + '    <h1 style="font-family:var(--display);font-size:1.5rem;">My Bookings</h1>'
      + '  </div>'
      + emptyState(
        '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">'
        + '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>'
        + '<polyline points="14 2 14 8 20 8"></polyline>'
        + '<line x1="8" y1="13" x2="16" y2="13"></line>'
        + '<line x1="8" y1="17" x2="16" y2="17"></line>'
        + '</svg>',
        'No bookings yet',
        'Book your first appointment at Chelsea Man Spa'
      )
      + '  <div style="padding:0 var(--pad);">'
      + '    <button class="btn btn-gold btn-full" onclick="switchTab(\'home\')" style="max-width:280px;margin:0 auto;">Book Now</button>'
      + '  </div>'
      + '</div>';
    return;
  }

  // Sort bookings by createdAt descending (newest first)
  var sorted = STATE.bookings.slice().sort(function (a, b) {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  var html = ''
    + '<div class="scroll">'
    + '  <div style="padding:20px var(--pad) 8px;">'
    + '    <h1 style="font-family:var(--display);font-size:1.5rem;">My Bookings</h1>'
    + '    <p style="color:var(--sec);font-size:0.8125rem;margin-top:4px;">' + STATE.bookings.length + ' booking' + (STATE.bookings.length > 1 ? 's' : '') + '</p>'
    + '  </div>';

  // Render each booking card
  sorted.forEach(function (bk) {
    html += ''
      + '<div class="booking-card fade-in">'
      + '  <div class="b-header">'
      + '    <span class="b-id">' + bk.bookingId + '</span>'
      + '    <span class="b-status ' + (bk.status || 'confirmed') + '">' + (bk.status || 'Confirmed') + '</span>'
      + '  </div>'
      + '  <div class="b-detail">'
      + '    <strong>' + (bk.service ? bk.service.name : 'Service') + '</strong>'
      + '  </div>'
      + '  <div class="b-detail">'
      + '    <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">'
      + '      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>'
      + '      <circle cx="12" cy="7" r="4"></circle>'
      + '    </svg>'
      + '    ' + (bk.stylist ? bk.stylist.name : 'Any stylist')
      + '  </div>'
      + '  <div class="b-detail">'
      + '    <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">'
      + '      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>'
      + '      <line x1="16" y1="2" x2="16" y2="6"></line>'
      + '      <line x1="8" y1="2" x2="8" y2="6"></line>'
      + '      <line x1="3" y1="10" x2="21" y2="10"></line>'
      + '    </svg>'
      + '    ' + (bk.date || '') + (bk.time ? ' at ' + bk.time : '')
      + '  </div>'
      + '  <div class="b-detail" style="margin-top:4px;">'
      + '    <span style="color:var(--gold);font-weight:600;">' + formatPrice(bk.price || 0) + '</span>'
      + '    <span style="color:var(--dim);font-size:0.75rem;margin-left:auto;">' + (bk.paymentMethod ? bk.paymentMethod.charAt(0).toUpperCase() + bk.paymentMethod.slice(1) : 'Card') + '</span>'
      + '  </div>'
      + '</div>';
  });

  html += '</div>';
  container.innerHTML = html;
}
