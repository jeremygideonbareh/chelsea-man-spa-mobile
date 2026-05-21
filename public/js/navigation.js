/**
 * ============================================================
 * navigation.js — Tab Navigation & Page Stack Management
 * ============================================================
 *
 * Implements a simple push/pop navigation stack for the single-page
 * app. The app has two navigation modes:
 *
 *   1. TAB MODE: Three tabs (Home, Bookings, Profile) with a visible
 *      bottom tab bar. Switching tabs hides/shows the corresponding
 *      page container.
 *
 *   2. STACK MODE: When the user enters the booking flow (Services →
 *      Stylists → DateTime → Checkout → Confirmed), pages are pushed
 *      onto a stack. The tab bar is hidden. A back button pops the
 *      top page.
 *
 * DESIGN RATIONALE:
 *   A hand-rolled stack is simpler and more reliable than a hash-based
 *   router for this use case. It avoids:
 *     - Mobile Safari back-swipe gesture conflicts
 *     - URL hash parsing complexity
 *     - History API state management for transient booking steps
 *
 * DEPENDENCIES:
 *   - state.js (STATE)
 *   - All view files (render functions)
 *
 * @file   Chelsea Man Spa — Mobile Booking App
 * @author Chelsea Man Spa Development Team
 */

/**
 * The navigation stack. Each entry is a page ID string.
 * The last element is the currently visible page.
 * @type {string[]}
 */
var pageStack = [];

/**
 * Tracks the currently active tab name.
 * @type {string}
 */
var currentTab = 'home';

/**
 * Initializes the application shell.
 *
 * Renders:
 *   1. Three page containers (#page-home, #page-bookings, #page-profile)
 *   2. A page stack container (#page-stack) for booking flow pages
 *   3. The tab bar with three tabs
 *
 * After rendering the shell, it renders the Home tab content and
 * fades out the loading screen.
 *
 * @param {number} [delay=0] - Optional delay before hiding loading screen
 * @returns {void}
 */
function boot(delay) {
  var app = document.getElementById('app');

  app.innerHTML = ''
    // Page containers for each tab
    + '<div id="page-home" class="page active"></div>'
    + '<div id="page-bookings" class="page"></div>'
    + '<div id="page-profile" class="page"></div>'
    // Stack container for booking flow
    + '<div id="page-stack" class="page-stack"></div>'
    // Bottom tab bar
    + '<div class="tab-bar" id="tab-bar">'
    + '  <button class="tab-item active" data-tab="home" onclick="switchTab(\'home\')">'
    + '    <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">'
    + '      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>'
    + '      <polyline points="9 22 9 12 15 12 15 22"></polyline>'
    + '    </svg>'
    + '    <span>Home</span>'
    + '  </button>'
    + '  <button class="tab-item" data-tab="bookings" onclick="switchTab(\'bookings\')">'
    + '    <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">'
    + '      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>'
    + '      <polyline points="14 2 14 8 20 8"></polyline>'
    + '      <line x1="8" y1="13" x2="16" y2="13"></line>'
    + '      <line x1="8" y1="17" x2="16" y2="17"></line>'
    + '    </svg>'
    + '    <span>Bookings</span>'
    + '  </button>'
    + '  <button class="tab-item" data-tab="profile" onclick="switchTab(\'profile\')">'
    + '    <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">'
    + '      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>'
    + '      <circle cx="12" cy="7" r="4"></circle>'
    + '    </svg>'
    + '    <span>Profile</span>'
    + '  </button>'
    + '</div>';

  // Render the initial tab
  renderHome();
  switchTab('home');

  // Hide loading screen after a brief delay
  setTimeout(function () {
    var loading = document.getElementById('loading');
    if (loading) loading.classList.add('hide');
  }, delay || 0);
}

/**
 * Switches the active tab.
 *
 * Hides all tab pages, shows the selected one, and updates the
 * tab bar active state. Also clears the page stack and shows the
 * tab bar.
 *
 * @param {string} tabName - One of 'home', 'bookings', 'profile'
 * @returns {void}
 */
function switchTab(tabName) {
  currentTab = tabName;

  // Hide all tab pages
  var pages = document.querySelectorAll('#page-home, #page-bookings, #page-profile');
  pages.forEach(function (p) { p.classList.remove('active'); });

  // Show the selected page
  var target = document.getElementById('page-' + tabName);
  if (target) target.classList.add('active');

  // Clear page stack
  pageStack = [];
  var stack = document.getElementById('page-stack');
  if (stack) stack.innerHTML = '';

  // Show tab bar
  var tabBar = document.getElementById('tab-bar');
  if (tabBar) tabBar.classList.remove('hide');

  // Update tab bar active state
  var tabs = document.querySelectorAll('.tab-item');
  tabs.forEach(function (t) {
    t.classList.toggle('active', t.getAttribute('data-tab') === tabName);
  });

  // Render the tab content
  if (tabName === 'home' && typeof renderHome === 'function') renderHome();
  else if (tabName === 'bookings' && typeof renderBookings === 'function') renderBookings();
  else if (tabName === 'profile' && typeof renderProfile === 'function') renderProfile();
}

/**
 * Pushes a new page onto the navigation stack.
 *
 * This is used for the booking flow (services → stylists → etc.).
 * The tab bar is hidden, and the new page slides in from the right
 * with a CSS transition.
 *
 * @param {string} pageId - Identifier for the page (e.g. 'services', 'stylists')
 * @param {string} html - The HTML content for the page
 * @returns {void}
 */
function pushPage(pageId, html) {
  var stack = document.getElementById('page-stack');
  if (!stack) return;

  // Hide tab bar
  var tabBar = document.getElementById('tab-bar');
  if (tabBar) tabBar.classList.add('hide');

  // Create the new page element
  var page = document.createElement('div');
  page.className = 'page';
  page.id = 'stack-' + pageId;
  page.innerHTML = html;

  // Append to stack
  stack.appendChild(page);
  pageStack.push(pageId);

  // Activate with slide-in transition
  requestAnimationFrame(function () {
    page.classList.add('active');
  });
}

/**
 * Pops the top page from the navigation stack.
 *
 * Slides the current page out to the right and removes it after
 * the transition completes. If the stack is empty (back to tab
 * level), the tab bar is shown again.
 *
 * @returns {void}
 */
function popPage() {
  if (pageStack.length === 0) return;

  var stack = document.getElementById('page-stack');
  if (!stack) return;

  var currentId = pageStack[pageStack.length - 1];
  var currentPage = document.getElementById('stack-' + currentId);

  if (currentPage) {
    // Start exit transition
    currentPage.classList.add('pop');
    currentPage.classList.remove('active');

    // Remove after transition
    var self = currentPage;
    setTimeout(function () {
      if (self.parentNode) self.parentNode.removeChild(self);
    }, 300);
  }

  pageStack.pop();

  // If stack is now empty, show tab bar
  if (pageStack.length === 0) {
    var tabBar = document.getElementById('tab-bar');
    if (tabBar) tabBar.classList.remove('hide');
    // Refresh current tab content
    if (typeof refreshUI === 'function') refreshUI();
  }
}

/**
 * Refreshes the content of the currently visible tab.
 *
 * Called after state changes (e.g., booking confirmed, user signed in)
 * to ensure the UI reflects the latest data.
 *
 * @returns {void}
 */
function refreshUI() {
  if (pageStack.length > 0) {
    // In booking flow — re-render current stack page
    var topId = pageStack[pageStack.length - 1];
    if (topId === 'services' && typeof renderServices === 'function') renderServices();
    else if (topId === 'stylists' && typeof renderStylists === 'function') renderStylists();
    else if (topId === 'datetime' && typeof renderDateTime === 'function') renderDateTime();
    else if (topId === 'checkout' && typeof renderCheckout === 'function') renderCheckout();
  } else {
    // On a tab — re-render the active tab
    if (currentTab === 'home' && typeof renderHome === 'function') renderHome();
    else if (currentTab === 'bookings' && typeof renderBookings === 'function') renderBookings();
    else if (currentTab === 'profile' && typeof renderProfile === 'function') renderProfile();
  }
}
