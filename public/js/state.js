/**
 * ============================================================
 * state.js — Application State Singleton & Date Utilities
 * ============================================================
 *
 * This module defines the global STATE object, which is the single
 * source of truth for all mutable application data. Every view
 * reads from STATE and modifies it through direct assignment.
 *
 * Also includes date generation utilities used by the datetime
 * picker view and various formatting helpers.
 *
 * DESIGN RATIONALE:
 *   Centralizing state avoids the common problem of multiple
 *   render functions holding stale copies of data. There is no
 *   reactive framework — views re-render by calling their render
 *   function after STATE changes.
 *
 * DEPENDENCIES:
 *   - data.js (SERVICES, STYLISTS, ADDONS globals)
 *
 * @file   Chelsea Man Spa — Mobile Booking App
 * @author Chelsea Man Spa Development Team
 */

/**
 * Global application state.
 *
 * Properties:
 *   services  — Array of service objects (initially from data.js,
 *               possibly overridden by Firestore)
 *   stylists  — Array of stylist objects
 *   addons    — Array of add-on objects
 *   bookings  — Array of confirmed bookings (persisted to localStorage)
 *   service   — Currently selected service (object or null)
 *   stylist   — Currently selected stylist (object or null)
 *   addonOn   — Boolean array tracking which add-ons are toggled on
 *   selDate   — Index into DATES for the selected day (0 = today)
 *   selTime   — Selected time string (e.g. '10:30') or null
 *   selPeriod — 'am' or 'pm'
 *   payMethod — Selected payment method: 'card', 'tabby', 'tamara', 'cash'
 *   name      — Customer's name (from checkout form)
 *   phone     — Customer's phone number (from checkout form)
 *   bookingId — Unique booking reference (e.g. 'S12345')
 *   user      — Firebase user object or null
 *   selG      — Gender filter for stylists: 'male', 'female', 'all'
 *
 * @constant {Object}
 */
const STATE = {
  services: SERVICES,
  stylists: STYLISTS,
  addons: ADDONS,
  bookings: JSON.parse(localStorage.getItem('bks') || '[]'),
  service: null,
  stylist: null,
  addonOn: ADDONS.map(function () { return false; }),
  selDate: 0,
  selTime: null,
  selPeriod: 'am',
  payMethod: 'card',
  name: '',
  phone: '',
  bookingId: 'S' + Math.floor(10000 + Math.random() * 90000),
  user: null,
  selG: 'female'
};

/**
 * Generates an array of 6 date objects starting from today.
 *
 * Each object:
 *   - day: Short weekday name (e.g. 'Mon', 'Tue')
 *   - num: Day of the month (e.g. 15)
 *
 * Used to populate the horizontal date picker in the DateTime view.
 *
 * @returns {Array<{day: string, num: number}>} Array of 6 date objects
 */
function generateDates() {
  var dates = [{ day: 'Today', num: new Date().getDate() }];
  var i, dt;
  for (i = 1; i <= 5; i++) {
    dt = new Date();
    dt.setDate(dt.getDate() + i);
    dates.push({
      day: dt.toLocaleDateString('en', { weekday: 'short' }),
      num: dt.getDate()
    });
  }
  return dates;
}

/**
 * Pre-computed date options for the picker.
 * Generated once at load time.
 *
 * @constant {Array<{day: string, num: number}>}
 */
var DATES = generateDates();

/**
 * Checks whether a given time falls within the Friday prayer break.
 *
 * The prayer break runs from 12:30 PM to 2:00 PM. Any time slot
 * that starts within this window is blocked (disabled) in the UI.
 *
 * @param {string} time - Time string in 'H:mm' format (e.g. '12:30', '13:00')
 * @returns {boolean} True if the time is during the prayer break
 */
function isFridayBreak(time) {
  var h = parseInt(time, 10);
  var m = parseInt(time.split(':')[1], 10);
  return (h === 12 && m >= 30) || h === 13;
}

/**
 * Returns a human-readable label for a date by index.
 *
 * Index map:
 *   0 → 'Today'
 *   1 → 'Tomorrow'
 *   2+ → '{shortWeekday} {dayNum}' (e.g. 'Wed 17')
 *
 * @param {number} index - Index into the DATES array
 * @returns {string} Formatted date label
 */
function dateLabel(index) {
  var map = {};
  map[0] = 'Today';
  map[1] = 'Tomorrow';
  DATES.forEach(function (d, j) {
    if (j > 1) map[j] = d.day + ' ' + d.num;
  });
  return map[index] || '';
}
