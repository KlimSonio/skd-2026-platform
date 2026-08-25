import { CONFIG } from './config.js';

let allAttendees = [];
let visibleAttendees = [];
let selectedBadgeAttendee = null;
let currentStatusFilter = 'all';
let currentSearchQuery = '';
let currentPackageFilter = '';

// ================= 0. BRAMKA BEZPIECZEŃSTWA (AUTORYZACJA) =================
function isAuthenticated() {
  return !!sessionStorage.getItem('directus_admin_token');
}

function getAuthHeaders() {
  const token = sessionStorage.getItem('directus_admin_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

document.addEventListener('DOMContentLoaded', async () => {
  // Jeśli użytkownik nie jest zalogowany (brak tokena JWT), wyrzuć do admin.html
  if (!isAuthenticated()) {
    window.location.replace('/admin.html');
    return;
  }

  await fetchAttendees();
  setupEventListeners();
});

// ================= 1. POBIERANIE UCZESTNIKÓW =================
async function fetchAttendees() {
  const grid = document.getElementById('badges-grid');
  try {
    const res = await fetch(`${CONFIG.API_URL}/items/attendees?limit=-1&sort=last_name`, {
      headers: getAuthHeaders() // Bezpieczne odpytanie API
    });

    if (res.status === 401 || res.status === 403) {
      // Token wygasł lub jest nieprawidłowy
      sessionStorage.removeItem('directus_admin_token');
      window.location.replace('/admin.html');
      return;
    }

    const data = await res.json();
    allAttendees = data.data || [];
    
    populatePackageFilter();
    applyFiltersAndRender();
  } catch (err) {
    console.error('Błąd pobierania uczestników:', err);
    if (grid) {
      grid.innerHTML = `<div class="p-6 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold">Błąd połączenia z bazą: ${err.message}</div>`;
    }
  }
}

function populatePackageFilter() {
  const select = document.getElementById('badge-filter-package');
  if (!select) return;

  const packages = new Set();
  allAttendees.forEach(a => {
    if (Array.isArray(a.packages)) {
      a.packages.forEach(p => packages.add(p.trim()));
    } else if (typeof a.packages === 'string' && a.packages) {
      a.packages.split(',').forEach(p => {
        const clean = p.trim();
        if (clean) packages.add(clean);
      });
    }
  });

  const sorted = Array.from(packages).sort((a, b) => a.localeCompare(b, 'pl'));
  select.innerHTML = `<option value="">Wszystkie pakiety (${sorted.length})</option>` +
    sorted.map(p => `<option value="${p}">${p}</option>`).join('');
}

// ================= 2. FILTROWANIE =================
function filterAttendees() {
  const q = currentSearchQuery.toLowerCase().trim();

  return allAttendees.filter(a => {
    const payment = a.payment_status || 'unpaid';
    const isPaidOrVip = payment === 'paid' || payment === 'exempt' || payment === 'sponsor';

    // Status płatności
    if (currentStatusFilter === 'paid' && !isPaidOrVip) return false;
    if (currentStatusFilter === 'unpaid' && isPaidOrVip) return false;

    // Pakiet
    if (currentPackageFilter) {
      const pkgs = Array.isArray(a.packages) ? a.packages : (a.packages ? a.packages.split(',') : []);
      const hasPkg = pkgs.some(p => p.trim().toLowerCase() === currentPackageFilter.toLowerCase());
      if (!hasPkg) return false;
    }

    // Wyszukiwarka
    if (q) {
      const matchText = `${a.academic_title || ''} ${a.first_name || ''} ${a.last_name || ''} ${a.pwz || ''} ${a.qr_token || ''}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    return true;
  });
}

function updateCounters() {
  const total = allAttendees.length;
  const paid = allAttendees.filter(a => a.payment_status === 'paid' || a.payment_status === 'exempt' || a.payment_status === 'sponsor').length;
  const unpaid = total - paid;

  document.getElementById('count-all')?.replaceChildren(total);
  document.getElementById('count-paid')?.replaceChildren(paid);
  document.getElementById('count-unpaid')?.replaceChildren(unpaid);
  document.getElementById('total-visible-count')?.replaceChildren(visibleAttendees.length);
  document.getElementById('print-count')?.replaceChildren(visibleAttendees.length);
}

// ================= 3. GENEROWANIE KARTY IDENTYFIKATORA (90x60 mm) =================
function createBadgeElement(attendee, qrElementId) {
  const pkgs = Array.isArray(attendee.packages) ? attendee.packages : (attendee.packages ? attendee.packages.split(',') : []);
  const packagesHtml = pkgs.map(p => {
    const clean = p.trim();
    const isWorkshop = clean.toLowerCase().includes('warsztat') || clean.toLowerCase().includes('kurs');
    return `<span class="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-tight ${
      isWorkshop ? 'bg-slate-100 text-slate-800 border border-slate-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
    }">${clean}</span>`;
  }).join(' ');

  const card = document.createElement('div');
  card.className = 'badge-card bg-white border border-slate-200 rounded-xl p-3 flex flex-col justify-between shadow-2xs relative overflow-hidden cursor-pointer hover:border-slate-400 hover:shadow-md transition';

  const roleLabel = (attendee.payment_status === 'exempt' || attendee.payment_status === 'sponsor')
    ? 'VIP / GOŚĆ'
    : 'UCZESTNIK';

  card.innerHTML = `
    <!-- Nagłówek Identyfikatora -->
    <div class="flex items-center justify-between border-b pb-1.5 border-slate-100">
      <div class="flex items-center gap-1.5">
        <div class="w-2 h-2 rounded-full bg-slate-900"></div>
        <span class="text-[9px] font-bold uppercase tracking-wider text-slate-900">${CONFIG.CONFERENCE.NAME}</span>
      </div>
      <span class="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
        ${roleLabel}
      </span>
    </div>

    <!-- Dane uczestnika -->
    <div class="py-1">
      ${attendee.academic_title ? `<span class="text-[9px] font-bold uppercase tracking-wider text-slate-500 block leading-tight">${attendee.academic_title}</span>` : ''}
      <h2 class="text-sm font-bold text-slate-900 tracking-tight leading-tight mt-0.5">${attendee.first_name} ${attendee.last_name}</h2>
      ${attendee.pwz ? `<span class="text-[9px] font-mono font-medium text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 inline-block mt-1">PWZ: ${attendee.pwz}</span>` : ''}
    </div>

    <!-- Stopka: Pakiety + Kod QR -->
    <div class="flex items-end justify-between pt-1 border-t border-slate-100 gap-2">
      <div class="flex flex-wrap gap-1 max-w-[52mm] items-center">
        ${packagesHtml || '<span class="text-[8px] text-slate-400 italic">Pakiet Konferencyjny</span>'}
      </div>
      <div id="${qrElementId}" class="w-[20mm] h-[20mm] shrink-0 flex items-center justify-center bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs"></div>
    </div>
  `;

  return card;
}

function getAppQrUrl(attendee) {
  const token = attendee.qr_token || `ID-${attendee.id}`;
  return `${window.location.origin}/?token=${encodeURIComponent(token)}`;
}

// ================= 4. RENDEROWANIE SIATKI =================
function applyFiltersAndRender() {
  visibleAttendees = filterAttendees();
  updateCounters();

  const grid = document.getElementById('badges-grid');
  if (!grid) return;

  if (visibleAttendees.length === 0) {
    grid.innerHTML = '<div class="p-8 text-center text-slate-400 text-xs">Brak uczestników spełniających wybrane kryteria.</div>';
    return;
  }

  grid.innerHTML = '';
  visibleAttendees.forEach((att, idx) => {
    const qrId = `badge-qr-${att.id}-${idx}`;
    const card = createBadgeElement(att, qrId);
    card.onclick = () => openBadgeModal(att);
    grid.appendChild(card);

    new QRCode(document.getElementById(qrId), {
      text: getAppQrUrl(att),
      width: 72,
      height: 72,
      correctLevel: QRCode.CorrectLevel.M
    });
  });
}

// ================= 5. MODAL POWIĘKSZENIA & DRUK POJEDYNCZY =================
function openBadgeModal(attendee) {
  selectedBadgeAttendee = attendee;
  const modal = document.getElementById('badge-preview-modal');
  const container = document.getElementById('modal-badge-container');
  container.innerHTML = '';

  const modalQrId = `modal-qr-${attendee.id}`;
  const card = createBadgeElement(attendee, modalQrId);
  card.classList.remove('cursor-pointer', 'hover:border-slate-400', 'hover:shadow-md');
  card.classList.add('shadow-lg');
  container.appendChild(card);

  new QRCode(document.getElementById(modalQrId), {
    text: getAppQrUrl(attendee),
    width: 72,
    height: 72,
    correctLevel: QRCode.CorrectLevel.M
  });

  modal.classList.remove('hidden');
}

function closeBadgeModal() {
  document.getElementById('badge-preview-modal').classList.add('hidden');
  selectedBadgeAttendee = null;
}

function printSingleBadge() {
  if (!selectedBadgeAttendee) return;
  const area = document.getElementById('single-badge-print-area');
  area.innerHTML = '';

  const singleQrId = `print-single-qr-${selectedBadgeAttendee.id}`;
  const card = createBadgeElement(selectedBadgeAttendee, singleQrId);
  area.appendChild(card);

  new QRCode(document.getElementById(singleQrId), {
    text: getAppQrUrl(selectedBadgeAttendee),
    width: 72,
    height: 72,
    correctLevel: QRCode.CorrectLevel.M
  });

  document.body.classList.add('print-single-mode');
  window.print();
  document.body.classList.remove('print-single-mode');
}

// ================= 6. LISTENERY =================
function setupEventListeners() {
  document.querySelectorAll('.b-filter').forEach(btn => {
    btn.onclick = () => {
      currentStatusFilter = btn.dataset.filter;
      document.querySelectorAll('.b-filter').forEach(b => {
        b.className = 'b-filter px-2.5 py-1.5 rounded-lg font-medium transition bg-slate-100 text-slate-700 hover:bg-slate-200';
      });
      btn.className = 'b-filter px-2.5 py-1.5 rounded-lg font-medium transition bg-slate-900 text-white';
      applyFiltersAndRender();
    };
  });

  document.getElementById('badge-search-input')?.addEventListener('input', (e) => {
    currentSearchQuery = e.target.value;
    applyFiltersAndRender();
  });

  document.getElementById('badge-filter-package')?.addEventListener('change', (e) => {
    currentPackageFilter = e.target.value;
    applyFiltersAndRender();
  });

  document.getElementById('btn-print-action')?.addEventListener('click', () => {
    document.body.classList.remove('print-single-mode');
    window.print();
  });

  document.getElementById('btn-close-badge-modal')?.addEventListener('click', closeBadgeModal);
  document.getElementById('btn-close-badge-modal-bottom')?.addEventListener('click', closeBadgeModal);
  document.getElementById('btn-print-single-badge')?.addEventListener('click', printSingleBadge);
}