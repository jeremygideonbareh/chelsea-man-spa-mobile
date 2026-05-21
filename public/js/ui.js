/**
 * ============================================================
 * ui.js — Shared UI Rendering Utilities & Helpers
 * ============================================================
 *
 * Provides reusable rendering helpers used across multiple views.
 * These include:
 *   - Toast notifications (non-blocking feedback messages)
 *   - Loading states
 *   - Empty state placeholders
 *   - Price formatting
 *   - Star rating renderers
 *   - SVG icon templates
 *
 * DEPENDENCIES:
 *   - None (pure utility functions)
 *
 * @file   Chelsea Man Spa — Mobile Booking App
 * @author Chelsea Man Spa Development Team
 */

/**
 * Displays a non-blocking toast notification at the bottom of the screen.
 *
 * The toast auto-dismisses after 3 seconds. It can be styled for
 * success (green), error (red), or neutral (default) states.
 *
 * Usage:
 *   showToast('Booking confirmed!', 'success');
 *   showToast('Please select a service', 'error');
 *
 * @param {string} message - The message text to display
 * @param {string} [type=''] - Optional: 'success', 'error', or ''
 * @returns {void}
 */
function showToast(message, type) {
  // Remove any existing toast
  var existing = document.querySelector('.toast');
  if (existing) existing.remove();

  var toast = document.createElement('div');
  toast.className = 'toast' + (type ? ' ' + type : '');
  toast.textContent = message;
  document.body.appendChild(toast);

  // Auto-dismiss after 3 seconds
  setTimeout(function () {
    if (toast.parentNode) {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(function () { if (toast.parentNode) toast.remove(); }, 300);
    }
  }, 3000);
}

/**
 * Formats a number as a price string in AED.
 *
 * Example: formatPrice(180) → "180 AED"
 *
 * @param {number} price - The price value
 * @returns {string} Formatted price string
 */
function formatPrice(price) {
  return price + ' AED';
}

/**
 * Renders a row of star icons for a rating value.
 *
 * Renders full stars, a half-star (if needed), and empty stars
 * to make 5 stars total. Uses an inline SVG star shape.
 *
 * @param {number} rating - Rating value (0-5, supports half values like 4.5)
 * @returns {string} HTML string containing star SVGs
 */
function renderStars(rating) {
  var full = Math.floor(rating);
  var half = rating % 1 >= 0.5;
  var empty = 5 - full - (half ? 1 : 0);
  var html = '';
  var i;

  for (i = 0; i < full; i++) {
    html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)" stroke-width="1">'
      + '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>'
      + '</svg>';
  }
  if (half) {
    html += '<svg width="14" height="14" viewBox="0 0 24 24" stroke="var(--gold)" stroke-width="1">'
      + '<defs><clipPath id="half"><rect x="0" y="0" width="12" height="24"/></clipPath></defs>'
      + '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="var(--gold)" clip-path="url(#half)"/>'
      + '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none"/>'
      + '</svg>';
  }
  for (i = 0; i < empty; i++) {
    html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1">'
      + '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>'
      + '</svg>';
  }
  return html;
}

/**
 * Generates HTML for a page header with back button and title.
 *
 * Used at the top of every booking flow page to provide consistent
 * back navigation.
 *
 * @param {string} title - The page title text
 * @param {string} [backAction='popPage()'] - JavaScript for the back button onclick
 * @returns {string} HTML string for the page header
 */
function pageHeader(title, backAction) {
  backAction = backAction || 'popPage()';
  return ''
    + '<div class="page-header">'
    + '  <button class="back-btn" onclick="' + backAction + '">'
    + '    <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">'
    + '      <line x1="19" y1="12" x2="5" y2="12"></line>'
    + '      <polyline points="12 19 5 12 12 5"></polyline>'
    + '    </svg>'
    + '  </button>'
    + '  <h2>' + title + '</h2>'
    + '</div>';
}

/**
 * Generates HTML for an empty state placeholder.
 *
 * Used when lists have no items (e.g., no bookings yet, no search results).
 *
 * @param {string} icon - SVG markup for the empty state icon
 * @param {string} title - Heading text
 * @param {string} message - Descriptive sub-text
 * @returns {string} HTML string for the empty state
 */
function emptyState(icon, title, message) {
  return ''
    + '<div class="empty-state">'
    + '  ' + icon
    + '  <h3>' + title + '</h3>'
    + '  <p>' + message + '</p>'
    + '</div>';
}

/**
 * Shows a shimmer loading placeholder in a container.
 *
 * @param {string} containerId - The ID of the container element
 * @returns {void}
 */
function showLoading(containerId) {
  var container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = ''
    + '<div style="padding:40px 24px;text-align:center;">'
    + '  <div class="load-bar-wrap" style="margin:0 auto;">'
    + '    <div class="load-bar"></div>'
    + '  </div>'
    + '</div>';
}

/**
 * Returns the initials of a name (up to 2 characters).
 *
 * Example: getInitials("Mustafa") → "M"
 * Example: getInitials("Layla Hassan") → "LH"
 *
 * @param {string} name - The full name
 * @returns {string} Initials (uppercase)
 */
function getInitials(name) {
  if (!name) return '?';
  var parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
