console.log('App module loaded');

var bookingState = {
  serviceId: null,
  serviceName: '',
  servicePrice: 0,
  stylistId: null,
  stylistName: '',
  stylistRole: '',
  bookingDate: null,
  bookingTime: null,
  addons: [],
  customerName: '',
  customerPhone: '',
  paymentMethod: 'cash'
};

var ADDONS = [
  { name: 'Scalp Massage', price: 50 },
  { name: 'Luxury Hair Treatment', price: 120 }
];

var selectedDate = null;
var selectedPeriod = 'am';

function showView(id) {
  document.querySelectorAll('.view').forEach(function (v) { v.classList.remove('active'); });
  document.getElementById('view-' + id).classList.add('active');
}

function goHome() { showView('home'); }

function viewStylist() { showView('stylist'); }

function viewDatetime() { showView('datetime'); }

function viewCheckout() { showView('checkout'); renderCheckout(); }

// ---------- Role check ----------
(function () {
  var role = (localStorage.getItem('userRole') || '').toLowerCase();
  if (role === 'admin' || role === 'staff') {
    document.getElementById('btn-manager-dashboard').style.display = '';
  }
})();

// ---------- Tab switching ----------
function switchTab(tab) {
  document.querySelectorAll('.bottom-nav .tab').forEach(function (t) {
    t.classList.toggle('active', t.getAttribute('data-tab') === tab);
  });
  if (tab === 'home') { showView('home'); }
}

// ---------- Kinetic skeleton loader ----------
function showSkeletons(containerId, type, count) {
  var container = document.getElementById(containerId);
  container.innerHTML = '';
  for (var i = 0; i < count; i++) {
    var sk = document.createElement('div');
    sk.className = 'skeleton skeleton-' + type;
    container.appendChild(sk);
  }
}

// ---------- Service categories ----------
var CATEGORIES = [
  { id: 'all', label: 'All', img: '' },
  { id: 'haircuts', label: 'Haircuts', img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=250&fit=crop' },
  { id: 'beard', label: 'Beard & Shave', img: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=400&h=250&fit=crop' },
  { id: 'hair-care', label: 'Hair Care', img: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=250&fit=crop' },
  { id: 'facials', label: 'Facials', img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=250&fit=crop' },
  { id: 'waxing', label: 'Waxing', img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=250&fit=crop' },
  { id: 'nails', label: 'Nails & Spa', img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=250&fit=crop' },
  { id: 'other', label: 'Other', img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=250&fit=crop' }
];

function categorizeService(name) {
  var n = (name || '').toLowerCase();
  if (/\b(hair cut|buzz cut|skin fade|kids|line up|haircut|fade)\b/.test(n)) return 'haircuts';
  if (/\b(shave|beard|royal)\b/.test(n)) return 'beard';
  if (/\b(collagen|keratin|mask|treatment|color|highlights|silver|shades|wash|blow|conditioning)\b/.test(n)) return 'hair-care';
  if (/\b(facial|face massage|soothing)\b/.test(n)) return 'facials';
  if (/\b(wax|waxing|underarm)\b/.test(n)) return 'waxing';
  if (/\b(manicure|pedicure|nails|paraffin)\b/.test(n)) return 'nails';
  return 'other';
}

function categoryImg(catId) {
  var c = CATEGORIES.find(function (x) { return x.id === catId; });
  return c ? c.img : CATEGORIES[CATEGORIES.length - 1].img;
}

var allServices = [];
var activeCat = 'all';
var searchQuery = '';

function renderCategoryChips() {
  var chips = document.getElementById('cat-chips');
  chips.innerHTML = '';
  CATEGORIES.forEach(function (cat) {
    var c = document.createElement('button');
    c.className = 'cat-chip' + (cat.id === activeCat ? ' active' : '');
    c.textContent = cat.label;
    c.addEventListener('click', function () {
      activeCat = cat.id;
      renderCategoryChips();
      filterServices();
    });
    chips.appendChild(c);
  });
}

function filterServices() {
  var input = document.getElementById('search-input');
  searchQuery = (input ? input.value : '').toLowerCase().trim();
  renderServices();
}

function renderServices() {
  var container = document.getElementById('services-container');
  container.innerHTML = '';

  var filtered = allServices.filter(function (s) {
    var name = (s.name || '').toLowerCase();
    var desc = (s.description || '').toLowerCase();
    var matchesSearch = !searchQuery || name.indexOf(searchQuery) !== -1 || desc.indexOf(searchQuery) !== -1;
    var matchesCat = activeCat === 'all' || categorizeService(s.name) === activeCat;
    return matchesSearch && matchesCat;
  });

  if (filtered.length === 0) {
    container.innerHTML = '<div class="no-results">No treatments match your search.</div>';
    return;
  }

  var grouped = {};
  filtered.forEach(function (s) {
    var cat = categorizeService(s.name);
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(s);
  });

  var catOrder = CATEGORIES.slice(1).map(function (c) { return c.id; });
  catOrder.forEach(function (catId) {
    if (!grouped[catId]) return;
    var services = grouped[catId];
    var catLabel = CATEGORIES.find(function (c) { return c.id === catId; });
    var header = document.createElement('div');
    header.className = 'cat-title';
    header.innerHTML = (catLabel ? catLabel.label : catId) + ' (' + services.length + ')';
    container.appendChild(header);

    var grid = document.createElement('div');
    grid.className = 'services-grid';

    services.forEach(function (s) {
      var card = document.createElement('div');
      card.className = 'service-card';
      var imgUrl = categoryImg(categorizeService(s.name));
      var duration = s.duration_minutes ? '<div class="s-dur">' + s.duration_minutes + ' min</div>' : '';
      card.innerHTML = ''
        + '<div class="s-img">' + (imgUrl ? '<img src="' + imgUrl + '" alt="" loading="lazy">' : '') + '</div>'
        + '<div class="s-body">'
        + '<div class="s-name">' + (s.name || '') + '</div>'
        + '<div class="s-price">AED ' + (s.price != null ? Number(s.price).toLocaleString() : '—') + '</div>'
        + duration
        + '</div>';
      card.addEventListener('click', async function () {
        var { data: { session } } = await window.supabaseClient.auth.getSession();
        if (!session) {
          localStorage.setItem('redirectAfterLogin', window.location.href);
          window.location.href = 'login.html';
          return;
        }
        bookingState.serviceId = s.id;
        bookingState.serviceName = s.name || '';
        bookingState.servicePrice = s.price || 0;
        document.querySelectorAll('.service-card').forEach(function (c) { c.classList.remove('selected'); });
        card.classList.add('selected');
        showView('stylist');
        loadStylistView();
      });
      grid.appendChild(card);
    });

    container.appendChild(grid);
  });
}

// ---------- Load services ----------
async function loadServices() {
  var container = document.getElementById('services-container');
  container.innerHTML = '';
  var skGrid = document.createElement('div');
  skGrid.className = 'services-grid';
  for (var i = 0; i < 6; i++) {
    var sk = document.createElement('div');
    sk.className = 'skeleton skeleton-svc';
    skGrid.appendChild(sk);
  }
  container.appendChild(skGrid);

  var { data, error } = await window.supabaseClient
    .from('services')
    .select('*')
    .order('name', { ascending: true });

  if (error || !data || data.length === 0) {
    container.innerHTML = '<div style="color:#666;padding:12px;text-align:center">No treatments available.</div>';
    return;
  }

  allServices = data;
  renderCategoryChips();
  renderServices();
}

// ---------- Stylist preview on home ----------
async function loadStylistPreviews() {
  showSkeletons('stylists-scroll', 'stylist', 4);

  var { data, error } = await window.supabaseClient
    .from('stylists')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  var scroll = document.getElementById('stylists-scroll');
  scroll.innerHTML = '';

  if (error || !data || data.length === 0) {
    scroll.innerHTML = '<div style="color:#666;padding:12px;">No stylists available.</div>';
    return;
  }

  scroll.classList.add('stagger-grid');
  data.forEach(function (s) {
    var card = document.createElement('div');
    card.className = 'stylist-preview-card';
    var initial = (s.name || '?').charAt(0).toUpperCase();
    card.innerHTML = ''
      + '<div class="avatar">' + initial + '</div>'
      + '<div class="sp-name">' + (s.name || '') + '</div>'
      + '<div class="sp-role">' + (s.role || '') + '</div>'
      + '<div class="sp-status">&#x2713; Available</div>';
    scroll.appendChild(card);
  });
}

// ---------- View 2: Stylist selection ----------
async function loadStylistView() {
  var list = document.getElementById('stylist-list');
  list.innerHTML = '';
  for (var si = 0; si < 5; si++) {
    var sk = document.createElement('div');
    sk.className = 'skeleton skeleton-stylist-row';
    list.appendChild(sk);
  }

  var { data, error } = await window.supabaseClient
    .from('stylists')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  list.innerHTML = '';

  if (error || !data || data.length === 0) {
    list.innerHTML = '<div style="color:#666;padding:12px;">No stylists available.</div>';
    return;
  }

  data.forEach(function (s) {
    var row = document.createElement('div');
    row.className = 'stylist-row';
    var initial = (s.name || '?').charAt(0).toUpperCase();
    row.innerHTML = ''
      + '<div class="s-avatar">' + initial + '</div>'
      + '<div class="s-info"><div class="s-name">' + (s.name || '') + '</div><div class="s-role">' + (s.role || '') + '</div></div>'
      + '<div class="s-tag">Available</div>';
    row.addEventListener('click', function () {
      document.querySelectorAll('.stylist-row').forEach(function (r) { r.classList.remove('selected'); });
      row.classList.add('selected');
      bookingState.stylistId = s.id;
      bookingState.stylistName = s.name || '';
      bookingState.stylistRole = s.role || '';
      document.getElementById('btn-continue-stylist').disabled = false;
    });
    list.appendChild(row);
  });

  document.getElementById('btn-continue-stylist').onclick = function () {
    if (bookingState.stylistId) {
      showView('datetime');
      renderDatePicker();
      renderTimeSlots();
    }
  };

  // Filter chips
  document.querySelectorAll('#filter-chips .chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      document.querySelectorAll('#filter-chips .chip').forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
    });
  });
}

// ---------- View 3: Date & Time ----------
function renderDatePicker() {
  var strip = document.getElementById('date-strip');
  strip.innerHTML = '';
  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (var i = 0; i < 7; i++) {
    var d = new Date();
    d.setDate(d.getDate() + i);
    (function (chipEl, dateVal) {
      chipEl.className = 'date-chip' + (i === 0 ? ' selected' : '');
      chipEl.innerHTML = ''
        + '<div class="day">' + days[d.getDay()] + '</div>'
        + '<div class="num">' + d.getDate() + '</div>'
        + '<div class="mon">' + months[d.getMonth()] + '</div>';
      chipEl.addEventListener('click', function () {
        document.querySelectorAll('.date-chip').forEach(function (c) { c.classList.remove('selected'); });
        chipEl.classList.add('selected');
        selectedDate = dateVal;
        document.getElementById('slots-grid').querySelectorAll('.slot-chip').forEach(function (s) {
          s.classList.remove('selected');
        });
        document.getElementById('btn-continue-time').disabled = true;
      });
      strip.appendChild(chipEl);
      if (i === 0) selectedDate = dateVal;
    })(document.createElement('div'), new Date(d));
  }
}

function togglePeriod(period) {
  selectedPeriod = period;
  document.querySelectorAll('.toggle-btn').forEach(function (b) {
    b.classList.toggle('active', b.getAttribute('data-period') === period);
  });
  renderTimeSlots();
}

function renderTimeSlots() {
  var grid = document.getElementById('slots-grid');
  grid.innerHTML = '';
  var slots = [];

  if (selectedPeriod === 'am') {
    for (var h = 9; h <= 12; h++) {
      for (var m = 0; m < 60; m += 30) {
        if (h === 12 && m === 30) break;
        slots.push((h < 10 ? '0' : '') + h + ':' + (m === 0 ? '00' : '30'));
      }
    }
  } else {
    for (var h2 = 14; h2 <= 20; h2++) {
      for (var m2 = 0; m2 < 60; m2 += 30) {
        if (h2 === 20 && m2 === 30) break;
        slots.push(h2 + ':' + (m2 === 0 ? '00' : '30'));
      }
    }
  }

  slots.forEach(function (slot) {
    var chip = document.createElement('div');
    chip.className = 'slot-chip';
    chip.textContent = slot;
    chip.addEventListener('click', function () {
      grid.querySelectorAll('.slot-chip').forEach(function (c) { c.classList.remove('selected'); });
      chip.classList.add('selected');
      bookingState.bookingTime = slot;
      document.getElementById('btn-continue-time').disabled = false;
    });
    grid.appendChild(chip);
  });

  document.getElementById('btn-continue-time').onclick = function () {
    if (bookingState.bookingTime && selectedDate) {
      showView('checkout');
      renderCheckout();
    }
  };
}

// ---------- View 4: Checkout ----------
function renderCheckout() {
  var summary = document.getElementById('checkout-summary');
  var dateStr = selectedDate ? selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  summary.innerHTML = ''
    + '<div class="row label">Service</div><div class="row"><span>' + (bookingState.serviceName || '—') + '</span><span style="color:#D4AF37">AED ' + Number(bookingState.servicePrice).toLocaleString() + '</span></div>'
    + '<div class="divider"></div>'
    + '<div class="row label">Stylist</div><div class="row"><span>' + (bookingState.stylistName || '—') + '</span><span style="color:#888">' + (bookingState.stylistRole || '') + '</span></div>'
    + '<div class="divider"></div>'
    + '<div class="row label">Date &amp; Time</div><div class="row"><span>' + dateStr + '</span><span>' + (bookingState.bookingTime || '—') + '</span></div>';

  // Add-ons
  var addonsEl = document.getElementById('addons-list');
  addonsEl.innerHTML = '';
  bookingState.addons = [];
  ADDONS.forEach(function (a, idx) {
    var row = document.createElement('div');
    row.className = 'addon-row';
    row.innerHTML = ''
      + '<div class="a-info"><div class="a-name">' + a.name + '</div><div class="a-price">AED ' + a.price + '</div></div>'
      + '<div class="switch" data-idx="' + idx + '"></div>';
    row.querySelector('.switch').addEventListener('click', function () {
      this.classList.toggle('on');
      var added = bookingState.addons.indexOf(idx);
      if (added === -1) bookingState.addons.push(idx);
      else bookingState.addons.splice(added, 1);
      renderPriceBreakdown();
    });
    addonsEl.appendChild(row);
  });

  // Auto-fill customer name
  loadCustomerName();

  renderPriceBreakdown();

  // Confirm booking
  document.getElementById('btn-confirm-booking').onclick = confirmBooking;
}

async function loadCustomerName() {
  try {
    var { data: { user } } = await window.supabaseClient.auth.getUser();
    if (user && user.email) {
      var { data: cust } = await window.supabaseClient
        .from('customers')
        .select('name')
        .eq('email', user.email)
        .maybeSingle();
      if (cust && cust.name) {
        document.getElementById('customer-name').value = cust.name;
        bookingState.customerName = cust.name;
      }
    }
  } catch (e) { console.warn('Could not load customer name:', e); }

  document.getElementById('customer-name').addEventListener('input', function () {
    bookingState.customerName = this.value;
  });
  document.getElementById('customer-phone').addEventListener('input', function () {
    bookingState.customerPhone = this.value;
  });
}

function selectPayment(method) {
  bookingState.paymentMethod = method;
  document.querySelectorAll('.payment-opt').forEach(function (o) {
    o.classList.toggle('selected', o.getAttribute('data-method') === method);
  });
}

function renderPriceBreakdown() {
  var addonTotal = 0;
  bookingState.addons.forEach(function (idx) { addonTotal += ADDONS[idx].price; });
  var subtotal = bookingState.servicePrice + addonTotal;
  var vat = subtotal * 0.05;
  var grandTotal = subtotal + vat;

  var el = document.getElementById('price-breakdown');
  el.innerHTML = ''
    + '<div class="row"><span>Service</span><span>AED ' + Number(bookingState.servicePrice).toLocaleString() + '</span></div>'
    + (addonTotal > 0 ? '<div class="row"><span>Add-ons</span><span>AED ' + addonTotal.toLocaleString() + '</span></div>' : '')
    + '<div class="row"><span>Subtotal</span><span>AED ' + subtotal.toLocaleString() + '</span></div>'
    + '<div class="row"><span>VAT (5%)</span><span>AED ' + vat.toFixed(2) + '</span></div>'
    + '<div class="divider"></div>'
    + '<div class="row" style="font-weight:700;font-size:1rem"><span>Grand Total</span><span style="color:#D4AF37">AED ' + grandTotal.toFixed(2) + '</span></div>';
}

// ---------- View 5: Confirm & Success ----------
async function confirmBooking() {
  if (!bookingState.customerName.trim()) {
    alert('Please enter your name.');
    return;
  }

  var btn = document.getElementById('btn-confirm-booking');
  btn.disabled = true;
  btn.textContent = 'Confirming...';

  try {
    var { data: { user } } = await window.supabaseClient.auth.getUser();
    if (!user) { alert('Session expired. Please log in again.'); window.location.href = 'login.html'; return; }

    var year = selectedDate.getFullYear();
    var month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    var day = String(selectedDate.getDate()).padStart(2, '0');
    var bookingTimeISO = year + '-' + month + '-' + day + 'T' + bookingState.bookingTime + ':00';

    var { error } = await window.supabaseClient
      .from('bookings')
      .insert([{
        customer_id: user.id,
        service_id: bookingState.serviceId,
        stylist_id: bookingState.stylistId,
        start_time: bookingTimeISO,
        customer_name: bookingState.customerName
      }]);

    if (error) {
      alert('Booking failed: ' + error.message);
      btn.disabled = false;
      btn.textContent = 'Confirm Booking';
      return;
    }

    var ref = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = 0; i < 6; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length));

    document.getElementById('ref-code').textContent = ref;

    var dateStr2 = selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    document.getElementById('success-summary').innerHTML = ''
      + '<div class="row"><span>Service</span><span>' + (bookingState.serviceName || '') + '</span></div>'
      + '<div class="row"><span>Stylist</span><span>' + (bookingState.stylistName || '') + '</span></div>'
      + '<div class="row"><span>Date</span><span>' + dateStr2 + '</span></div>'
      + '<div class="row"><span>Time</span><span>' + (bookingState.bookingTime || '') + '</span></div>';

    showView('success');

  } catch (err) {
    console.error('Confirm booking error:', err);
    alert('An unexpected error occurred.');
    btn.disabled = false;
    btn.textContent = 'Confirm Booking';
  }
}

function resetBooking() {
  bookingState = {
    serviceId: null, serviceName: '', servicePrice: 0,
    stylistId: null, stylistName: '', stylistRole: '',
    bookingDate: null, bookingTime: null,
    addons: [], customerName: '', customerPhone: '', paymentMethod: 'cash'
  };
  selectedDate = null;
  selectedPeriod = 'am';
  activeCat = 'all';
  var input = document.getElementById('search-input');
  if (input) input.value = '';
  showView('home');
  loadServices();
  loadStylistPreviews();
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', async function () {
  var { data: { session } } = await window.supabaseClient.auth.getSession();
  document.getElementById('btn-login-header').style.display = session ? 'none' : '';
  document.getElementById('btn-logout-header').style.display = session ? '' : 'none';
  if (session) {
    var role = (localStorage.getItem('userRole') || '').toLowerCase();
    if (role === 'admin' || role === 'staff') {
      document.getElementById('btn-manager-dashboard').style.display = '';
    }
  }
  loadServices();
  loadStylistPreviews();
});
