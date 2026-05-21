/**
 * ============================================================
 * views/confirmed.js — Booking Confirmation View
 * ============================================================
 *
 * Displays the booking confirmation after a successful booking.
 * Shows:
 *   1. Animated green checkmark (SVG draw animation)
 *   2. "Booking Confirmed" message
 *   3. Booking reference ID
 *   4. Full booking summary
 *   5. "Book Another Service" button
 *
 * ANIMATION:
 *   The checkmark uses CSS stroke-dasharray/stroke-dashoffset
 *   animation (checkDraw) — no JavaScript timer required.
 *
 * DEPENDENCIES:
 *   - state.js (STATE)
 *   - ui.js (formatPrice, pageHeader)
 *   - navigation.js (pushPage, switchTab)
 *
 * @file   Chelsea Man Spa — Mobile Booking App
 * @author Chelsea Man Spa Development Team
 */

/**
 * Renders the booking confirmation page.
 *
 * This replaces the current page content (not a push — it replaces
 * the checkout page in the stack). The booking data is passed in
 * directly rather than read from STATE to ensure consistency even
 * if STATE is modified later.
 *
 * @param {Object} booking - The confirmed booking object
 * @returns {void}
 */
function renderConfirmed(booking) {
  // Find the checkout page in the stack and replace its content
  var checkoutPage = document.getElementById('stack-checkout');
  if (checkoutPage) {
    checkoutPage.innerHTML = ''
      + '<div class="scroll full" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 24px;text-align:center;">'

      // Animated checkmark
      + '  <div class="confirm-check">'
      + '    <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">'
      + '      <polyline points="20 6 9 17 4 12"></polyline>'
      + '    </svg>'
      + '  </div>'

      // Confirmation text
      + '  <h1 style="font-family:var(--display);font-size:1.75rem;font-weight:600;margin-bottom:4px;">Booking Confirmed!</h1>'
      + '  <p style="color:var(--sec);font-size:0.875rem;margin-bottom:24px;">Your appointment has been booked.</p>'

      // Booking ID
      + '  <div style="background:var(--card-alt);border:1px solid var(--border);border-radius:var(--radius);padding:8px 20px;margin-bottom:24px;">'
      + '    <span style="font-size:0.75rem;color:var(--dim);text-transform:uppercase;letter-spacing:0.06em;">Reference</span>'
      + '    <div style="font-family:var(--body);font-size:1.25rem;font-weight:600;color:var(--gold);">' + booking.bookingId + '</div>'
      + '  </div>'

      // Booking summary card
      + '  <div style="width:100%;max-width:320px;background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:16px;text-align:left;margin-bottom:32px;">'

      + '    <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:0.8125rem;">'
      + '      <span style="color:var(--sec);">Service</span>'
      + '      <span style="font-weight:500;">' + (booking.service ? booking.service.name : '-') + '</span>'
      + '    </div>'

      + '    <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:0.8125rem;">'
      + '      <span style="color:var(--sec);">Stylist</span>'
      + '      <span style="font-weight:500;">' + (booking.stylist ? booking.stylist.name : '-') + '</span>'
      + '    </div>'

      + '    <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:0.8125rem;">'
      + '      <span style="color:var(--sec);">Date</span>'
      + '      <span style="font-weight:500;">' + booking.date + '</span>'
      + '    </div>'

      + '    <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:0.8125rem;">'
      + '      <span style="color:var(--sec);">Time</span>'
      + '      <span style="font-weight:500;">' + booking.time + '</span>'
      + '    </div>'

      + '    <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:0.8125rem;border-top:1px solid var(--border);margin-top:6px;padding-top:10px;">'
      + '      <span style="color:var(--gold);font-weight:500;">Total</span>'
      + '      <span style="color:var(--gold);font-weight:600;">' + formatPrice(booking.price) + '</span>'
      + '    </div>'

      + '  </div>'

      // Book another button
      + '  <button class="btn btn-primary btn-full" style="max-width:280px;" onclick="window.bookAnother()">'
      + '    Book Another Service'
      + '  </button>'

      // Back to home link
      + '  <button class="btn btn-ghost" style="margin-top:12px;" onclick="window.goHome()">'
      + '    Back to Home'
      + '  </button>'

      + '</div>';
  }
}

/**
 * Resets the booking flow state for a new booking.
 *
 * Clears selections (service, stylist, time, add-ons) and
 * returns to the Home tab.
 *
 * @returns {void}
 */
window.bookAnother = function () {
  // Reset booking state
  STATE.service = null;
  STATE.stylist = null;
  STATE.addonOn = STATE.addons.map(function () { return false; });
  STATE.selDate = 0;
  STATE.selTime = null;
  STATE.selPeriod = 'am';
  STATE.payMethod = 'card';
  STATE.name = '';
  STATE.phone = '';
  STATE.bookingId = 'S' + Math.floor(10000 + Math.random() * 90000);
  STATE.selG = 'female';

  // Go to home tab
  switchTab('home');
};

/**
 * Navigates back to the home tab without resetting state.
 *
 * @returns {void}
 */
window.goHome = function () {
  // Clear page stack first
  var stack = document.getElementById('page-stack');
  if (stack) stack.innerHTML = '';
  pageStack = [];

  switchTab('home');
};
