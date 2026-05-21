/**
 * ============================================================
 * views/stylists.js — Stylist Selection View
 * ============================================================
 *
 * Displays the salon's stylists with gender filtering and rating
 * information. The user selects a stylist, then taps "Continue"
 * to proceed to date & time selection.
 *
 * Features:
 *   - Gender filter chips (Female / Male / All)
 *   - Stylist cards with avatar initials, name, title, star rating
 *   - Selected card highlighted with gold border
 *   - Availability indicator
 *
 * DEPENDENCIES:
 *   - state.js (STATE.stylists, STATE.stylist, STATE.selG)
 *   - ui.js (pageHeader, formatPrice, renderStars, getInitials, showToast)
 *   - navigation.js (pushPage, popPage)
 *
 * @file   Chelsea Man Spa — Mobile Booking App
 * @author Chelsea Man Spa Development Team
 */

/**
 * Pushes the stylists page onto the navigation stack.
 *
 * @returns {void}
 */
function showStylists() {
  pushPage('stylists', ''
    + pageHeader('Choose Stylist')
    + '  <div class="scroll">'
    + '    <div id="stylists-content"></div>'
    + '  </div>'
    + '  <div class="sticky-btn">'
    + '    <button class="btn btn-gold btn-full" onclick="window.continueToDateTime()">Continue</button>'
    + '  </div>'
  );
  renderStylists();
}

/**
 * Renders the stylist list with gender filter chips.
 *
 * @returns {void}
 */
function renderStylists() {
  var container = document.getElementById('stylists-content');
  if (!container) return;

  // Filter by gender
  var filtered = STATE.stylists.filter(function (st) {
    return STATE.selG === 'all' || st.gender === STATE.selG;
  });

  var html = ''
    // Gender filter chips
    + '<div class="chip-group fade-in" style="padding-bottom:16px;">'
    + '  <button class="chip' + (STATE.selG === 'female' ? ' active' : '') + '" onclick="window.filterStylists(\'female\')">Female</button>'
    + '  <button class="chip' + (STATE.selG === 'male' ? ' active' : '') + '" onclick="window.filterStylists(\'male\')">Male</button>'
    + '  <button class="chip' + (STATE.selG === 'all' ? ' active' : '') + '" onclick="window.filterStylists(\'all\')">All</button>'
    + '</div>'
    + '<div class="stagger" style="padding:0 var(--pad);">';

  // Render each stylist card
  filtered.forEach(function (st) {
    var selected = STATE.stylist && STATE.stylist.id === st.id;
    html += ''
      + '<div class="stylist-card' + (selected ? ' selected' : '') + '" onclick="window.selectStylistFull(\'' + st.id + '\')" style="margin-bottom:10px;min-width:0;width:100%;">'
      + '  <div class="stylist-avatar">' + getInitials(st.name) + '</div>'
      + '  <div class="stylist-info">'
      + '    <div class="name">' + st.name + '</div>'
      + '    <div class="title">' + st.title + '</div>'
      + '    <div class="rating">'
      + renderStars(st.rating)
      + '      <span>' + st.rating.toFixed(1) + '</span>'
      + '      <span class="num">(' + st.reviews + ')</span>'
      + '    </div>'
      + '  </div>'
      + '  ' + (st.avail ? '' : '<span class="gender-badge" style="color:var(--dim);background:var(--card-alt);">Unavailable</span>')
      + '</div>';
  });

  if (filtered.length === 0) {
    html += emptyState(
      '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">'
      + '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>'
      + '<circle cx="9" cy="7" r="4"></circle>'
      + '</svg>',
      'No stylists found',
      'Try a different filter'
    );
  }

  html += '</div>';
  container.innerHTML = html;
}

/**
 * Filters the stylist list by gender.
 *
 * Updates STATE.selG and re-renders the list.
 *
 * @param {string} gender - 'female', 'male', or 'all'
 * @returns {void}
 */
window.filterStylists = function (gender) {
  STATE.selG = gender;
  renderStylists();
};

/**
 * Selects a stylist by ID.
 *
 * Sets STATE.stylist and re-renders the list.
 *
 * @param {string} id - Stylist ID
 * @returns {void}
 */
window.selectStylistFull = function (id) {
  var st = STATE.stylists.find(function (s) { return s.id === id; });
  if (st) {
    STATE.stylist = st;
    renderStylists();
  }
};

/**
 * Proceeds to the date & time selection screen.
 *
 * Validates that a stylist is selected before continuing.
 *
 * @returns {void}
 */
window.continueToDateTime = function () {
  if (!STATE.stylist) {
    showToast('Please select a stylist', 'error');
    return;
  }
  showDateTime();
};
