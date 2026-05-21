/**
 * ============================================================
 * views/services.js — Service Selection View
 * ============================================================
 *
 * Displays a searchable, filterable list of all salon services.
 * The user selects one service, then taps "Continue" to proceed
 * to the stylist selection screen.
 *
 * Features:
 *   - Search bar to filter by service name
 *   - Each item shows name, duration, and price
 *   - Selected item highlighted with gold border + checkmark
 *   - Sticky "Continue" button at bottom (enabled only when selected)
 *
 * DEPENDENCIES:
 *   - state.js (STATE.services, STATE.service)
 *   - ui.js (pageHeader, formatPrice, showToast)
 *   - navigation.js (pushPage, popPage)
 *
 * @file   Chelsea Man Spa — Mobile Booking App
 * @author Chelsea Man Spa Development Team
 */

/**
 * Search query for filtering services.
 * Bound to the search input via oninput handler.
 * @type {string}
 */
var servicesQuery = '';

/**
 * Pushes the services page onto the navigation stack.
 *
 * Called from "See all" on the home page or from other views
 * when service selection is needed.
 *
 * @returns {void}
 */
function showServices() {
  pushPage('services', ''
    + pageHeader('Services')
    + '<div class="scroll">'
    + '  <div id="services-content"></div>'
    + '</div>'
    + '<div id="services-sticky" class="sticky-btn" style="display:none;">'
    + '  <button class="btn btn-gold btn-full" onclick="window.continueToStylists()">Continue</button>'
    + '</div>'
  );
  renderServices();
}

/**
 * Renders the services list inside the services page.
 *
 * Filters by servicesQuery and renders matching items.
 * Also shows/hides the continue button based on selection.
 *
 * @returns {void}
 */
function renderServices() {
  var container = document.getElementById('services-content');
  if (!container) return;

  // Filter by search query
  var query = servicesQuery.toLowerCase().trim();
  var filtered = STATE.services.filter(function (s) {
    return s.name.toLowerCase().indexOf(query) !== -1;
  });

  var html = ''
    // Search bar
    + '<div class="search-bar fade-in">'
    + '  <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">'
    + '    <circle cx="11" cy="11" r="8"></circle>'
    + '    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>'
    + '  </svg>'
    + '  <input type="text" placeholder="Search services..." value="' + servicesQuery + '" '
    + '    oninput="window.filterServices(this.value)" />'
    + '</div>'
    + '<div class="stagger">';

  // Render each service item
  filtered.forEach(function (s) {
    var selected = STATE.service && STATE.service.id === s.id;
    html += ''
      + '<div class="svc-item' + (selected ? ' selected' : '') + '" onclick="window.selectServiceFull(\'' + s.id + '\')">'
      + '  <div class="check-circle"></div>'
      + '  <div class="info">'
      + '    <div class="name">' + s.name + '</div>'
      + '    <div class="meta">' + s.dur + '</div>'
      + '  </div>'
      + '  <div class="price">' + formatPrice(s.price) + '</div>'
      + '</div>';
  });

  if (filtered.length === 0) {
    html += emptyState(
      '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">'
      + '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>'
      + '</svg>',
      'No services found',
      'Try a different search term'
    );
  }

  html += '</div>';
  container.innerHTML = html;

  // Show/hide continue button
  var sticky = document.getElementById('services-sticky');
  if (sticky) {
    sticky.style.display = STATE.service ? 'block' : 'none';
  }
}

/**
 * Filters the services list by search query.
 *
 * Called on every keystroke in the search input.
 *
 * @param {string} value - The search query
 * @returns {void}
 */
window.filterServices = function (value) {
  servicesQuery = value;
  renderServices();
};

/**
 * Selects a service by ID.
 *
 * Sets STATE.service and re-renders the list to show selection.
 *
 * @param {string} id - Service ID to select
 * @returns {void}
 */
window.selectServiceFull = function (id) {
  var svc = STATE.services.find(function (s) { return s.id === id; });
  if (svc) {
    STATE.service = svc;
    renderServices();
  }
};

/**
 * Proceeds to the stylist selection screen.
 *
 * Validates that a service is selected before continuing.
 *
 * @returns {void}
 */
window.continueToStylists = function () {
  if (!STATE.service) {
    showToast('Please select a service', 'error');
    return;
  }
  showStylists();
};
