/**
 * ============================================================
 * views/datetime.js — Date & Time Selection View
 * ============================================================
 *
 * Displays a date picker (6 days including today) and a time slot
 * grid (AM/PM toggle) for selecting the appointment time.
 *
 * Features:
 *   - Horizontal scrollable date chips (Today, Tomorrow, +4 days)
 *   - AM/PM period toggle
 *   - Time grid with 30-minute slots
 *   - Friday prayer break (12:30 PM – 2:00 PM) blocked on all days
 *   - Past times on today are automatically disabled
 *   - Selected date + time highlighted with gold
 *
 * DEPENDENCIES:
 *   - state.js (STATE.selDate, STATE.selTime, STATE.selPeriod, DATES, isFridayBreak)
 *   - config.js (AM_SLOTS, PM_SLOTS)
 *   - ui.js (pageHeader, showToast)
 *   - navigation.js (pushPage, popPage)
 *
 * @file   Chelsea Man Spa — Mobile Booking App
 * @author Chelsea Man Spa Development Team
 */

/**
 * Pushes the date & time page onto the navigation stack.
 *
 * @returns {void}
 */
function showDateTime() {
  pushPage('datetime', ''
    + pageHeader('Date & Time')
    + '  <div class="scroll">'
    + '    <div id="datetime-content"></div>'
    + '  </div>'
    + '  <div class="sticky-btn">'
    + '    <button class="btn btn-gold btn-full" onclick="window.continueToCheckout()">Continue</button>'
    + '  </div>'
  );
  renderDateTime();
}

/**
 * Renders the date picker and time slot grid.
 *
 * @returns {void}
 */
function renderDateTime() {
  var container = document.getElementById('datetime-content');
  if (!container) return;

  // Generate date chips
  var dateHtml = '';
  DATES.forEach(function (d, i) {
    dateHtml += ''
      + '<button class="date-chip' + (STATE.selDate === i ? ' selected' : '') + '" onclick="window.selectDate(' + i + ')">'
      + '  <span class="day">' + d.day + '</span>'
      + '  <span class="num">' + d.num + '</span>'
      + '</button>';
  });

  // Determine which slots to show based on period
  var slots = STATE.selPeriod === 'am' ? AM_SLOTS : PM_SLOTS;

  // Build time slot grid
  var timeHtml = '';
  slots.forEach(function (t) {
    var disabled = false;

    // Block Friday prayer break (12:30-14:00) on all days
    if (isFridayBreak(t)) disabled = true;

    // Block past times on today
    if (STATE.selDate === 0) {
      var now = new Date();
      var currentMinutes = now.getHours() * 60 + now.getMinutes();
      var slotParts = t.split(':');
      var slotMinutes = parseInt(slotParts[0], 10) * 60 + parseInt(slotParts[1], 10);
      if (slotMinutes <= currentMinutes) disabled = true;
    }

    var selected = STATE.selTime === t;
    timeHtml += ''
      + '<button class="time-slot' + (selected ? ' selected' : '') + (disabled ? ' disabled' : '') + '" '
      + '  onclick="window.selectTime(\'' + t + '\')" '
      + (disabled ? 'disabled' : '') + '>'
      + t
      + '</button>';
  });

  container.innerHTML = ''
    // Date picker
    + '<div style="padding-top:8px;">'
    + '  <div class="section-header" style="padding-top:0;"><h2>Select Date</h2></div>'
    + '  <div class="date-row">' + dateHtml + '</div>'
    + '</div>'

    // Period toggle
    + '<div class="section-header" style="padding-top:0;"><h2>Select Time</h2></div>'
    + '  <div class="period-toggle">'
    + '    <button class="period-btn' + (STATE.selPeriod === 'am' ? ' active' : '') + '" onclick="window.setPeriod(\'am\')">Morning</button>'
    + '    <button class="period-btn' + (STATE.selPeriod === 'pm' ? ' active' : '') + '" onclick="window.setPeriod(\'pm\')">Afternoon</button>'
    + '  </div>'

    // Time grid
    + '  <div class="time-grid">' + timeHtml + '</div>'

    // Prayer break note
    + '  <div class="prayer-note">Closed 12:30 PM – 2:00 PM for Friday prayer</div>';
}

/**
 * Selects a date by index.
 *
 * @param {number} index - Index into the DATES array
 * @returns {void}
 */
window.selectDate = function (index) {
  STATE.selDate = index;
  STATE.selTime = null; // Reset time when date changes
  renderDateTime();
};

/**
 * Sets the time period (AM or PM).
 *
 * Resets the selected time when changing periods.
 *
 * @param {string} period - 'am' or 'pm'
 * @returns {void}
 */
window.setPeriod = function (period) {
  STATE.selPeriod = period;
  STATE.selTime = null;
  renderDateTime();
};

/**
 * Selects a time slot.
 *
 * @param {string} time - Time string (e.g. '10:30')
 * @returns {void}
 */
window.selectTime = function (time) {
  STATE.selTime = time;
  renderDateTime();
};

/**
 * Proceeds to the checkout screen.
 *
 * Validates that both date and time are selected.
 *
 * @returns {void}
 */
window.continueToCheckout = function () {
  if (STATE.selTime === null) {
    showToast('Please select a time', 'error');
    return;
  }
  showCheckout();
};
