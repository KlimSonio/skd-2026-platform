import { CONFIG } from './config.js';

const PIN_FLOW_TRIGGER_URL = `${CONFIG.API_URL}/flows/trigger/7f72f7ac-7e51-4528-bf0b-448f2ce9ad13`;

let currentOperator = null;
let currentAttendee = null;
let html5QrCode = null;
let currentPinInput = '';

let sigCanvas, sigCtx;
let isDrawing = false;
let hasSignature = false;

document.addEventListener('DOMContentLoaded', () => {
  initPinPad();
  initSignaturePad();
  checkSavedSession();
  setupEventListeners();
});

// ================= 1. BEZPIECZNA WERYFIKACJA PIN =================
function initPinPad() {
  document.querySelectorAll('.pin-key').forEach(key => {
    key.addEventListener('click', () => {
      const val = key.dataset.val;
      if (val === 'clear') currentPinInput = '';
      else if (val === 'backspace') currentPinInput = currentPinInput.slice(0, -1);
      else if (currentPinInput.length < 4) currentPinInput += val;

      updatePinDots();
      if (currentPinInput.length === 4) verifyPin(currentPinInput);
    });
  });

  window.addEventListener('keydown', (e) => {
    const lockScreen = document.getElementById('pin-lock-screen');
    if (lockScreen.classList.contains('hidden')) return;

    if (e.key >= '0' && e.key <= '9' && currentPinInput.length < 4) {
      currentPinInput += e.key;
      updatePinDots();
      if (currentPinInput.length === 4) verifyPin(currentPinInput);
    } else if (e.key === 'Backspace') {
      currentPinInput = currentPinInput.slice(0, -1);
      updatePinDots();
    } else if (e.key === 'Escape') {
      currentPinInput = '';
      updatePinDots();
    }
  });
}

function updatePinDots() {
  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById(`pin-dot-${i}`);
    if (!dot) continue;
    dot.className = i <= currentPinInput.length
      ? 'w-4 h-4 rounded-full bg-slate-900 scale-110 transition-transform'
      : 'w-4 h-4 rounded-full border-2 border-slate-300 bg-transparent transition-transform';
  }
}

async function verifyPin(pin) {
  const errorMsg = document.getElementById('pin-error-msg');
  const dotsContainer = document.getElementById('pin-dots-container');

  try {
    const res = await fetch(PIN_FLOW_TRIGGER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: String(pin).trim() })
    });

    const result = await res.json();
    const matched = result.find_operator || result.data || result;
    const operator = Array.isArray(matched) ? matched[0] : (matched && matched.id ? matched : null);

    if (operator && operator.id) {
      if (errorMsg) errorMsg.classList.add('hidden');
      loginOperator(operator);
    } else {
      triggerPinError(errorMsg, dotsContainer);
    }
  } catch (err) {
    console.error('Błąd weryfikacji PIN:', err);
    triggerPinError(errorMsg, dotsContainer);
  }
}

function triggerPinError(errorMsg, dotsContainer) {
  if (errorMsg) errorMsg.classList.remove('hidden');
  if (dotsContainer) dotsContainer.classList.add('animate-bounce');
  setTimeout(() => {
    if (dotsContainer) dotsContainer.classList.remove('animate-bounce');
    currentPinInput = '';
    updatePinDots();
  }, 500);
}

function loginOperator(operator) {
  currentOperator = operator;
  sessionStorage.setItem('active_operator', JSON.stringify(operator));

  const nameEl = document.getElementById('operator-display-name');
  const initEl = document.getElementById('operator-avatar-initials');

  const displayName = operator.name || `Stanowisko #${operator.id}`;
  const initials = operator.initials || displayName.slice(0, 2).toUpperCase();

  if (nameEl) nameEl.textContent = displayName;
  if (initEl) initEl.textContent = initials;

  document.getElementById('pin-lock-screen').classList.add('hidden');
  currentPinInput = '';
  updatePinDots();
  startScanner();
}

function logoutOperator() {
  sessionStorage.removeItem('active_operator');
  currentOperator = null;
  stopScanner();
  resetToCheckinView();
  document.getElementById('pin-lock-screen').classList.remove('hidden');
  currentPinInput = '';
  updatePinDots();
}

function checkSavedSession() {
  const saved = sessionStorage.getItem('active_operator');
  if (saved) {
    try {
      loginOperator(JSON.parse(saved));
    } catch {
      logoutOperator();
    }
  } else {
    document.getElementById('pin-lock-screen').classList.remove('hidden');
  }
}

// ================= 2. SKANER QR & WYSZUKIWANIE =================
async function startScanner() {
  const placeholder = document.getElementById('scanner-loading-placeholder');
  if (typeof Html5Qrcode === 'undefined') {
    setTimeout(startScanner, 150);
    return;
  }
  try {
    if (!html5QrCode) html5QrCode = new Html5Qrcode('reader');
    await html5QrCode.start(
      { facingMode: 'environment' },
      { fps: 15, qrbox: { width: 250, height: 250 } },
      (decodedText) => onScanSuccess(decodedText),
      () => {}
    );
    if (placeholder) placeholder.classList.add('hidden');
  } catch {
    if (placeholder) {
      placeholder.innerHTML = `
        <span class="text-rose-500 font-bold">Brak dostępu do kamery.</span>
        <span class="text-[10px] text-slate-400">Wpisz token lub nazwisko poniżej.</span>
      `;
    }
  }
}

async function stopScanner() {
  try {
    if (html5QrCode && html5QrCode.isScanning) await html5QrCode.stop();
  } catch {}
}

async function onScanSuccess(token) {
  if (!token) return;
  stopScanner();
  await findAndLoadAttendee(token.trim());
}

async function findAndLoadAttendee(query) {
  try {
    const cleanQ = encodeURIComponent(query);
    const url = `${CONFIG.API_URL}/items/attendees?filter[_or][0][qr_token][_eq]=${cleanQ}&filter[_or][1][pwz][_eq]=${cleanQ}&filter[_or][2][last_name][_icontains]=${cleanQ}&limit=1`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      showAlert(`Nie znaleziono uczestnika dla: "${query}"`, 'Brak wyników');
      startScanner();
      return;
    }

    currentAttendee = data.data[0];

    if (currentAttendee.attended) {
      const time = currentAttendee.attended_at ? new Date(currentAttendee.attended_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
      const by = currentAttendee.checked_in_by ? ` przez: ${currentAttendee.checked_in_by}` : '';
      const confirmOpen = await showConfirm(
        `Uczestnik ${currentAttendee.first_name} ${currentAttendee.last_name} został już odprawiony o ${time}${by}. Czy chcesz otworzyć kartę ponownie?`,
        'Uczestnik już odprawiony'
      );
      if (!confirmOpen) {
        resetToCheckinView();
        return;
      }
    }

    renderAttendeeCard(currentAttendee);
  } catch (err) {
    showAlert('Błąd połączenia z bazą: ' + err.message, 'Błąd sieci');
    startScanner();
  }
}

function renderAttendeeCard(att) {
  document.getElementById('scanner-section').classList.add('hidden');
  document.getElementById('attendee-card-section').classList.remove('hidden');

  document.getElementById('card-attendee-name').textContent = `${att.academic_title ? att.academic_title + ' ' : ''}${att.first_name} ${att.last_name}`;
  document.getElementById('card-attendee-pwz').textContent = att.pwz ? `PWZ: ${att.pwz}` : 'Brak PWZ';
  document.getElementById('card-attendee-token').textContent = att.qr_token || `ID-${att.id}`;

  renderPaymentBadge(att.payment_status || 'unpaid');

  const pkgContainer = document.getElementById('card-packages-container');
  let pkgs = [];
  if (Array.isArray(att.packages)) pkgs = att.packages;
  else if (typeof att.packages === 'string' && att.packages) pkgs = att.packages.split(',');

  pkgContainer.innerHTML = pkgs.length > 0
    ? pkgs.map(p => `<span class="text-xs font-bold px-2.5 py-1 rounded-lg border bg-sky-50 border-sky-300 text-sky-900">${p.trim()}</span>`).join('')
    : `<span class="text-xs text-slate-400 italic">Podstawowy pakiet konferencyjny</span>`;

  clearSignature();
  setTimeout(resizeCanvas, 100);
}

function renderPaymentBadge(status) {
  const badge = document.getElementById('card-payment-badge');
  const warning = document.getElementById('card-unpaid-warning');

  if (status === 'paid') {
    badge.textContent = '✓ OPŁACONE';
    badge.className = 'px-3 py-1 rounded-full text-[11px] font-extrabold border bg-emerald-100 border-emerald-400 text-emerald-800';
    warning.classList.add('hidden');
  } else if (status === 'exempt' || status === 'sponsor') {
    badge.textContent = '★ VIP / ZWOLNIONY';
    badge.className = 'px-3 py-1 rounded-full text-[11px] font-extrabold border bg-purple-100 border-purple-400 text-purple-800';
    warning.classList.add('hidden');
  } else {
    badge.textContent = '✕ NIEOPŁACONE';
    badge.className = 'px-3 py-1 rounded-full text-[11px] font-extrabold border bg-rose-100 border-rose-400 text-rose-800 animate-pulse';
    warning.classList.remove('hidden');
  }
}

// ================= 3. CANVAS PODPISU =================
function initSignaturePad() {
  sigCanvas = document.getElementById('sig-canvas');
  if (!sigCanvas) return;
  sigCtx = sigCanvas.getContext('2d');

  function getPos(e) {
    const rect = sigCanvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function start(e) {
    isDrawing = true;
    hasSignature = true;
    document.getElementById('sig-placeholder').classList.add('hidden');
    const pos = getPos(e);
    sigCtx.beginPath();
    sigCtx.moveTo(pos.x, pos.y);
    if (e.cancelable) e.preventDefault();
  }

  function draw(e) {
    if (!isDrawing) return;
    const pos = getPos(e);
    sigCtx.lineTo(pos.x, pos.y);
    sigCtx.stroke();
    if (e.cancelable) e.preventDefault();
  }

  function stop() { isDrawing = false; }

  sigCanvas.addEventListener('mousedown', start);
  sigCanvas.addEventListener('mousemove', draw);
  window.addEventListener('mouseup', stop);

  sigCanvas.addEventListener('touchstart', start, { passive: false });
  sigCanvas.addEventListener('touchmove', draw, { passive: false });
  window.addEventListener('touchend', stop);
}

function resizeCanvas() {
  if (!sigCanvas) return;
  const rect = sigCanvas.getBoundingClientRect();
  sigCanvas.width = rect.width;
  sigCanvas.height = rect.height;
  sigCtx.strokeStyle = '#0f172a';
  sigCtx.lineWidth = 2.5;
  sigCtx.lineCap = 'round';
  sigCtx.lineJoin = 'round';
}

function clearSignature() {
  if (!sigCanvas || !sigCtx) return;
  sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
  hasSignature = false;
  document.getElementById('sig-placeholder').classList.remove('hidden');
}

// ================= 4. ZAPIS ODPRAWY =================
async function confirmCheckin() {
  if (!currentAttendee) return;
  if (!hasSignature) {
    showAlert('Proszę złożyć podpis przed wydaniem identyfikatora!', 'Wymagany podpis');
    return;
  }

  const btn = document.getElementById('btn-confirm-checkin');
  btn.disabled = true;
  btn.textContent = 'Zapisywanie odprawy...';

  const sigBase64 = sigCanvas.toDataURL('image/png');
  const opLabel = currentOperator 
    ? `${currentOperator.name}${currentOperator.initials ? ' (' + currentOperator.initials + ')' : ''}`
    : 'Stanowisko Główne';

  const payload = {
    attended: true,
    attended_at: new Date().toISOString(),
    signature_data: sigBase64,
    checked_in_by: opLabel
  };

  try {
    const res = await fetch(`${CONFIG.API_URL}/items/attendees/${currentAttendee.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      resetToCheckinView();
    } else {
      const err = await res.json();
      showAlert('Błąd zapisu odprawy: ' + JSON.stringify(err), 'Błąd zapisu');
    }
  } catch (err) {
    showAlert('Błąd połączenia: ' + err.message, 'Błąd sieci');
  } finally {
    btn.disabled = false;
    btn.textContent = '✓ Wydaj Identyfikator';
  }
}

function resetToCheckinView() {
  currentAttendee = null;
  document.getElementById('attendee-card-section').classList.add('hidden');
  document.getElementById('scanner-section').classList.remove('hidden');
  const input = document.getElementById('manual-token-input');
  if (input) input.value = '';
  startScanner();
}

function setupEventListeners() {
  document.getElementById('btn-logout-operator').onclick = logoutOperator;
  document.getElementById('btn-clear-sig').onclick = clearSignature;
  document.getElementById('btn-cancel-checkin').onclick = resetToCheckinView;
  document.getElementById('btn-confirm-checkin').onclick = confirmCheckin;

  document.getElementById('btn-manual-search').onclick = () => {
    const q = document.getElementById('manual-token-input').value.trim();
    if (q) findAndLoadAttendee(q);
  };

  document.getElementById('manual-token-input').onkeydown = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      findAndLoadAttendee(e.target.value.trim());
    }
  };

  document.getElementById('btn-mark-paid-now').onclick = async () => {
    if (!currentAttendee) return;
    try {
      const res = await fetch(`${CONFIG.API_URL}/items/attendees/${currentAttendee.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_status: 'paid' })
      });
      if (res.ok) {
        currentAttendee.payment_status = 'paid';
        renderPaymentBadge('paid');
      }
    } catch {
      showAlert('Błąd aktualizacji statusu płatności.', 'Błąd');
    }
  };
}

function showAlert(msg, title = 'Informacja') {
  return new Promise(resolve => {
    const modal = document.getElementById('custom-alert-modal');
    document.getElementById('alert-message').textContent = msg;
    document.getElementById('alert-title').textContent = title;
    modal.classList.remove('hidden');
    document.getElementById('btn-close-alert').onclick = () => {
      modal.classList.add('hidden');
      resolve();
    };
  });
}

function showConfirm(msg, title = 'Wymagane potwierdzenie') {
  return new Promise(resolve => {
    const modal = document.getElementById('custom-confirm-modal');
    document.getElementById('confirm-message').textContent = msg;
    document.getElementById('confirm-title').textContent = title;
    modal.classList.remove('hidden');
    document.getElementById('btn-confirm-yes').onclick = () => {
      modal.classList.add('hidden');
      resolve(true);
    };
    document.getElementById('btn-confirm-no').onclick = () => {
      modal.classList.add('hidden');
      resolve(false);
    };
  });
}