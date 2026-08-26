import { CONFIG } from './config.js';

// ================= 0. HAPTYKA =================
function triggerHaptic(type = 'light') {
  if (!('vibrate' in navigator)) return;
  try {
    switch (type) {
      case 'light': navigator.vibrate(10); break;
      case 'selection': navigator.vibrate(14); break;
      case 'success': navigator.vibrate([20, 35, 30]); break;
      case 'upvote': navigator.vibrate(22); break;
      case 'error': navigator.vibrate([60, 40, 60]); break;
      case 'warning': navigator.vibrate(25); break;
      default: navigator.vibrate(12);
    }
  } catch {}
}

// ================= 1. WYBÓR JĘZYKA & FIRST LAUNCH MODAL =================
function setupLanguageSelection() {
  const currentToken = new URLSearchParams(window.location.search).get('token') || localStorage.getItem('skd_attendee_token');
  const tokenParam = currentToken ? `?token=${encodeURIComponent(currentToken)}` : '';
  const isEnPage = window.location.pathname.includes('index-en.html');
  const savedLang = localStorage.getItem('skd_lang_chosen');

  const langModal = document.getElementById('lang-select-modal');
  const btnModalPl = document.getElementById('btn-modal-choose-pl');
  const btnModalEn = document.getElementById('btn-modal-choose-en');

  const btnPl = document.getElementById('btn-lang-pl');
  const btnEn = document.getElementById('btn-lang-en');

  if (btnPl && btnEn) {
    if (isEnPage) {
      btnEn.classList.add('active');
      btnPl.classList.remove('active');
    } else {
      btnPl.classList.add('active');
      btnEn.classList.remove('active');
    }

    btnPl.onclick = () => selectLanguage('pl', tokenParam);
    btnEn.onclick = () => selectLanguage('en', tokenParam);
  }

  if (!savedLang && langModal) {
    langModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    if (btnModalPl) {
      btnModalPl.onclick = () => {
        langModal.style.display = 'none';
        document.body.style.overflow = '';
        selectLanguage('pl', tokenParam);
      };
    }

    if (btnModalEn) {
      btnModalEn.onclick = () => {
        langModal.style.display = 'none';
        document.body.style.overflow = '';
        selectLanguage('en', tokenParam);
      };
    }
  }
}

function selectLanguage(lang, tokenParam) {
  localStorage.setItem('skd_lang_chosen', lang);

  if (lang === 'en' && !window.location.pathname.includes('index-en.html')) {
    window.location.href = `/index-en.html${tokenParam}`;
  } else if (lang === 'pl' && window.location.pathname.includes('index-en.html')) {
    window.location.href = `/${tokenParam}`;
  }
}

// ================= 2. PROFIL UCZESTNIKA & BRAMKA PIN =================
let currentAttendeeProfile = null;
let pendingTokenFromUrl = null;

async function initAttendeeProfile() {
  const urlParams = new URLSearchParams(window.location.search);
  const tokenFromUrl = urlParams.get('token');
  const storedToken = localStorage.getItem('skd_attendee_token');
  const storedPin = localStorage.getItem('skd_attendee_pin');

  if (tokenFromUrl) {
    pendingTokenFromUrl = tokenFromUrl;
    window.history.replaceState({}, document.title, window.location.pathname);

    if (tokenFromUrl !== storedToken) {
      showAuthPinModal();
      return;
    }
  }

  const activeToken = storedToken;
  if (activeToken && storedPin) {
    try {
      const res = await fetch(`${CONFIG.API_URL}/items/attendees?filter[qr_token][_eq]=${encodeURIComponent(activeToken)}&filter[app_pin][_eq]=${encodeURIComponent(storedPin)}&limit=1`);
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        currentAttendeeProfile = data.data[0];
        localStorage.setItem('skd_attendee_data', JSON.stringify(currentAttendeeProfile));
        applyAttendeeProfile(currentAttendeeProfile);
        return;
      }
    } catch (err) {
      console.warn('Offline / Błąd API:', err);
    }
  }

  const cachedData = localStorage.getItem('skd_attendee_data');
  if (cachedData) {
    try {
      currentAttendeeProfile = JSON.parse(cachedData);
      applyAttendeeProfile(currentAttendeeProfile);
      return;
    } catch {}
  }

  document.getElementById('guest-token-banner')?.classList.remove('hidden');
}

function showAuthPinModal() {
  const modal = document.getElementById('auth-pin-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  const pinInput = document.getElementById('auth-pin-input');
  if (pinInput) {
    pinInput.value = '';
    setTimeout(() => pinInput.focus(), 150);
  }
  document.getElementById('auth-pin-error')?.classList.add('hidden');
  document.body.style.overflow = 'hidden';
}

function closeAuthPinModal() {
  const modal = document.getElementById('auth-pin-modal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

async function verifyAuthPin() {
  const pinInput = document.getElementById('auth-pin-input');
  const errorEl = document.getElementById('auth-pin-error');
  const btnVerify = document.getElementById('btn-auth-verify-pin');
  const isEn = window.location.pathname.includes('index-en.html');
  const pin = pinInput?.value.trim();
  const tokenToVerify = pendingTokenFromUrl || localStorage.getItem('skd_attendee_token');

  if (!pin || pin.length !== 4 || !tokenToVerify) {
    if (errorEl) {
      errorEl.textContent = isEn ? 'Enter the 4-digit PIN.' : 'Wpisz 4-cyfrowy kod PIN.';
      errorEl.classList.remove('hidden');
    }
    triggerHaptic('error');
    return;
  }

  if (btnVerify) {
    btnVerify.disabled = true;
    btnVerify.textContent = isEn ? 'Verifying...' : 'Sprawdzanie...';
  }

  try {
    const res = await fetch(`${CONFIG.API_URL}/items/attendees?filter[qr_token][_eq]=${encodeURIComponent(tokenToVerify)}&filter[app_pin][_eq]=${encodeURIComponent(pin)}&limit=1`);
    const data = await res.json();

    if (data.data && data.data.length > 0) {
      currentAttendeeProfile = data.data[0];
      localStorage.setItem('skd_attendee_token', tokenToVerify);
      localStorage.setItem('skd_attendee_pin', pin);
      localStorage.setItem('skd_attendee_data', JSON.stringify(currentAttendeeProfile));
      applyAttendeeProfile(currentAttendeeProfile);
      closeAuthPinModal();
      triggerHaptic('success');
      showToast(isEn ? '✓ Profile unlocked!' : '✓ Profil odblokowany pomyślnie!');
    } else {
      if (errorEl) {
        errorEl.textContent = isEn ? 'Invalid PIN code. Please try again.' : 'Nieprawidłowy kod PIN. Spróbuj ponownie.';
        errorEl.classList.remove('hidden');
      }
      triggerHaptic('error');
      if (pinInput) {
        pinInput.value = '';
        pinInput.focus();
      }
    }
  } catch (err) {
    if (errorEl) {
      errorEl.textContent = isEn ? 'Connection error. Check internet.' : 'Błąd połączenia. Sprawdź internet.';
      errorEl.classList.remove('hidden');
    }
    triggerHaptic('error');
  } finally {
    if (btnVerify) {
      btnVerify.disabled = false;
      btnVerify.textContent = isEn ? 'Unlock My Profile' : 'Odblokuj mój profil';
    }
  }
}

function applyAttendeeProfile(att) {
  const isEn = window.location.pathname.includes('index-en.html');
  document.getElementById('guest-token-banner')?.classList.add('hidden');

  const fullName = `${att.academic_title ? att.academic_title + ' ' : ''}${att.first_name} ${att.last_name}`;
  const nameEl = document.getElementById('user-display-name');
  const pwzEl = document.getElementById('user-display-pwz');
  const badgeEl = document.getElementById('user-display-badge');
  const badgeDot = document.getElementById('user-badge-dot');
  const badgeText = document.getElementById('user-badge-text');

  if (nameEl) nameEl.textContent = fullName;
  if (pwzEl) pwzEl.innerHTML = att.pwz ? `${isEn ? 'License' : 'PWZ'}: <strong style="color:#0f172a;">${att.pwz}</strong>` : (isEn ? 'Attendee' : 'Uczestnik');

  if (badgeEl && badgeDot && badgeText) {
    if (att.attended) {
      badgeEl.style.background = '#ecfdf5';
      badgeEl.style.borderColor = '#a7f3d0';
      badgeEl.style.color = '#065f46';
      badgeDot.style.backgroundColor = '#10b981';
      badgeText.textContent = isEn ? 'PRESENT' : 'OBECNY';
    } else {
      badgeEl.style.background = '#fef3c7';
      badgeEl.style.borderColor = '#fde68a';
      badgeEl.style.color = '#92400e';
      badgeDot.style.backgroundColor = '#f59e0b';
      badgeText.textContent = isEn ? 'PENDING CHECK-IN' : 'PRZED ODPRAWĄ';
    }
  }

  const oilName = document.getElementById('oil-attendee-name');
  const oilPwz = document.getElementById('oil-attendee-pwz');
  const oilStatus = document.getElementById('oil-attendance-status');
  if (oilName) oilName.textContent = fullName;
  if (oilPwz) oilPwz.textContent = att.pwz || (isEn ? 'No License Number' : 'Brak PWZ');
  if (oilStatus) oilStatus.textContent = att.attended ? (isEn ? 'Confirmed at reception (100%)' : 'Potwierdzona na recepcji (100%)') : (isEn ? 'Awaiting reception check-in' : 'Oczekuje na odprawę');
}

// ================= 3. BAZA QUIZÓW I DEDYKOWANYCH Q&A =================
const QUESTIONS_BY_PIN = {
  '1040': {
    pin: '1040', roomShort: 'SALA A', session: 'Sesja II: Kardiologia Interwencyjna',
    speaker: 'prof. dr hab. n. med. Andrzej Nowak', speakerShort: 'prof. A. Nowak',
    topic: 'Ostre zespoły wieńcowe u chorych z cukrzycą',
    question: 'Przypadek kliniczny: 58-letni pacjent z NSTEMI i cukrzycą typu 2.',
    questionSub: 'Pytanie: Jaki schemat farmakoterapii wdrożysz w pierwszej dobie?',
    options: [
      { key: 'A', text: 'Podwójna terapia przeciwpłytkowa + heparyna niefrakcjonowana', pct: 18 },
      { key: 'B', text: 'Monoterapia ASA + inhibitor P2Y12 nowej generacji', pct: 68 },
      { key: 'C', text: 'Wdrożenie statyny wysokiej intensywności i odroczenie DAPT', pct: 14 }
    ],
    qaList: [{ id: 'q1', text: 'Czy u chorych z eGFR poniżej 30 modyfikujemy dawkę nasycającą?', votes: 14, upvoted: false }]
  },
  '2080': {
    pin: '2080', roomShort: 'SALA B', session: 'Sesja Rytmu Serca & Elektrofizjologia',
    speaker: 'dr hab. n. med. Ewa Wiśniewska', speakerShort: 'dr hab. E. Wiśniewska',
    topic: 'Migotanie przedsionków – ablacja vs farmakoterapia',
    question: 'Przypadek: 45-letni sportowiec z napadowym migotaniem przedsionków (EHRA III).',
    questionSub: 'Pytanie: Co wybierasz jako postępowanie pierwszego rzutu?',
    options: [
      { key: 'A', text: 'Wczesna ablacja RF / krioablacja ujść żył płucnych', pct: 74 },
      { key: 'B', text: 'Przewlekła terapia beta-adrenolitykiem + NOAC', pct: 21 },
      { key: 'C', text: 'Wyłącznie kardiowersja elektryczna na żądanie', pct: 5 }
    ],
    qaList: [{ id: 'q2', text: 'Jaki jest zalecany minimalny czas przerwy w treningach po krioablacji?', votes: 8, upvoted: false }]
  },
  '3010': {
    pin: '3010', roomShort: 'WARSZTAT', session: 'Warsztat USG: Echokardiografia Obciążeniowa',
    speaker: 'dr n. med. Marek Zieliński', speakerShort: 'dr M. Zieliński',
    topic: 'Praktyczne aspekty oceny żywotności mięśnia sercowego',
    question: 'Obraz USG: Asymetria kurczliwości ściany dolno-bocznej.',
    questionSub: 'Pytanie: Które naczynie wieńcowe jest najbardziej podejrzane?',
    options: [
      { key: 'A', text: 'Gałąź okalająca (LCx)', pct: 62 },
      { key: 'B', text: 'Gałąź międzykomorowa przednia (LAD)', pct: 26 },
      { key: 'C', text: 'Prawa tętnica wieńcowa (RCA)', pct: 12 }
    ],
    qaList: [{ id: 'q3', text: 'Czy stosujemy kontrast echokardiograficzny przy słabym oknie?', votes: 5, upvoted: false }]
  }
};

const VENUE_NAVIGATION_DATA = {
  'SALA A': {
    roomTitle: 'Sala Audytoryjna A (Główna)',
    level: 'Poziom +1 (Skrzydło Północne)',
    icon: '🏛️',
    steps: [
      'Z holu głównego skieruj się ku schodom ruchomym obok rejestracji.',
      'Wjedź schodami na 1. piętro.',
      'Skręć w prawo i miń strefę kawową.',
      'Wejście do Sali A znajduje się na końcu korytarza po lewej stronie.'
    ]
  },
  'SALA B': {
    roomTitle: 'Sala Wykładowa B (Kliniczna)',
    level: 'Poziom +1 (Skrzydło Południowe)',
    icon: '🏥',
    steps: [
      'Z recepcji skieruj się w lewo ku Windom B.',
      'Wjedź windą na 1. piętro.',
      'Kieruj się prosto korytarzem obok Stoiska OIL.',
      'Sala B znajduje się po prawej stronie naprzeciwko VIP Lounge.'
    ]
  },
  'WARSZTAT': {
    roomTitle: 'Sala Warsztatowa USG',
    level: 'Poziom 0 (Parter)',
    icon: '🔬',
    steps: [
      'W holu głównym idź prosto wzdłuż pasażu wystawienniczego.',
      'Miń stoisko Philips po prawej stronie.',
      'Przejdź przez przeszklony łącznik do Strefy Symulacji Medycznej.'
    ]
  }
};

function getNavigationGuide(roomShort) {
  const cleanName = (roomShort || '').trim().toUpperCase();
  for (const key in VENUE_NAVIGATION_DATA) {
    if (cleanName.includes(key)) return VENUE_NAVIGATION_DATA[key];
  }
  return {
    roomTitle: roomShort || 'Sala Konferencyjna',
    level: 'Centrum Konferencyjne',
    icon: '📍',
    steps: ['Sprawdź oznaczenia multimedialne na totemach LCD przy wejściach do sal.']
  };
}

const BANNED_PATTERNS = [/kurw/i, /chuj/i, /jeb/i, /pierd/i, /pizd/i, /debil/i, /idiot/i];
function sanitizeQuestion(text) {
  const clean = text.trim().replace(/\s+/g, ' ');
  if (clean.length < 10) return { valid: false, error: 'Pytanie jest zbyt krótkie (min. 10 znaków).' };
  for (const pattern of BANNED_PATTERNS) {
    if (pattern.test(clean)) return { valid: false, error: 'Treść zawiera niedozwolone słownictwo.' };
  }
  return { valid: true, text: clean };
}

function cleanString(str) {
  return (str || '').toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l").replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();
}

let activeQuestionData = null;
let currentGlobalDay = 'day-1';
let currentActiveTab = 'program';
let userCalendarPlan = JSON.parse(localStorage.getItem('med_conf_cal_plan') || '["d1_s2", "d2_s1"]');
let savedContacts = JSON.parse(localStorage.getItem('skd_saved_contacts') || '[]');
let netQrScanner = null;

// ================= 4. KALENDARZ I WYSZUKIWARKA =================
function renderProgramTimeline() {
  const container = document.getElementById('program-timeline');
  if (!container || typeof CALENDAR_SLOTS === 'undefined') return;
  const slots = CALENDAR_SLOTS[currentGlobalDay] || [];
  container.innerHTML = buildTimelineHTML(slots, false);
  attachSessionClickListeners();
}

function renderMyPlanTimeline() {
  const container = document.getElementById('myplan-timeline');
  const isEn = window.location.pathname.includes('index-en.html');
  if (!container || typeof CALENDAR_SLOTS === 'undefined') return;

  if (userCalendarPlan.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:36px 16px; background:#f8fafc; border:1px dashed #cbd5e1; border-radius:12px; margin-top:8px;">
        <div style="font-size:14px; font-weight:700; color:#0f172a; margin-bottom:4px;">${isEn ? 'Your plan is empty' : 'Twój plan jest pusty'}</div>
        <div style="font-size:11.5px; color:#64748b; margin-bottom:14px;">${isEn ? 'Go to "Schedule" and add sessions to your plan.' : 'Przejdź do zakładki „Program” i dodaj wykłady do swojego planu.'}</div>
        <button id="btn-empty-go-program" class="btn-primary" style="font-size:11.5px; padding:8px 16px;">${isEn ? 'Browse Schedule' : 'Przeglądaj Program'}</button>
      </div>
    `;
    document.getElementById('btn-empty-go-program')?.addEventListener('click', () => switchTab('program'));
    return;
  }

  let fullHtml = '';
  ['day-1', 'day-2', 'day-3'].forEach(dKey => {
    const slots = CALENDAR_SLOTS[dKey] || [];
    const dayHtml = buildTimelineHTML(slots, true);
    if (dayHtml.trim()) {
      fullHtml += `
        <div class="myplan-day-section" style="margin-bottom:24px;">
          <div style="font-size:11.5px; font-weight:800; color:#1e3a8a; background:#e0f2fe; padding:6px 12px; border-radius:8px; margin-bottom:12px; display:inline-flex;">
            📅 ${DAY_NAMES[dKey].toUpperCase()}
          </div>
          ${dayHtml}
        </div>
      `;
    }
  });
  container.innerHTML = fullHtml;
  attachSessionClickListeners();
}

function buildTimelineHTML(slots, onlyMyPlan) {
  const isEn = window.location.pathname.includes('index-en.html');
  let output = '';
  slots.forEach(slot => {
    const visibleSessions = onlyMyPlan
      ? slot.sessions.filter(s => !s.isBreak && userCalendarPlan.includes(s.id))
      : slot.sessions;

    if (visibleSessions.length === 0) return;

    let sessionsHtml = '<div class="session-cards">';
    visibleSessions.forEach(sess => {
      const searchData = cleanString(`${sess.title} ${sess.speaker} ${sess.roomShort}`);
      if (sess.isBreak) {
        sessionsHtml += `
          <div class="card break-card" data-session-id="${sess.id}" data-search="${searchData}">
            <div class="card-head">
              <span class="badge-break">${isEn ? 'BREAK' : 'ORGANIZACYJNA'}</span>
              <span style="font-size:9.5px; font-weight:700; color:#64748b; margin-left:auto;">${sess.roomShort}</span>
            </div>
            <div class="card-title">${sess.title}</div>
            <div class="card-speaker">${sess.speaker}</div>
          </div>
        `;
      } else {
        const isSelected = userCalendarPlan.includes(sess.id);
        sessionsHtml += `
          <div class="card ${isSelected ? 'selected' : ''}" data-session-id="${sess.id}" data-search="${searchData}">
            <div class="card-head">
              <span class="badge-room">${sess.roomShort}</span>
              <button class="btn-add-plan ${isSelected ? 'in-plan' : ''}" data-toggle-plan="${sess.id}">
                ${isSelected ? (isEn ? '✓ IN PLAN' : '✓ W PLANIE') : (isEn ? '+ Add to plan' : '+ Dodaj do planu')}
              </button>
            </div>
            <div class="card-title">${sess.title}</div>
            <div class="card-speaker">${sess.speaker}</div>
          </div>
        `;
      }
    });
    sessionsHtml += '</div>';

    output += `
      <div class="session-slot">
        <div class="time-col">
          <div class="time-start" style="${slot.isBreak ? 'color:#64748b;' : ''}">${slot.timeSlot.split(' - ')[0]}</div>
          <div class="time-end">${slot.timeSlot.split(' - ')[1]}</div>
        </div>
        <div class="t-dot ${slot.isBreak ? 'break' : ''}"></div>
        ${sessionsHtml}
      </div>
    `;
  });
  return output;
}

function attachSessionClickListeners() {
  document.querySelectorAll('.card[data-session-id]').forEach(card => {
    card.onclick = (e) => {
      if (e.target.closest('[data-toggle-plan]')) return;
      openSessionModal(card.dataset.sessionId);
    };
  });

  document.querySelectorAll('[data-toggle-plan]').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      toggleCalendarSession(btn.dataset.togglePlan);
    };
  });
}

function toggleCalendarSession(sessionId) {
  const isEn = window.location.pathname.includes('index-en.html');
  if (userCalendarPlan.includes(sessionId)) {
    userCalendarPlan = userCalendarPlan.filter(id => id !== sessionId);
    triggerHaptic('warning');
    showToast(isEn ? 'Removed from My Plan' : 'Usunięto z Twojego Planu');
  } else {
    userCalendarPlan.push(sessionId);
    triggerHaptic('success');
    showToast(isEn ? '✓ Added to My Plan' : '✓ Dodano do Twojego Planu');
  }
  localStorage.setItem('med_conf_cal_plan', JSON.stringify(userCalendarPlan));
  updateMyPlanCount();
  renderProgramTimeline();
  if (currentActiveTab === 'myplan') renderMyPlanTimeline();
}

function updateMyPlanCount() {
  const countEl = document.getElementById('nav-my-count');
  if (countEl) countEl.innerText = userCalendarPlan.length;
}

function switchGlobalDay(dayKey) {
  triggerHaptic('selection');
  currentGlobalDay = dayKey;
  ['day-1', 'day-2', 'day-3'].forEach((d, i) => {
    const btn = document.getElementById(`btn-day-${i + 1}`);
    if (btn) {
      if (d === dayKey) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });
  renderProgramTimeline();
}

// ================= 5. MODAL SESJI & NAWIGACJA =================
function findSessionById(sessionId) {
  if (typeof CALENDAR_SLOTS === 'undefined') return null;
  for (const dayKey in CALENDAR_SLOTS) {
    for (const slot of CALENDAR_SLOTS[dayKey]) {
      const found = slot.sessions.find(s => s.id === sessionId);
      if (found) {
        return { session: found, timeSlot: slot.timeSlot, dayLabel: DAY_NAMES[dayKey] || dayKey };
      }
    }
  }
  return null;
}

function openSessionModal(sessionId) {
  const data = findSessionById(sessionId);
  if (!data) return;

  const isEn = window.location.pathname.includes('index-en.html');
  triggerHaptic('light');
  const { session, timeSlot, dayLabel } = data;
  const isSelected = userCalendarPlan.includes(session.id);
  const nav = getNavigationGuide(session.roomShort);

  const modal = document.getElementById('session-modal');
  const modalBody = document.getElementById('modal-body');
  if (!modal || !modalBody) return;

  const navStepsHtml = nav.steps.map((step, idx) => `
    <div style="display:flex; align-items:flex-start; gap:8px; margin-bottom:6px;">
      <span style="display:inline-flex; align-items:center; justify-content:center; width:17px; height:17px; background:#2563eb; color:#ffffff; font-size:9.5px; font-weight:800; border-radius:50%; flex-shrink:0; margin-top:1px;">${idx + 1}</span>
      <span style="font-size:11px; color:#334155; line-height:1.4;">${step}</span>
    </div>
  `).join('');

  modalBody.innerHTML = `
    <div class="modal-meta-row" style="margin-bottom:10px;">
      <span class="modal-badge">📅 ${dayLabel}</span>
      <span class="modal-badge">🕒 ${timeSlot}</span>
      <span class="modal-badge" style="background:#eff6ff; color:#1e3a8a; font-weight:700;">📍 ${session.roomShort || 'Main'}</span>
    </div>
    <div class="modal-title" style="margin-bottom:8px;">${session.title}</div>
    <div class="modal-speaker-box" style="margin-bottom:12px;">
      <div>
        <div style="font-size:10px; color:#64748b; font-weight:700; text-transform:uppercase;">${isEn ? 'SPEAKER' : 'PRELEGENT'}</div>
        <div class="modal-speaker-name">${session.speaker || (isEn ? 'Scientific Committee' : 'Komitet Naukowy')}</div>
      </div>
    </div>
    <div class="modal-desc" style="margin-bottom:12px;">${session.description || (isEn ? 'No additional description provided.' : 'Brak dodatkowego opisu sesji.')}</div>
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px; margin-bottom:12px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #e2e8f0; padding-bottom:6px;">
        <span style="font-size:11.5px; font-weight:800; color:#0f172a;">${nav.icon} ${nav.roomTitle}</span>
        <span style="font-size:10px; font-weight:700; color:#2563eb; background:#dbeafe; padding:2px 7px; border-radius:6px;">${nav.level}</span>
      </div>
      <div style="background:#ffffff; border:1px dashed #cbd5e1; padding:9px 10px; border-radius:8px;">
        ${navStepsHtml}
      </div>
    </div>
    ${!session.isBreak ? `
      <button id="modal-plan-toggle" class="btn-add-plan ${isSelected ? 'in-plan' : ''}" style="width:100%; justify-content:center; padding:10px;">
        ${isSelected ? (isEn ? '✓ REMOVE FROM MY PLAN' : '✓ USUŃ Z MOJEGO PLANU') : (isEn ? '+ ADD TO MY PLAN' : '+ DODAJ DO MOJEGO PLANU')}
      </button>
    ` : ''}
  `;

  document.getElementById('modal-plan-toggle')?.addEventListener('click', () => {
    toggleCalendarSession(session.id);
    openSessionModal(session.id);
  });

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeSessionModal() {
  const modal = document.getElementById('session-modal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

// ================= 6. OBSŁUGA QUIZU & PIN =================
function processPin(pin) {
  const errorMsg = document.getElementById('main-pin-error');
  const isEn = window.location.pathname.includes('index-en.html');
  if (QUESTIONS_BY_PIN[pin]) {
    errorMsg?.classList.add('hidden');
    triggerHaptic('success');
    renderQuestion(QUESTIONS_BY_PIN[pin]);
    document.getElementById('vote-pin-welcome').classList.add('hidden');
    document.getElementById('vote-active-view').classList.remove('hidden');
    showToast(isEn ? `✓ Joined session (${QUESTIONS_BY_PIN[pin].roomShort})` : `✓ Dołączono do sesji (${QUESTIONS_BY_PIN[pin].roomShort})`);
  } else {
    errorMsg?.classList.remove('hidden');
    triggerHaptic('error');
  }
}

function renderQuestion(data) {
  const isEn = window.location.pathname.includes('index-en.html');
  activeQuestionData = data;
  document.getElementById('active-pin-badge').innerText = data.pin;
  document.getElementById('vote-room-tag').innerText = data.roomShort;
  document.getElementById('vote-session-name').innerText = data.session;
  document.getElementById('vote-speaker-name').innerText = `${isEn ? 'Speaker' : 'Prelegent'}: ${data.speaker}`;
  document.getElementById('vote-topic-title').innerText = `${isEn ? 'Topic' : 'Temat'}: ${data.topic}`;
  document.getElementById('vote-question-text').innerText = data.question;
  document.getElementById('vote-question-sub').innerText = data.questionSub;
  document.getElementById('qa-speaker-badge').innerText = data.speakerShort;

  const optionsContainer = document.getElementById('vote-options');
  optionsContainer.innerHTML = '';
  document.getElementById('vote-alert').classList.add('hidden');

  data.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'vote-btn';
    btn.innerHTML = `
      <div style="display:flex; align-items:center; position:relative; z-index:2; width:82%;">
        <span class="vote-badge-letter">${opt.key}</span>
        <span style="font-size:11px; font-weight:600; text-align:left; color:#0f172a; line-height:1.3;">${opt.text}</span>
      </div>
      <div class="vote-bar"></div>
      <span class="vote-pct hidden" style="position:relative; z-index:2; font-size:11px; font-weight:800; font-family:monospace; color:#1e3a8a; background:#fff; padding:1px 6px; border-radius:4px; border:1px solid #bfdbfe;">0%</span>
    `;
    btn.onclick = () => {
      triggerHaptic('success');
      document.querySelectorAll('.vote-btn').forEach((b, i) => {
        b.disabled = true;
        const o = data.options[i];
        if (o.key === opt.key) b.classList.add('selected');
        const bar = b.querySelector('.vote-bar');
        const pct = b.querySelector('.vote-pct');
        pct.classList.remove('hidden');
        pct.innerText = `${o.pct}%`;
        bar.style.width = `${o.pct}%`;
      });
      document.getElementById('vote-alert').classList.remove('hidden');
    };
    optionsContainer.appendChild(btn);
  });

  renderDedicatedQaList();
}

function renderDedicatedQaList() {
  const container = document.getElementById('dedicated-qa-list');
  const isEn = window.location.pathname.includes('index-en.html');
  container.innerHTML = '';
  if (!activeQuestionData?.qaList || activeQuestionData.qaList.length === 0) {
    container.innerHTML = `<div style="font-size:10px; color:#94a3b8; text-align:center; padding:6px;">${isEn ? 'No questions yet. Be the first!' : 'Brak pytań. Zadaj pierwsze!'}</div>`;
    return;
  }
  activeQuestionData.qaList.forEach((q) => {
    const item = document.createElement('div');
    item.className = 'qa-item';
    item.innerHTML = `
      <div class="qa-item-text">${q.text}</div>
      <button class="btn-upvote ${q.upvoted ? 'active' : ''}">${q.upvoted ? (isEn ? '✓ Upvoted' : '✓ Poparto') : (isEn ? 'Upvote' : 'Popieram')} (${q.votes})</button>
    `;
    item.querySelector('button').onclick = () => {
      triggerHaptic('upvote');
      q.votes += q.upvoted ? -1 : 1;
      q.upvoted = !q.upvoted;
      renderDedicatedQaList();
    };
    container.appendChild(item);
  });
}

// ================= 7. MODUŁ NETWORKINGU I WIZYTÓWEK =================
function renderSavedContacts() {
  const container = document.getElementById('net-contacts-list');
  const countEl = document.getElementById('net-contacts-count');
  const isEn = window.location.pathname.includes('index-en.html');
  if (!container) return;

  if (countEl) countEl.textContent = savedContacts.length;

  if (savedContacts.length === 0) {
    container.innerHTML = `<div style="font-size:10.5px; color:#94a3b8; text-align:center; padding:10px;">${isEn ? 'No saved contacts yet.' : 'Brak zapisanych wizytówek.'}</div>`;
    return;
  }

  container.innerHTML = savedContacts.map((contact, idx) => {
    const title = contact.academic_title ? `${contact.academic_title} ` : '';
    const pwzInfo = contact.pwz ? `<span style="font-size:9.5px; color:#0284c7; font-weight:700;">${isEn ? 'Lic.' : 'PWZ'}: ${contact.pwz}</span>` : `<span style="font-size:9.5px; color:#64748b;">${isEn ? 'Attendee' : 'Uczestnik'}</span>`;
    return `
      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:10px; display:flex; justify-content:space-between; align-items:center; gap:8px;">
        <div style="min-width:0;">
          <div style="font-size:12px; font-weight:700; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${title}${contact.first_name} ${contact.last_name}</div>
          <div>${pwzInfo}</div>
        </div>
        <div style="display:flex; gap:4px; flex-shrink:0;">
          <button data-download-contact="${idx}" class="btn-primary" style="font-size:10px; padding:5px 8px;">📥 VCF</button>
          <button data-delete-contact="${idx}" style="background:#f1f5f9; color:#ef4444; border:1px solid #cbd5e1; border-radius:6px; font-size:10px; padding:5px 8px; cursor:pointer;">✕</button>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('[data-download-contact]').forEach(btn => {
    btn.onclick = () => {
      const c = savedContacts[parseInt(btn.dataset.downloadContact, 10)];
      if (c) downloadVCard(c);
    };
  });

  container.querySelectorAll('[data-delete-contact]').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.dataset.deleteContact, 10);
      savedContacts.splice(idx, 1);
      localStorage.setItem('skd_saved_contacts', JSON.stringify(savedContacts));
      renderSavedContacts();
      showToast(isEn ? 'Contact removed' : 'Usunięto kontakt');
    };
  });
}

function downloadVCard(user) {
  const vcard = `BEGIN:VCARD\nVERSION:3.0\nN:${user.last_name};${user.first_name};;;${user.academic_title || ''}\nFN:${user.academic_title ? user.academic_title + ' ' : ''}${user.first_name} ${user.last_name}\nEMAIL:${user.email || ''}\nTEL:${user.phone || ''}\nORG:SKD 2026\nEND:VCARD`;
  const blob = new Blob([vcard], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${user.first_name}_${user.last_name}_SKD2026.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function startNetScanner() {
  const modal = document.getElementById('net-scanner-modal');
  const isEn = window.location.pathname.includes('index-en.html');
  if (!modal || typeof Html5Qrcode === 'undefined') {
    alert(isEn ? 'Scanner library not loaded.' : 'Biblioteka skanera nie została załadowana.');
    return;
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  if (!netQrScanner) {
    netQrScanner = new Html5Qrcode('net-reader');
  }

  netQrScanner.start(
    { facingMode: 'environment' },
    { fps: 15, qrbox: { width: 220, height: 220 } },
    async (decodedText) => {
      stopNetScanner();
      await handleScannedContact(decodedText);
    },
    () => {}
  ).catch(() => {
    alert(isEn ? 'Camera access permission denied.' : 'Brak uprawnień do kamery.');
    stopNetScanner();
  });
}

function stopNetScanner() {
  if (netQrScanner && netQrScanner.isScanning) {
    netQrScanner.stop().catch(() => {});
  }
  const modal = document.getElementById('net-scanner-modal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

async function handleScannedContact(rawQrText) {
  const isEn = window.location.pathname.includes('index-en.html');
  let token = rawQrText.trim();
  if (token.includes('token=')) {
    try {
      const parsed = new URL(token, window.location.origin);
      token = parsed.searchParams.get('token') || token;
    } catch {
      const match = token.match(/token=([^&]+)/);
      if (match) token = decodeURIComponent(match[1]);
    }
  }

  try {
    const res = await fetch(`${CONFIG.API_URL}/items/attendees?filter[qr_token][_eq]=${encodeURIComponent(token)}&limit=1`);
    const data = await res.json();

    if (data.data && data.data.length > 0) {
      const newContact = data.data[0];
      const exists = savedContacts.some(c => String(c.id) === String(newContact.id));
      if (!exists) {
        savedContacts.unshift(newContact);
        localStorage.setItem('skd_saved_contacts', JSON.stringify(savedContacts));
      }
      renderSavedContacts();
      triggerHaptic('success');
      showToast(isEn ? `✓ Saved contact: ${newContact.first_name} ${newContact.last_name}` : `✓ Zapisano kontakt: ${newContact.first_name} ${newContact.last_name}`);
      downloadVCard(newContact);
    } else {
      triggerHaptic('error');
      alert(isEn ? 'Profile not found for this QR code.' : 'Nie znaleziono profilu dla zeskanowanego kodu.');
    }
  } catch (err) {
    triggerHaptic('error');
    alert(isEn ? 'Network error downloading contact card.' : 'Błąd sieci podczas pobierania wizytówki.');
  }
}

// ================= 8. ZAKŁADKI I NAWIGACJA =================
function switchTab(tabId) {
  triggerHaptic('light');
  currentActiveTab = tabId;

  ['program', 'myplan', 'vote', 'oil', 'network'].forEach(t => {
    document.getElementById(`tab-${t}`)?.classList.add('hidden');
    document.getElementById(`nav-${t}`)?.classList.remove('active');
  });

  document.getElementById(`tab-${tabId}`)?.classList.remove('hidden');
  document.getElementById(`nav-${tabId}`)?.classList.add('active');

  const daysBar = document.getElementById('calendar-days-bar');
  const searchBar = document.getElementById('search-container');

  if (tabId === 'program') {
    daysBar?.classList.remove('hidden');
    searchBar?.classList.remove('hidden');
    renderProgramTimeline();
  } else if (tabId === 'myplan') {
    daysBar?.classList.add('hidden');
    searchBar?.classList.remove('hidden');
    renderMyPlanTimeline();
  } else if (tabId === 'network') {
    daysBar?.classList.add('hidden');
    searchBar?.classList.add('hidden');
    renderSavedContacts();
  } else {
    daysBar?.classList.add('hidden');
    searchBar?.classList.add('hidden');
  }
}

function showToast(text) {
  const toast = document.getElementById('app-toast');
  if (!toast) return;
  toast.innerText = text;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2000);
}

// ================= 9. INICJALIZACJA & LISTENERY =================
document.addEventListener('DOMContentLoaded', async () => {
  setupLanguageSelection();
  await initAttendeeProfile();
  updateMyPlanCount();
  renderProgramTimeline();

  const isEn = window.location.pathname.includes('index-en.html');

  // Selektor dni
  document.getElementById('btn-day-1')?.addEventListener('click', () => switchGlobalDay('day-1'));
  document.getElementById('btn-day-2')?.addEventListener('click', () => switchGlobalDay('day-2'));
  document.getElementById('btn-day-3')?.addEventListener('click', () => switchGlobalDay('day-3'));

  // Nawigacja dolna
  document.getElementById('nav-program')?.addEventListener('click', () => switchTab('program'));
  document.getElementById('nav-myplan')?.addEventListener('click', () => switchTab('myplan'));
  document.getElementById('nav-vote')?.addEventListener('click', () => switchTab('vote'));
  document.getElementById('nav-oil')?.addEventListener('click', () => switchTab('oil'));
  document.getElementById('nav-network')?.addEventListener('click', () => switchTab('network'));

  // Autoryzacja PIN
  document.getElementById('btn-auth-verify-pin')?.addEventListener('click', verifyAuthPin);
  document.getElementById('auth-pin-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') verifyAuthPin();
  });
  document.getElementById('btn-auth-continue-guest')?.addEventListener('click', () => {
    closeAuthPinModal();
    document.getElementById('guest-token-banner')?.classList.remove('hidden');
    showToast(isEn ? 'Browsing as Guest' : 'Przeglądasz w trybie gościa');
  });

  // Modal szczegółów sesji
  document.getElementById('btn-close-session-modal')?.addEventListener('click', closeSessionModal);
  document.getElementById('modal-backdrop-close')?.addEventListener('click', closeSessionModal);
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSessionModal(); });

  // Quiz PIN
  document.getElementById('btn-join-pin')?.addEventListener('click', () => {
    const val = document.getElementById('main-pin-input')?.value.trim();
    if (val) processPin(val);
  });
  document.querySelectorAll('.btn-quick-pin').forEach(btn => {
    btn.addEventListener('click', () => processPin(btn.dataset.pin));
  });
  document.getElementById('btn-reset-pin')?.addEventListener('click', () => {
    document.getElementById('vote-active-view').classList.add('hidden');
    document.getElementById('vote-pin-welcome').classList.remove('hidden');
  });

  // Q&A
  document.getElementById('btn-open-qa-form')?.addEventListener('click', () => {
    document.getElementById('qa-form-closed').classList.add('hidden');
    document.getElementById('qa-form-opened').classList.remove('hidden');
    document.getElementById('dedicated-qa-input').focus();
  });
  document.getElementById('btn-cancel-qa')?.addEventListener('click', () => {
    document.getElementById('qa-form-opened').classList.add('hidden');
    document.getElementById('qa-form-closed').classList.remove('hidden');
  });
  document.getElementById('btn-submit-qa')?.addEventListener('click', () => {
    const input = document.getElementById('dedicated-qa-input');
    const errorBox = document.getElementById('qa-validation-error');
    const res = sanitizeQuestion(input.value);
    if (!res.valid) {
      errorBox.innerText = res.error;
      errorBox.classList.remove('hidden');
      return;
    }
    errorBox.classList.add('hidden');
    activeQuestionData.qaList.unshift({ id: 'q_' + Date.now(), text: res.text, votes: 1, upvoted: true });
    renderDedicatedQaList();
    document.getElementById('qa-form-opened').classList.add('hidden');
    document.getElementById('qa-form-closed').classList.remove('hidden');
    input.value = '';
    showToast(isEn ? '✓ Question submitted' : '✓ Wysłano pytanie');
  });

  // Networking skaner
  document.getElementById('btn-start-net-scanner')?.addEventListener('click', startNetScanner);
  document.getElementById('btn-stop-net-scanner')?.addEventListener('click', stopNetScanner);
  document.getElementById('net-scanner-backdrop')?.addEventListener('click', stopNetScanner);

  // Certyfikat OIL
  document.getElementById('btn-download-certificate')?.addEventListener('click', () => {
    showToast(isEn ? 'PDF certificate will be sent to your e-mail.' : 'Certyfikat PDF zostanie przesłany na adres e-mail.');
  });

  // Wyszukiwarka globalna
  const searchInput = document.getElementById('global-search-input');
  const clearBtn = document.getElementById('search-clear-btn');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = cleanString(e.target.value);
      if (clearBtn) clearBtn.classList.toggle('hidden', q.length === 0);
      document.querySelectorAll('.session-cards .card').forEach(card => {
        const data = card.dataset.search || '';
        const match = q === '' || data.includes(q);
        card.style.display = match ? '' : 'none';
      });
      document.querySelectorAll('.session-slot').forEach(slot => {
        const visible = Array.from(slot.querySelectorAll('.card')).some(c => c.style.display !== 'none');
        slot.style.display = visible ? '' : 'none';
      });
    });

    clearBtn?.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.classList.add('hidden');
      document.querySelectorAll('.session-cards .card, .session-slot').forEach(el => el.style.display = '');
    });
  }

  // Splash screen
  const splash = document.getElementById('app-splash-screen');
  if (splash) {
    setTimeout(() => {
      splash.classList.add('splash-hidden');
      setTimeout(() => splash.remove(), 400);
    }, 2500);
  }
});