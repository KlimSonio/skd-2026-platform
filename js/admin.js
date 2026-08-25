import { CONFIG } from './config.js';

const ACADEMIC_TITLES = [
  'lek. med.', 'lek. dent.', 'dr n. med.', 'dr n. o zdr.', 'dr n. farm.',
  'dr hab. n. med.', 'dr hab. n. o zdr.', 'dr hab. n. med., prof. uczelni',
  'prof. dr hab. n. med.', 'prof. dr hab. n. o zdr.', 'prof. zw. dr hab. n. med.',
  'mgr', 'mgr piel.', 'mgr poł.', 'mgr farm.', 'mgr fizj.', 'lic.', 'lic. piel.', 'lic. poł.'
];

let attendees = [];
let currentMode = 'pre';
let currentStatFilter = 'all';
let searchFilter = '';
let packageFilter = 'all';
let pwzFilter = 'all';

document.addEventListener('DOMContentLoaded', async () => {
  setupAuth();
  setupEventListeners();
  setupAcademicAutocomplete('create-academic-title', 'create-academic-dropdown');
  setupAcademicAutocomplete('edit-academic-title', 'edit-academic-dropdown');
  
  if (isAuthenticated()) {
    document.getElementById('admin-login-screen')?.classList.add('hidden');
    await fetchAttendees();
  }
});

// ================= 1. AUTORYZACJA DIRECTUS =================
function setupAuth() {
  const loginForm = document.getElementById('admin-login-form');
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorMsg = document.getElementById('login-error-msg');
    const submitBtn = document.getElementById('btn-submit-login');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Logowanie...';

    try {
      const res = await fetch(`${CONFIG.API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok || !data.data?.access_token) {
        throw new Error('Błędne dane');
      }

      sessionStorage.setItem('directus_admin_token', data.data.access_token);
      document.getElementById('admin-login-screen').classList.add('hidden');
      errorMsg?.classList.add('hidden');
      await fetchAttendees();
    } catch {
      errorMsg?.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Zaloguj się';
    }
  });

  document.getElementById('btn-admin-logout')?.addEventListener('click', () => {
    sessionStorage.removeItem('directus_admin_token');
    attendees = [];
    document.getElementById('admin-login-screen').classList.remove('hidden');
  });
}

function isAuthenticated() {
  return !!sessionStorage.getItem('directus_admin_token');
}

function getAuthHeaders() {
  const token = sessionStorage.getItem('directus_admin_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// ================= 2. POBIERANIE I PRZETWARZANIE REKORDÓW =================
async function fetchAttendees() {
  try {
    const res = await fetch(`${CONFIG.API_URL}/items/attendees?limit=-1&sort=last_name`, {
      headers: getAuthHeaders()
    });

    if (res.status === 401 || res.status === 403) {
      sessionStorage.removeItem('directus_admin_token');
      document.getElementById('admin-login-screen').classList.remove('hidden');
      return;
    }

    const data = await res.json();
    attendees = data.data || [];
    
    updatePackageFilterOptions();
    updateKPICounters();
    renderQuickFilterButtons();
    renderTableHeaders();
    renderTableBody();
  } catch (err) {
    console.error('Błąd pobierania uczestników:', err);
    alert('Nie udało się pobrać listy uczestników z Directusa.');
  }
}

function updateKPICounters() {
  const total = attendees.length;
  const paid = attendees.filter(a => a.payment_status === 'paid').length;
  const exempt = attendees.filter(a => a.payment_status === 'exempt' || a.payment_status === 'sponsor').length;
  const unpaid = attendees.filter(a => a.payment_status === 'unpaid' || !a.payment_status).length;
  const attended = attendees.filter(a => a.attended).length;
  const pending = total - attended;

  document.getElementById('stat-pre-total').textContent = total;
  document.getElementById('stat-pre-paid').textContent = paid;
  document.getElementById('stat-pre-exempt').textContent = exempt;
  document.getElementById('stat-pre-unpaid').textContent = unpaid;

  const settled = paid + exempt;
  const settledPct = total > 0 ? Math.round((settled / total) * 100) : 0;
  document.getElementById('subbar-pre-ratio').textContent = `${settled} / ${total}`;
  document.getElementById('subbar-pre-pct').textContent = `${settledPct}%`;

  document.getElementById('stat-event-total').textContent = total;
  document.getElementById('stat-event-attended').textContent = attended;
  document.getElementById('stat-event-pending').textContent = pending;

  const attendancePct = total > 0 ? Math.round((attended / total) * 100) : 0;
  document.getElementById('stat-event-percentage').textContent = `${attendancePct}%`;
  document.getElementById('subbar-event-ratio').textContent = `${attended} / ${total}`;
  document.getElementById('subbar-event-pct').textContent = `${attendancePct}%`;

  const sigErrors = attendees.filter(a => a.attended && (!a.signature_data || a.signature_data.length < 50)).length;
  const sigBanner = document.getElementById('sig-warning-banner');
  if (sigErrors > 0) {
    sigBanner.classList.remove('hidden');
    document.getElementById('banner-error-count').textContent = sigErrors;
  } else {
    sigBanner.classList.add('hidden');
  }
}

function updatePackageFilterOptions() {
  const select = document.getElementById('filter-package');
  const uniquePackages = new Set();

  attendees.forEach(a => {
    if (Array.isArray(a.packages)) {
      a.packages.forEach(p => uniquePackages.add(p.trim()));
    } else if (typeof a.packages === 'string' && a.packages) {
      a.packages.split(',').forEach(p => {
        const clean = p.trim();
        if (clean) uniquePackages.add(clean);
      });
    }
  });

  select.innerHTML = '<option value="all">Wszystkie pakiety</option>';
  Array.from(uniquePackages).sort().forEach(pkg => {
    const opt = document.createElement('option');
    opt.value = pkg;
    opt.textContent = pkg;
    select.appendChild(opt);
  });
}

// ================= 3. RENDEROWANIE TABELI =================
function renderQuickFilterButtons() {
  const container = document.getElementById('quick-filters-container');
  container.innerHTML = '';

  const filters = currentMode === 'pre'
    ? [
        { id: 'all', label: 'Wszyscy' },
        { id: 'paid', label: 'Opłacone' },
        { id: 'exempt', label: 'Zwolnieni/VIP' },
        { id: 'unpaid', label: 'Nieopłacone' }
      ]
    : [
        { id: 'all', label: 'Wszyscy' },
        { id: 'attended', label: 'Wydano identyfikator' },
        { id: 'pending', label: 'Oczekujący' },
        { id: 'sig_error', label: 'Błąd podpisu' }
      ];

  filters.forEach(f => {
    const btn = document.createElement('button');
    btn.textContent = f.label;
    btn.className = `px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition ${
      currentStatFilter === f.id
        ? 'bg-slate-900 text-white shadow-2xs'
        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
    }`;
    btn.onclick = () => {
      currentStatFilter = f.id;
      renderQuickFilterButtons();
      renderTableBody();
    };
    container.appendChild(btn);
  });
}

function renderTableHeaders() {
  const thead = document.getElementById('table-head');
  thead.innerHTML = currentMode === 'pre'
    ? `
      <tr>
        <th class="py-2.5 px-3">Uczestnik</th>
        <th class="py-2.5 px-3">Tytuł</th>
        <th class="py-2.5 px-3">PWZ</th>
        <th class="py-2.5 px-3">E-mail</th>
        <th class="py-2.5 px-3">Pakiety / Warsztaty</th>
        <th class="py-2.5 px-3 text-center">Status płatności</th>
        <th class="py-2.5 px-3 text-right">Akcje</th>
      </tr>
    `
    : `
      <tr>
        <th class="py-2.5 px-3">Uczestnik</th>
        <th class="py-2.5 px-3">PWZ</th>
        <th class="py-2.5 px-3">Pakiety</th>
        <th class="py-2.5 px-3 text-center">Status Odprawy</th>
        <th class="py-2.5 px-3 text-center">Data / Czas</th>
        <th class="py-2.5 px-3 text-center">Podpis</th>
        <th class="py-2.5 px-3 text-right">Akcje</th>
      </tr>
    `;
}

function renderTableBody() {
  const tbody = document.getElementById('attendees-tbody');
  tbody.innerHTML = '';

  const filtered = attendees.filter(a => {
    // Szukajka
    if (searchFilter) {
      const matchText = `${a.first_name || ''} ${a.last_name || ''} ${a.pwz || ''} ${a.email || ''} ${a.qr_token || ''}`.toLowerCase();
      if (!matchText.includes(searchFilter)) return false;
    }

    // Filtr pakietu
    if (packageFilter !== 'all') {
      const pkgString = (Array.isArray(a.packages) ? a.packages.join(' ') : a.packages || '').toLowerCase();
      if (!pkgString.includes(packageFilter.toLowerCase())) return false;
    }

    // Filtr PWZ
    if (pwzFilter === 'with_pwz' && (!a.pwz || !a.pwz.trim())) return false;
    if (pwzFilter === 'without_pwz' && a.pwz && a.pwz.trim()) return false;

    // Szybkie filtry
    if (currentMode === 'pre') {
      if (currentStatFilter === 'paid' && a.payment_status !== 'paid') return false;
      if (currentStatFilter === 'exempt' && (a.payment_status !== 'exempt' && a.payment_status !== 'sponsor')) return false;
      if (currentStatFilter === 'unpaid' && (a.payment_status === 'paid' || a.payment_status === 'exempt' || a.payment_status === 'sponsor')) return false;
    } else {
      if (currentStatFilter === 'attended' && !a.attended) return false;
      if (currentStatFilter === 'pending' && a.attended) return false;
      if (currentStatFilter === 'sig_error' && (!a.attended || (a.signature_data && a.signature_data.length >= 50))) return false;
    }

    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-slate-400 text-xs">Brak uczestników spełniających kryteria.</td></tr>`;
    return;
  }

  filtered.forEach(a => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50/60 transition';

    if (currentMode === 'pre') {
      tr.innerHTML = `
        <td class="py-2 px-3 font-semibold text-slate-900">${a.last_name || ''} ${a.first_name || ''}</td>
        <td class="py-2 px-3 text-slate-600">${a.academic_title || '—'}</td>
        <td class="py-2 px-3 font-mono text-slate-600">${a.pwz || '—'}</td>
        <td class="py-2 px-3 text-slate-600">${a.email || '—'}</td>
        <td class="py-2 px-3 text-slate-600">${formatPackages(a.packages)}</td>
        <td class="py-2 px-3 text-center">${formatPaymentBadge(a.payment_status)}</td>
        <td class="py-2 px-3 text-right">
          <button data-edit-id="${a.id}" class="text-slate-600 hover:text-slate-900 font-semibold px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs transition">Edytuj</button>
        </td>
      `;
    } else {
      const checkinBadge = a.attended
        ? `<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">✓ Wydano</span>`
        : `<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600">Oczekuje</span>`;

      const checkinTime = a.attended_at ? formatTime(a.attended_at) : '—';
      let sigBadge = '—';
      if (a.attended) {
        sigBadge = (a.signature_data && a.signature_data.length > 50)
          ? `<button data-view-sig="${a.id}" class="text-[11px] font-semibold text-blue-600 hover:underline">Podgląd</button>`
          : `<span class="text-[11px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">Brak pliku</span>`;
      }

      tr.innerHTML = `
        <td class="py-2 px-3">
          <div class="font-semibold text-slate-900">${a.last_name || ''} ${a.first_name || ''}</div>
          <div class="text-[11px] text-slate-500 font-mono">${a.qr_token || ''}</div>
        </td>
        <td class="py-2 px-3 font-mono text-slate-600">${a.pwz || '—'}</td>
        <td class="py-2 px-3 text-slate-600">${formatPackages(a.packages)}</td>
        <td class="py-2 px-3 text-center">${checkinBadge}</td>
        <td class="py-2 px-3 text-center text-slate-600">${checkinTime}</td>
        <td class="py-2 px-3 text-center">${sigBadge}</td>
        <td class="py-2 px-3 text-right">
          <button data-edit-id="${a.id}" class="text-slate-600 hover:text-slate-900 font-semibold px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs transition">Edytuj</button>
        </td>
      `;
    }
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('[data-edit-id]').forEach(b => b.onclick = () => openEditModal(b.dataset.editId));
  tbody.querySelectorAll('[data-view-sig]').forEach(b => b.onclick = () => openSignatureModal(b.dataset.viewSig));
}

function formatPaymentBadge(status) {
  if (status === 'paid') return `<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Opłacone</span>`;
  if (status === 'exempt' || status === 'sponsor') return `<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">VIP / Zwolniony</span>`;
  return `<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">Nieopłacone</span>`;
}

function formatPackages(pkgData) {
  if (!pkgData) return '—';
  const list = (Array.isArray(pkgData) ? pkgData : pkgData.split(',')).map(p => p.trim()).filter(Boolean);
  return list.map(p => `<span class="inline-block bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-medium px-1.5 py-0.5 rounded mr-1 mb-0.5">${p}</span>`).join('') || '—';
}

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
  } catch { return iso; }
}

// ================= 4. MODALE: TWORZENIE & EDYCJA =================
function setupAcademicAutocomplete(inputId, dropdownId) {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);
  if (!input || !dropdown) return;

  function renderDropdown(val = '') {
    const q = val.toLowerCase().trim();
    const hits = ACADEMIC_TITLES.filter(t => t.toLowerCase().includes(q));
    if (hits.length === 0) {
      dropdown.classList.add('hidden');
      dropdown.innerHTML = '';
      return;
    }
    dropdown.innerHTML = '';
    hits.forEach(title => {
      const item = document.createElement('div');
      item.className = 'px-3 py-2 text-xs text-slate-800 hover:bg-slate-100 cursor-pointer transition select-none';
      item.textContent = title;
      item.onmousedown = (e) => {
        e.preventDefault();
        input.value = title;
        dropdown.classList.add('hidden');
      };
      dropdown.appendChild(item);
    });
    dropdown.classList.remove('hidden');
  }

  input.addEventListener('focus', () => renderDropdown(input.value));
  input.addEventListener('input', () => renderDropdown(input.value));
  input.addEventListener('blur', () => setTimeout(() => dropdown.classList.add('hidden'), 150));
}

function openEditModal(id) {
  const att = attendees.find(a => String(a.id) === String(id));
  if (!att) return;

  const pkgStr = Array.isArray(att.packages) ? att.packages.join(', ') : att.packages || '';
  document.getElementById('edit-id').value = att.id;
  document.getElementById('edit-academic-title').value = att.academic_title || '';
  document.getElementById('edit-first-name').value = att.first_name || '';
  document.getElementById('edit-last-name').value = att.last_name || '';
  document.getElementById('edit-pwz').value = att.pwz || '';
  document.getElementById('edit-email').value = att.email || '';
  document.getElementById('edit-packages').value = pkgStr;
  document.getElementById('edit-payment-status').value = att.payment_status || 'unpaid';
  document.getElementById('edit-qr-token').value = att.qr_token || '';

  document.getElementById('edit-attendee-modal').classList.remove('hidden');
}

function openSignatureModal(id) {
  const att = attendees.find(a => String(a.id) === String(id));
  if (!att || !att.signature_data) return;

  document.getElementById('sig-modal-name').textContent = `Podpis: ${att.first_name} ${att.last_name}`;
  document.getElementById('sig-modal-img').src = att.signature_data;
  document.getElementById('sig-modal').classList.remove('hidden');
}

// ================= 5. LISTENERY I AKCJE =================
function setupEventListeners() {
  // Przełączanie trybu
  const modePreBtn = document.getElementById('btn-mode-pre');
  const modeEventBtn = document.getElementById('btn-mode-event');

  function setMode(mode) {
    currentMode = mode;
    currentStatFilter = 'all';
    const ind = document.getElementById('header-mode-indicator');

    if (mode === 'pre') {
      modePreBtn.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all bg-white text-slate-900 border border-slate-200 shadow-2xs';
      modeEventBtn.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all text-slate-600 hover:text-slate-900';
      document.getElementById('subbar-pre').classList.remove('hidden');
      document.getElementById('subbar-event').classList.add('hidden');
      document.getElementById('kpi-pre').classList.remove('hidden');
      document.getElementById('kpi-event').classList.add('hidden');
      if (ind) ind.textContent = 'Tryb: Rejestracja & Finanse';
    } else {
      modeEventBtn.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all bg-white text-slate-900 border border-slate-200 shadow-2xs';
      modePreBtn.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all text-slate-600 hover:text-slate-900';
      document.getElementById('subbar-event').classList.remove('hidden');
      document.getElementById('subbar-pre').classList.add('hidden');
      document.getElementById('kpi-event').classList.remove('hidden');
      document.getElementById('kpi-pre').classList.add('hidden');
      if (ind) ind.textContent = 'Tryb: Dzień Konferencji';
    }
    renderQuickFilterButtons();
    renderTableHeaders();
    renderTableBody();
  }

  modePreBtn?.addEventListener('click', () => setMode('pre'));
  modeEventBtn?.addEventListener('click', () => setMode('event'));

  // Filtry
  document.getElementById('search-input')?.addEventListener('input', (e) => {
    searchFilter = e.target.value.toLowerCase().trim();
    renderTableBody();
  });
  document.getElementById('filter-package')?.addEventListener('change', (e) => {
    packageFilter = e.target.value;
    renderTableBody();
  });
  document.getElementById('filter-pwz')?.addEventListener('change', (e) => {
    pwzFilter = e.target.value;
    renderTableBody();
  });
  document.getElementById('btn-reset-filters')?.addEventListener('click', () => {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-package').value = 'all';
    document.getElementById('filter-pwz').value = 'all';
    searchFilter = '';
    packageFilter = 'all';
    pwzFilter = 'all';
    currentStatFilter = 'all';
    renderQuickFilterButtons();
    renderTableBody();
  });

  // KPI karty
  document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('click', () => {
      currentStatFilter = card.dataset.statFilter || 'all';
      renderQuickFilterButtons();
      renderTableBody();
    });
  });

  document.getElementById('btn-filter-sig-errors')?.addEventListener('click', () => {
    setMode('event');
    currentStatFilter = 'sig_error';
    renderQuickFilterButtons();
    renderTableBody();
  });

  document.getElementById('btn-refresh')?.addEventListener('click', fetchAttendees);
  document.getElementById('btn-export-csv')?.addEventListener('click', exportToCSV);

  // Modal Create
  const createModal = document.getElementById('create-attendee-modal');
  document.getElementById('btn-open-create-modal')?.addEventListener('click', () => createModal.classList.remove('hidden'));
  document.getElementById('btn-close-create-modal')?.addEventListener('click', () => createModal.classList.add('hidden'));
  document.getElementById('btn-cancel-create')?.addEventListener('click', () => createModal.classList.add('hidden'));

  document.getElementById('create-attendee-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('create-academic-title').value.trim();
    const first = document.getElementById('create-first-name').value.trim();
    const last = document.getElementById('create-last-name').value.trim();
    const pwz = document.getElementById('create-pwz').value.trim();
    const email = document.getElementById('create-email').value.trim();
    const pkg = document.getElementById('create-packages').value.trim();
    const payment = document.getElementById('create-payment-status').value;

    const token = `MED26-${last.toUpperCase().replace(/[^A-Z]/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const payload = {
      academic_title: title || null,
      first_name: first,
      last_name: last,
      pwz: pwz || null,
      email: email || null,
      packages: pkg ? pkg.split(',').map(p => p.trim()).filter(Boolean) : [],
      payment_status: payment,
      qr_token: token,
      attended: false
    };

    try {
      const res = await fetch(`${CONFIG.API_URL}/items/attendees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Błąd zapisu');

      createModal.classList.add('hidden');
      document.getElementById('create-attendee-form').reset();

      // Modal QR
      document.getElementById('qr-success-name').textContent = `${title ? title + ' ' : ''}${first} ${last}`;
      document.getElementById('qr-success-token').textContent = token;
      const qrEl = document.getElementById('new-attendee-qrcode');
      qrEl.innerHTML = '';
      new QRCode(qrEl, { text: token, width: 140, height: 140 });
      document.getElementById('qr-success-modal').classList.remove('hidden');

      await fetchAttendees();
    } catch {
      alert('Wystąpił błąd podczas dodawania uczestnika.');
    }
  });

  document.getElementById('btn-close-qr-success')?.addEventListener('click', () => {
    document.getElementById('qr-success-modal').classList.add('hidden');
  });

  // Modal Edit
  const editModal = document.getElementById('edit-attendee-modal');
  document.getElementById('btn-close-edit-modal')?.addEventListener('click', () => editModal.classList.add('hidden'));
  document.getElementById('btn-cancel-edit')?.addEventListener('click', () => editModal.classList.add('hidden'));

  document.getElementById('edit-attendee-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const title = document.getElementById('edit-academic-title').value.trim();
    const first = document.getElementById('edit-first-name').value.trim();
    const last = document.getElementById('edit-last-name').value.trim();
    const pwz = document.getElementById('edit-pwz').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const pkg = document.getElementById('edit-packages').value.trim();
    const payment = document.getElementById('edit-payment-status').value;
    const token = document.getElementById('edit-qr-token').value.trim();

    const payload = {
      academic_title: title || null,
      first_name: first,
      last_name: last,
      pwz: pwz || null,
      email: email || null,
      packages: pkg ? pkg.split(',').map(p => p.trim()).filter(Boolean) : [],
      payment_status: payment,
      qr_token: token
    };

    try {
      const res = await fetch(`${CONFIG.API_URL}/items/attendees/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Błąd edycji');

      editModal.classList.add('hidden');
      await fetchAttendees();
    } catch {
      alert('Wystąpił błąd podczas zapisywania zmian.');
    }
  });

  // Modal Sig
  document.getElementById('btn-close-sig-modal')?.addEventListener('click', () => {
    document.getElementById('sig-modal').classList.add('hidden');
  });
}

// ================= 6. EKSPORT CSV =================
function exportToCSV() {
  if (attendees.length === 0) {
    alert('Brak danych do eksportu.');
    return;
  }

  const headers = ['ID', 'Tytuł', 'Imię', 'Nazwisko', 'PWZ', 'Email', 'Pakiety', 'Status płatności', 'Token QR', 'Odprawiono', 'Czas odprawy'];
  const rows = attendees.map(a => {
    const pkgs = Array.isArray(a.packages) ? a.packages.join('; ') : a.packages || '';
    return [
      a.id,
      `"${(a.academic_title || '').replace(/"/g, '""')}"`,
      `"${(a.first_name || '').replace(/"/g, '""')}"`,
      `"${(a.last_name || '').replace(/"/g, '""')}"`,
      `"${(a.pwz || '').replace(/"/g, '""')}"`,
      `"${(a.email || '').replace(/"/g, '""')}"`,
      `"${pkgs.replace(/"/g, '""')}"`,
      a.payment_status || '',
      a.qr_token || '',
      a.attended ? 'TAK' : 'NIE',
      a.attended_at || ''
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', `uczestnicy_eksport_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}