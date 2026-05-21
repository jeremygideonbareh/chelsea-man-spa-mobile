/**
 * ============================================================
 * views/checkout.js — Booking Review, Add-Ons, Payment & Confirm
 * ============================================================
 *
 * The final step before confirming a booking. Shows:
 *   1. Booking summary (service, stylist, date, time)
 *   2. Optional add-on toggles
 *   3. Customer information form (name, phone)
 *   4. Payment method selection (Card, Tabby, Tamara, Cash)
 *   5. Price breakdown with 5% VAT
 *   6. "Confirm Booking" button
 *
 * VAT Calculation:
 *   Subtotal  = service price + selected add-ons
 *   VAT (5%)  = subtotal * 0.05
 *   Total     = subtotal + VAT
 *
 * DEPENDENCIES:
 *   - state.js (STATE.service, STATE.stylist, STATE.selDate, STATE.selTime,
 *               STATE.addons, STATE.addonOn, STATE.payMethod)
 *   - ui.js (pageHeader, formatPrice, showToast)
 *   - navigation.js (pushPage, popPage)
 *
 * @file   Chelsea Man Spa — Mobile Booking App
 * @author Chelsea Man Spa Development Team
 */

/**
 * Pushes the checkout page onto the navigation stack.
 *
 * @returns {void}
 */
function showCheckout() {
  pushPage('checkout', ''
    + pageHeader('Checkout')
    + '  <div class="scroll">'
    + '    <div id="checkout-content"></div>'
    + '  </div>'
    + '  <div class="sticky-btn">'
    + '    <button class="btn btn-gold btn-full" onclick="window.confirmBooking()">Confirm Booking</button>'
    + '  </div>'
  );
  renderCheckout();
}

/**
 * Renders the full checkout page content.
 *
 * Rebuilds the entire checkout UI including summary, add-ons,
 * customer info, payment methods, and price breakdown.
 *
 * @returns {void}
 */
function renderCheckout() {
  var container = document.getElementById('checkout-content');
  if (!container) return;

  // Calculate pricing
  var svcPrice = STATE.service ? STATE.service.price : 0;
  var addonsTotal = 0;
  STATE.addons.forEach(function (a, i) {
    if (STATE.addonOn[i]) addonsTotal += a.price;
  });
  var subtotal = svcPrice + addonsTotal;
  var vat = subtotal * 0.05;
  var total = subtotal + vat;

  // Generate add-on toggles HTML
  var addonHtml = '';
  STATE.addons.forEach(function (a, i) {
    addonHtml += ''
      + '<div class="addon-item">'
      + '  <div class="info">'
      + '    <div class="name">' + a.name + '</div>'
      + '    <div class="price">' + formatPrice(a.price) + '</div>'
      + '  </div>'
      + '  <label class="toggle">'
      + '    <input type="checkbox" ' + (STATE.addonOn[i] ? 'checked' : '') + ' onchange="window.toggleAddon(' + i + ')" />'
      + '    <div class="track"></div>'
      + '    <div class="thumb"></div>'
      + '  </label>'
      + '</div>';
  });

  // Payment methods
  var payMethods = [
    { id: 'card', name: 'Credit / Debit Card', desc: 'Visa, Mastercard, AMEX' },
    { id: 'tabby', name: 'Tabby', desc: 'Pay in 4 installments' },
    { id: 'tamara', name: 'Tamara', desc: 'Pay later or in 3 installments' },
    { id: 'cash', name: 'Cash', desc: 'Pay at the salon' }
  ];

  var payHtml = '';
  payMethods.forEach(function (pm) {
    payHtml += ''
      + '<div class="pay-card' + (STATE.payMethod === pm.id ? ' selected' : '') + '" onclick="window.selectPayMethod(\'' + pm.id + '\')">'
      + '  <div class="pay-icon">' + pm.id.toUpperCase() + '</div>'
      + '  <div>'
      + '    <div class="pay-name">' + pm.name + '</div>'
      + '    <div class="pay-desc">' + pm.desc + '</div>'
      + '  </div>'
      + '  <label class="radio">'
      + '    <input type="radio" name="pay" ' + (STATE.payMethod === pm.id ? 'checked' : '') + ' />'
      + '    <div class="radio-dot"></div>'
      + '  </label>'
      + '</div>';
  });

  container.innerHTML = ''
    // --- Booking Summary ---
    + '<div class="summary-card fade-in">'
    + '  <div class="summary-row">'
    + '    <span class="label">Service</span>'
    + '    <span class="value">' + (STATE.service ? STATE.service.name : '-') + '</span>'
    + '  </div>'
    + '  <div class="summary-row">'
    + '    <span class="label">Stylist</span>'
    + '    <span class="value">' + (STATE.stylist ? STATE.stylist.name : '-') + '</span>'
    + '  </div>'
    + '  <div class="summary-row">'
    + '    <span class="label">Date</span>'
    + '    <span class="value">' + dateLabel(STATE.selDate) + '</span>'
    + '  </div>'
    + '  <div class="summary-row">'
    + '    <span class="label">Time</span>'
    + '    <span class="value">' + (STATE.selTime || '-') + '</span>'
    + '  </div>'
    + '</div>'

    // --- Add-Ons ---
    + '<div class="section-header"><h2>Add-Ons</h2></div>'
    + '<div class="addon-group">' + addonHtml + '</div>'

    // --- Customer Info ---
    + '<div class="section-header"><h2>Your Details</h2></div>'
    + '<div class="input-group">'
    + '  <label>Full Name</label>'
    + '  <input class="input" type="text" placeholder="Enter your name" value="' + STATE.name + '" '
    + '    oninput="STATE.name=this.value" />'
    + '</div>'
    + '<div class="input-group">'
    + '  <label>Phone Number</label>'
    + '  <input class="input" type="tel" placeholder="+971 5X XXX XXXX" value="' + STATE.phone + '" '
    + '    oninput="STATE.phone=this.value" />'
    + '</div>'

    // --- Payment ---
    + '<div class="section-header"><h2>Payment Method</h2></div>'
    + '<div class="pay-group">' + payHtml + '</div>'

    // --- Price Breakdown ---
    + '<div class="section-header"><h2>Total</h2></div>'
    + '<div class="summary-card">'
    + '  <div class="summary-row">'
    + '    <span class="label">Service</span>'
    + '    <span class="value">' + formatPrice(svcPrice) + '</span>'
    + '  </div>'
    + (addonsTotal > 0 ? '  <div class="summary-row"><span class="label">Add-Ons</span><span class="value">' + formatPrice(addonsTotal) + '</span></div>' : '')
    + '  <div class="summary-row">'
    + '    <span class="label">VAT (5%)</span>'
    + '    <span class="value">' + formatPrice(Math.round(vat)) + '</span>'
    + '  </div>'
    + '  <div class="summary-row total">'
    + '    <span class="label">Total</span>'
    + '    <span class="value gold">' + formatPrice(Math.round(total)) + '</span>'
    + '  </div>'
    + '</div>';
}

/**
 * Toggles an add-on on or off.
 *
 * @param {number} index - Index into STATE.addons / STATE.addonOn arrays
 * @returns {void}
 */
window.toggleAddon = function (index) {
  STATE.addonOn[index] = !STATE.addonOn[index];
  renderCheckout();
};

/**
 * Selects a payment method.
 *
 * @param {string} method - 'card', 'tabby', 'tamara', or 'cash'
 * @returns {void}
 */
window.selectPayMethod = function (method) {
  STATE.payMethod = method;
  renderCheckout();
};

/**
 * Validates the booking and saves it.
 *
 * Checks:
 *   - Name is provided
 *   - Phone is provided (at least 7 characters)
 *
 * On success:
 *   1. Generates a unique booking ID
 *   2. Builds booking object from STATE
 *   3. Saves to localStorage
 *   4. If authenticated, saves to Firestore
 *   5. Pushes to confirmed page
 *
 * @returns {void}
 */
window.confirmBooking = function () {
  // Validation
  if (!STATE.name || STATE.name.trim().length < 2) {
    showToast('Please enter your name', 'error');
    return;
  }
  if (!STATE.phone || STATE.phone.trim().length < 7) {
    showToast('Please enter a valid phone number', 'error');
    return;
  }
  if (!STATE.service) {
    showToast('Please select a service', 'error');
    return;
  }

  // Calculate totals
  var addonsTotal = 0;
  var selectedAddons = [];
  STATE.addons.forEach(function (a, i) {
    if (STATE.addonOn[i]) {
      addonsTotal += a.price;
      selectedAddons.push(a.name);
    }
  });
  var subtotal = STATE.service.price + addonsTotal;
  var vat = subtotal * 0.05;
  var total = subtotal + vat;

  // Generate unique booking ID
  var bookingId = 'S' + Math.floor(10000 + Math.random() * 90000);

  // Build booking object
  var booking = {
    bookingId: bookingId,
    service: STATE.service,
    stylist: STATE.stylist,
    date: dateLabel(STATE.selDate),
    time: STATE.selTime,
    addons: selectedAddons,
    name: STATE.name.trim(),
    phone: STATE.phone.trim(),
    paymentMethod: STATE.payMethod,
    price: Math.round(total),
    vat: Math.round(vat),
    subtotal: subtotal,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    userId: STATE.user && !STATE.user.isGuest ? STATE.user.uid : null
  };

  // Save to localStorage
  STATE.bookings.push(booking);
  localStorage.setItem('bks', JSON.stringify(STATE.bookings));

  // Save to Firestore if authenticated
  if (booking.userId && dbInstance) {
    dbInstance.collection('users').doc(booking.userId)
      .collection('bookings').doc(bookingId)
      .set(booking)
      .catch(function () {
        // Firestore save failed — booking is already in localStorage
      });
  }

  // Update state for confirmation screen
  STATE.bookingId = bookingId;

  // Push to confirmed page
  renderConfirmed(booking);
};
