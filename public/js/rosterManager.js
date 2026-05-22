async function loadStylists() {
  const { data, error } = await window.supabaseClient
    .from('stylists')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Failed to load stylists:', error.message);
    return;
  }

  const tbody = document.getElementById('stylist-table-body');
  tbody.innerHTML = '';

  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr class="empty"><td colspan="4">No stylists found.</td></tr>';
    return;
  }

  data.forEach(function (stylist) {
    var tr = document.createElement('tr');
    var statusClass = stylist.is_active ? 'status-available' : 'status-unavailable';
    var statusLabel = stylist.is_active ? 'Available' : 'Unavailable';
    var id = stylist.id;

    tr.innerHTML = ''
      + '<td>' + (stylist.name || '') + '</td>'
      + '<td>' + (stylist.role || '') + '</td>'
      + '<td class="' + statusClass + '">' + statusLabel + '</td>'
      + '<td>'
      + '<button class="btn-edit" data-id="' + id + '">Edit</button> '
      + '<button class="btn-delete" data-id="' + id + '">Delete</button>'
      + '</td>';
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('.btn-edit').forEach(function (btn) {
    btn.addEventListener('click', function () {
      editStylist(btn.getAttribute('data-id'));
    });
  });

  tbody.querySelectorAll('.btn-delete').forEach(function (btn) {
    btn.addEventListener('click', function () {
      deleteStylist(btn.getAttribute('data-id'));
    });
  });
}

var editingStylistId = null;
var stylistToDeleteId = null;

function openModal() {
  document.getElementById('stylist-modal').classList.add('show');
}

function closeModal() {
  document.getElementById('stylist-modal').classList.remove('show');
  editingStylistId = null;
  document.getElementById('modal-title').textContent = 'Add New Stylist';
  document.getElementById('btn-save').textContent = 'Save Stylist';
  document.getElementById('stylist-name').value = '';
  document.getElementById('stylist-role').value = '';
}

function editStylist(id) {
  editingStylistId = id;

  document.getElementById('modal-title').textContent = 'Edit Stylist';
  document.getElementById('btn-save').textContent = 'Update Stylist';

  document.getElementById('stylist-name').value = '';
  document.getElementById('stylist-role').value = '';

  window.supabaseClient.from('stylists').select('*').eq('id', id).single().then(function (result) {
    if (result.data) {
      document.getElementById('stylist-name').value = result.data.name || '';
      document.getElementById('stylist-role').value = result.data.role || '';
    }
  });

  openModal();
}

function deleteStylist(id) {
  stylistToDeleteId = id;
  document.getElementById('deleteModal').classList.add('show');
}

function closeDeleteModal() {
  document.getElementById('deleteModal').classList.remove('show');
  stylistToDeleteId = null;
}

async function saveStylist(e) {
  e.preventDefault();
  var name = document.getElementById('stylist-name').value.trim();
  var role = document.getElementById('stylist-role').value.trim();

  if (!name) {
    alert('Please enter a name.');
    return;
  }

  var error;

  if (editingStylistId) {
    var result = await window.supabaseClient.from('stylists').update({ name: name, role: role }).eq('id', editingStylistId);
    error = result.error;
  } else {
    var result = await window.supabaseClient.from('stylists').insert([{ name: name, role: role }]);
    error = result.error;
  }

  if (error) {
    console.error('Failed to save stylist:', error.message);
    alert('Failed to save stylist: ' + error.message);
    return;
  }

  closeModal();
  await loadStylists();
}

document.addEventListener('DOMContentLoaded', function () {
  loadStylists();

  document.getElementById('btn-add-stylist').addEventListener('click', function () {
    editingStylistId = null;
    document.getElementById('modal-title').textContent = 'Add New Stylist';
    document.getElementById('btn-save').textContent = 'Save Stylist';
    document.getElementById('stylist-name').value = '';
    document.getElementById('stylist-role').value = '';
    openModal();
  });

  document.getElementById('btn-cancel').addEventListener('click', closeModal);
  document.getElementById('stylist-form').addEventListener('submit', saveStylist);

  document.getElementById('stylist-modal').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
  });

  document.getElementById('confirmDeleteBtn').addEventListener('click', async function () {
    if (!stylistToDeleteId) return;

    var { error } = await window.supabaseClient.from('stylists').update({ is_active: false }).eq('id', stylistToDeleteId);

    if (error) {
      console.error('Failed to delete stylist:', error.message);
      alert('Failed to delete stylist: ' + error.message);
      return;
    }

    closeDeleteModal();
    await loadStylists();
  });

  document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);

  document.getElementById('deleteModal').addEventListener('click', function (e) {
    if (e.target === this) closeDeleteModal();
  });
});
