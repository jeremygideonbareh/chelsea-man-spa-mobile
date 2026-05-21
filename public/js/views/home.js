/**
 * ============================================================
 * views/home.js — Home Page Renderer
 * ============================================================
 *
 * Renders the main Home tab, which includes:
 *   1. Hero banner with salon image + overlay text
 *   2. Promo badge
 *   3. "How it works" steps (3-step guide)
 *   4. Horizontal scroll of services (quick-select cards)
 *   5. Horizontal scroll of stylists (preview cards)
 *   6. Location information
 *
 * The home page serves as the entry point for the booking flow.
 * Tapping a service card begins the booking flow.
 *
 * DEPENDENCIES:
 *   - state.js (STATE.services, STATE.stylists)
 *   - ui.js (formatPrice, renderStars, pageHeader)
 *   - navigation.js (pushPage)
 *
 * @file   Chelsea Man Spa — Mobile Booking App
 * @author Chelsea Man Spa Development Team
 */

/**
 * Renders the Home page content into the #page-home container.
 *
 * @returns {void}
 */
function renderHome() {
  var container = document.getElementById('page-home');
  if (!container) return;

  // Build service cards HTML
  var svcCardsHtml = '';
  STATE.services.forEach(function (s) {
    svcCardsHtml += ''
      + '<div class="svc-card" onclick="window.selectService(\'' + s.id + '\')">'
      + '  <div class="svc-icon">'
      + '    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'
      + '      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>'
      + '    </svg>'
      + '  </div>'
      + '  <h3>' + s.name + '</h3>'
      + '  <div class="price">' + formatPrice(s.price) + '</div>'
      + '  <div class="dur">' + s.dur + '</div>'
      + '</div>';
  });

  // Build stylist cards HTML
  var stylistCardsHtml = '';
  STATE.stylists.forEach(function (st) {
    stylistCardsHtml += ''
      + '<div class="stylist-card" onclick="window.selectStylist(\'' + st.id + '\')">'
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
      + '  <span class="gender-badge">' + st.gender + '</span>'
      + '</div>';
  });

  container.innerHTML = ''
    + '<div class="scroll">'

    // --- Hero Section ---
    + '  <div class="hero">'
    + '    <img src="images/hero.jpg" alt="Chelsea Man Spa" onerror="this.style.display=\'none\'" />'
    + '    <div class="hero-overlay"></div>'
    + '    <div class="hero-shimmer"></div>'
    + '    <div class="hero-content fade-in">'
    + '      <h1 class="display-lg">Chelsea<br />Man Spa</h1>'
    + '      <div class="hero-divider"></div>'
    + '      <p>Premium grooming &amp; wellness in Dubai Marina</p>'
    + '    </div>'
    + '  </div>'

    // --- Promo Badge ---
    + '  <div style="padding: 16px var(--pad) 0;">'
    + '    <span class="badge badge-gold badge-pulse">'
    + '      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    + '        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>'
    + '      </svg>'
    + '      20% off first visit — code WELCOME20'
    + '    </span>'
    + '  </div>'

    // --- How It Works ---
    + '  <div class="section-header"><h2>How It Works</h2></div>'
    + '  <div style="padding: 0 var(--pad); display:flex; gap:12px;">'
    + '    <div style="flex:1; text-align:center; padding:16px 8px; background:var(--card); border-radius:var(--radius); border:1px solid var(--border);">'
    + '      <div style="width:36px;height:36px;background:var(--gold-dim);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 8px;font-weight:600;color:var(--gold);font-size:0.875rem;">1</div>'
    + '      <div style="font-size:0.8125rem;font-weight:500;margin-bottom:2px;">Choose</div>'
    + '      <div style="font-size:0.6875rem;color:var(--dim);">Service &amp; stylist</div>'
    + '    </div>'
    + '    <div style="flex:1; text-align:center; padding:16px 8px; background:var(--card); border-radius:var(--radius); border:1px solid var(--border);">'
    + '      <div style="width:36px;height:36px;background:var(--gold-dim);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 8px;font-weight:600;color:var(--gold);font-size:0.875rem;">2</div>'
    + '      <div style="font-size:0.8125rem;font-weight:500;margin-bottom:2px;">Pick</div>'
    + '      <div style="font-size:0.6875rem;color:var(--dim);">Date &amp; time</div>'
    + '    </div>'
    + '    <div style="flex:1; text-align:center; padding:16px 8px; background:var(--card); border-radius:var(--radius); border:1px solid var(--border);">'
    + '      <div style="width:36px;height:36px;background:var(--gold-dim);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 8px;font-weight:600;color:var(--gold);font-size:0.875rem;">3</div>'
    + '      <div style="font-size:0.8125rem;font-weight:500;margin-bottom:2px;">Confirm</div>'
    + '      <div style="font-size:0.6875rem;color:var(--dim);">Pay &amp; relax</div>'
    + '    </div>'
    + '  </div>'

    // --- Services ---
    + '  <div class="section-header">'
    + '    <h2>Our Services</h2>'
    + '    <button onclick="window.showServices()">See all</button>'
    + '  </div>'
    + '  <div class="h-scroll">' + svcCardsHtml + '</div>'

    // --- Stylists ---
    + '  <div class="section-header">'
    + '    <h2>Our Stylists</h2>'
    + '    <button onclick="window.showStylists()">See all</button>'
    + '  </div>'
    + '  <div class="h-scroll">' + stylistCardsHtml + '</div>'

    // --- Location ---
    + '  <div class="section-header"><h2>Visit Us</h2></div>'
    + '  <div style="padding:0 var(--pad) 24px;">'
    + '    <div style="background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:16px;">'
    + '      <div style="font-size:0.9375rem;font-weight:500;margin-bottom:4px;">Dubai Marina, Dubai</div>'
    + '      <div style="font-size:0.8125rem;color:var(--sec);">Marina Walk, Shop 7<br />Open daily 9:00 AM – 9:00 PM</div>'
    + '    </div>'
    + '  </div>'

    + '</div>';
}

/**
 * Quick-select a service from the home page cards.
 *
 * Sets STATE.service and pushes the services page for refinement,
 * or if only one service is selected, proceeds to stylists.
 *
 * @param {string} id - Service ID
 * @returns {void}
 */
window.selectService = function (id) {
  var svc = STATE.services.find(function (s) { return s.id === id; });
  if (svc) {
    STATE.service = svc;
    showStylists();
  }
};

/**
 * Quick-select a stylist from the home page cards.
 *
 * Sets STATE.stylist and pushes the services page (for service
 * selection if not already selected), or proceeds to datetime.
 *
 * @param {string} id - Stylist ID
 * @returns {void}
 */
window.selectStylist = function (id) {
  var st = STATE.stylists.find(function (s) { return s.id === id; });
  if (st) {
    STATE.stylist = st;
    if (STATE.service) {
      showDateTime();
    } else {
      showServices();
    }
  }
};
