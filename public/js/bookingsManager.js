async function loadServices() {
  const { data, error } = await window.supabaseClient
    .from('services')
    .select('id, name')
    .order('name', { ascending: true });

  if (error) {
    console.error('Failed to load services:', error.message);
    return;
  }

  var select = document.getElementById('service-select');
  select.innerHTML = '<option value="">Select a service</option>';

  (data || []).forEach(function (s) {
    var opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = s.name;
    select.appendChild(opt);
  });
}

async function loadStylists() {
  const { data, error } = await window.supabaseClient
    .from('stylists')
    .select('id, name')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) {
    console.error('Failed to load stylists:', error.message);
    return;
  }

  var select = document.getElementById('stylist-select');
  select.innerHTML = '<option value="">Select a stylist</option>';

  (data || []).forEach(function (s) {
    var opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = s.name;
    select.appendChild(opt);
  });
}

async function loadBookings() {
  const { data, error } = await window.supabaseClient
    .from('bookings')
    .select('*, services(name), stylists(name)')
    .order('start_time', { ascending: false });

  if (error) {
    console.error('Failed to load bookings:', error.message);
    return;
  }

  var tbody = document.getElementById('bookings-table-body');
  tbody.innerHTML = '';

  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr class="empty"><td colspan="5">No bookings found.</td></tr>';
    return;
  }

  data.forEach(function (b) {
    var tr = document.createElement('tr');
    var time = new Date(b.start_time);
    var formatted = time.toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    tr.innerHTML = ''
      + '<td>' + (b.customer_name || '') + '</td>'
      + '<td>' + (b.services ? b.services.name : '') + '</td>'
      + '<td>' + (b.stylists ? b.stylists.name : '') + '</td>'
      + '<td>' + formatted + '</td>'
      + '<td><button class="btn-delete" data-id="' + b.id + '">Delete</button></td>';
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('.btn-delete').forEach(function (btn) {
    btn.addEventListener('click', async function () {
      var id = btn.getAttribute('data-id');
      var { error } = await window.supabaseClient.from('bookings').delete().eq('id', id);

      if (error) {
        console.error('Failed to delete booking:', error.message);
        alert('Failed to delete booking: ' + error.message);
        return;
      }

      await loadBookings();
    });
  });
}

function setDefaultDateTime() {
  var now = new Date();
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var value = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate())
    + 'T' + pad(now.getHours()) + ':' + pad(now.getMinutes());
  document.getElementById('appointment-time').value = value;
  document.getElementById('appointment-time').min = value;
}

document.addEventListener('DOMContentLoaded', function () {
  setDefaultDateTime();
  loadServices();
  loadStylists();
  loadBookings();

  document.getElementById('booking-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    var serviceId = document.getElementById('service-select').value;
    var stylistId = document.getElementById('stylist-select').value;
    var customerName = document.getElementById('customer-name').value.trim();
    var startTime = document.getElementById('appointment-time').value;

    if (!serviceId || !stylistId || !customerName || !startTime) {
      alert('Please fill in all fields.');
      return;
    }

    var { error } = await window.supabaseClient.from('bookings').insert([
      {
        service_id: serviceId,
        stylist_id: stylistId,
        customer_name: customerName,
        start_time: startTime
      }
    ]);

    if (error) {
      console.error('Failed to create booking:', error.message);
      alert('Failed to create booking: ' + error.message);
      return;
    }

    document.getElementById('booking-form').reset();
    await loadBookings();
  });
});
