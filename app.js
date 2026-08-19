/**
 * Konferencja SKD 2026 - Hub Uczestnika
 * Logika: Kalendarz 3 dni, Smart Auto-Switch Search, Quizy PIN, Q&A Anty-Spam, PWA
 */

// ================= 1. BAZA DANYCH KALENDARZA =================
const DAY_NAMES = {
  'day-1': 'Piątek (24.04)',
  'day-2': 'Sobotę (25.04)',
  'day-3': 'Niedzielę (26.04)'
};

const CALENDAR_SLOTS = {
  'day-1': [
    {
      timeSlot: '08:00 - 09:00',
      isLiveNow: false,
      isBreak: true,
      sessions: [
        { id: 'd1_b0', isBreak: true, roomShort: 'HOL GŁÓWNY', title: '☕ Rejestracja Uczestników & Kawa Powitalna', speaker: 'Strefa Expo • Parter' }
      ]
    },
    {
      timeSlot: '09:00 - 10:30',
      isLiveNow: false,
      isBreak: false,
      sessions: [
        { id: 'd1_s1', isBreak: false, roomShort: 'SALA A', title: 'Inauguracja: Nowe Horyzonty w Kardiologii Klinicznej 2026', speaker: 'prof. dr hab. n. med. Janina Kotowska' },
        { id: 'd1_s1b', isBreak: false, roomShort: 'SALA B', title: 'Podstawy Elektrokardiografii w Stanach Nagłych', speaker: 'dr hab. n. med. Tomasz Lis' }
      ]
    },
    {
      timeSlot: '10:30 - 10:45',
      isLiveNow: false,
      isBreak: true,
      sessions: [
        { id: 'd1_b1', isBreak: true, roomShort: 'FOYER', title: '☕ Przerwa Kawowa & Networking', speaker: 'Strefa Wystawców • Parter & Poziom +1' }
      ]
    },
    {
      timeSlot: '10:45 - 12:15',
      isLiveNow: true,
      isBreak: false,
      sessions: [
        { id: 'd1_s2', isBreak: false, roomShort: 'SALA A', title: 'Ostre zespoły wieńcowe u chorych z cukrzycą typu 2', speaker: 'prof. dr hab. n. med. Andrzej Nowak' },
        { id: 'd1_s3', isBreak: false, roomShort: 'SALA B', title: 'Migotanie przedsionków – krioablacja vs farmakoterapia', speaker: 'dr hab. n. med. Ewa Wiśniewska' },
        { id: 'd1_s3c', isBreak: false, roomShort: 'WARSZTAT', title: 'Warsztat: Interpretacja trudnych zapisów Holter EKG', speaker: 'dr n. med. Paweł Górski' }
      ]
    },
    {
      timeSlot: '12:15 - 12:30',
      isLiveNow: false,
      isBreak: true,
      sessions: [
        { id: 'd1_b2', isBreak: true, roomShort: 'FOYER', title: '☕ Krótka Przerwa Kawowa', speaker: 'Strefa Expo' }
      ]
    },
    {
      timeSlot: '12:30 - 14:00',
      isLiveNow: false,
      isBreak: false,
      sessions: [
        { id: 'd1_s4', isBreak: false, roomShort: 'WARSZTAT', title: 'Warsztat USG: Echokardiografia Obciążeniowa w praktyce', speaker: 'dr n. med. Marek Zieliński' },
        { id: 'd1_s4b', isBreak: false, roomShort: 'SALA A', title: 'Nowoczesna farmakoterapia zaburzeń lipidowych – inhibitory PCSK9', speaker: 'prof. dr hab. n. med. Krzysztof Baran' }
      ]
    },
    {
      timeSlot: '14:00 - 15:00',
      isLiveNow: false,
      isBreak: true,
      sessions: [
        { id: 'd1_lunch', isBreak: true, roomShort: 'RESTAURACJA', title: '🍽️ Przerwa Obiadowa (Lunch) & Sesja Plakatowa', speaker: 'Poziom 0 • Główna Strefa Gastronomiczna' }
      ]
    },
    {
      timeSlot: '15:00 - 16:30',
      isLiveNow: false,
      isBreak: false,
      sessions: [
        { id: 'd1_s5', isBreak: false, roomShort: 'SALA A', title: 'Niewydolność Serca z zachowaną frakcją wyrzutową (HFpEF)', speaker: 'prof. dr hab. n. med. Roman Kaczmarek' },
        { id: 'd1_s5b', isBreak: false, roomShort: 'SALA B', title: 'Postępowanie w zatorowości płucnej wysokiego ryzyka', speaker: 'dr hab. n. med. Monika Wróbel' }
      ]
    },
    {
      timeSlot: '16:30 - 16:45',
      isLiveNow: false,
      isBreak: true,
      sessions: [
        { id: 'd1_b3', isBreak: true, roomShort: 'FOYER', title: '☕ Popołudniowa Kawa i Przekąski', speaker: 'Strefa Wystawców' }
      ]
    },
    {
      timeSlot: '16:45 - 18:00',
      isLiveNow: false,
      isBreak: false,
      sessions: [
        { id: 'd1_s6', isBreak: false, roomShort: 'SALA A', title: 'Debata Ekspertów: Trudne decyzje kliniczne – Case Studies', speaker: 'Panel Przewodniczących Sekcji PTK' }
      ]
    }
  ],
  'day-2': [
    {
      timeSlot: '08:00 - 08:30',
      isLiveNow: false,
      isBreak: true,
      sessions: [
        { id: 'd2_b0', isBreak: true, roomShort: 'HOL GŁÓWNY', title: '☕ Poranna Kawa & Networking Dnia 2', speaker: 'Strefa Expo' }
      ]
    },
    {
      timeSlot: '08:30 - 10:00',
      isLiveNow: false,
      isBreak: false,
      sessions: [
        { id: 'd2_s1', isBreak: false, roomShort: 'SALA A', title: 'Choroby strukturalne serca: TAVI oraz naprawa zastawki', speaker: 'prof. dr hab. n. med. Tadeusz Kamiński' },
        { id: 'd2_s1b', isBreak: false, roomShort: 'SALA B', title: 'Oporne nadciśnienie tętnicze – denerwacja nerkowa', speaker: 'dr hab. n. med. Karolina Dąbrowska' }
      ]
    },
    {
      timeSlot: '10:00 - 10:15',
      isLiveNow: false,
      isBreak: true,
      sessions: [
        { id: 'd2_b1', isBreak: true, roomShort: 'FOYER', title: '☕ Przerwa Kawowa', speaker: 'Strefa Expo' }
      ]
    },
    {
      timeSlot: '10:15 - 11:45',
      isLiveNow: false,
      isBreak: false,
      sessions: [
        { id: 'd2_s2', isBreak: false, roomShort: 'SALA A', title: 'Kardiomiopatia przerostowa: Nowe leki blokujące miozynę sercową', speaker: 'prof. dr hab. n. med. Michał Sokołowski' },
        { id: 'd2_s2b', isBreak: false, roomShort: 'WARSZTAT', title: 'Warsztat: Rezonans magnetyczny (CMR) w zapaleniu mięśnia sercowego', speaker: 'dr n. med. Piotr Włodarczyk' }
      ]
    },
    {
      timeSlot: '11:45 - 12:00',
      isLiveNow: false,
      isBreak: true,
      sessions: [
        { id: 'd2_b2', isBreak: true, roomShort: 'FOYER', title: '☕ Krótka Przerwa Kawowa', speaker: 'Strefa Wystawców' }
      ]
    },
    {
      timeSlot: '12:00 - 13:30',
      isLiveNow: false,
      isBreak: false,
      sessions: [
        { id: 'd2_s3', isBreak: false, roomShort: 'SALA B', title: 'Kardio-onkologia: Monitorowanie kardiotoksyczności chemioterapii', speaker: 'dr hab. n. med. Agnieszka Majewska' },
        { id: 'd2_s3b', isBreak: false, roomShort: 'SALA A', title: 'Prewencja pierwotna i wtórna chorób sercowo-naczyniowych', speaker: 'prof. dr hab. n. med. Dariusz Dudek' }
      ]
    },
    {
      timeSlot: '13:30 - 14:30',
      isLiveNow: false,
      isBreak: true,
      sessions: [
        { id: 'd2_lunch', isBreak: true, roomShort: 'RESTAURACJA', title: '🍽️ Przerwa Obiadowa (Lunch) & Forum Młodych Kardiologów', speaker: 'Poziom 0' }
      ]
    },
    {
      timeSlot: '14:30 - 16:00',
      isLiveNow: false,
      isBreak: false,
      sessions: [
        { id: 'd2_s4', isBreak: false, roomShort: 'SALA A', title: 'Sztuczna Inteligencja i Algorytmy Predykcyjne w Kardiologii 2026', speaker: 'dr inż. Adam Pawlak & prof. J. Kotowska' },
        { id: 'd2_s4b', isBreak: false, roomShort: 'WARSZTAT', title: 'Warsztat: Angio-TK tętnic wieńcowych (CCTA) krok po kroku', speaker: 'dr n. med. Wojciech Krawczyk' }
      ]
    },
    {
      timeSlot: '16:00 - 16:15',
      isLiveNow: false,
      isBreak: true,
      sessions: [
        { id: 'd2_b3', isBreak: true, roomShort: 'FOYER', title: '☕ Przerwa Kawowa', speaker: 'Strefa Expo' }
      ]
    },
    {
      timeSlot: '16:15 - 17:45',
      isLiveNow: false,
      isBreak: false,
      sessions: [
        { id: 'd2_s5', isBreak: false, roomShort: 'SALA A', title: 'Wielodyscyplinarny Heart Team – wspólne podejmowanie trudnych decyzji', speaker: 'Kardiochirurdzy & Kardiolodzy Inwazyjni' }
      ]
    }
  ],
  'day-3': [
    {
      timeSlot: '08:00 - 08:30',
      isLiveNow: false,
      isBreak: true,
      sessions: [
        { id: 'd3_b0', isBreak: true, roomShort: 'HOL GŁÓWNY', title: '☕ Kawa Poranna Finałowego Dnia Kongresu', speaker: 'Strefa Expo' }
      ]
    },
    {
      timeSlot: '08:30 - 10:00',
      isLiveNow: false,
      isBreak: false,
      sessions: [
        { id: 'd3_s1', isBreak: false, roomShort: 'SALA A', title: 'Podsumowanie najnowszych wytycznych ESC 2026', speaker: 'prof. dr hab. n. med. Stanisław Bartkowiak' },
        { id: 'd3_s1b', isBreak: false, roomShort: 'SALA B', title: 'Opieka koordynowana nad pacjentem po zawale serca (KOS-Zawał)', speaker: 'dr hab. n. med. Beata Szulc' }
      ]
    },
    {
      timeSlot: '10:00 - 10:15',
      isLiveNow: false,
      isBreak: true,
      sessions: [
        { id: 'd3_b1', isBreak: true, roomShort: 'FOYER', title: '☕ Przerwa Kawowa', speaker: 'Strefa Expo' }
      ]
    },
    {
      timeSlot: '10:15 - 12:00',
      isLiveNow: false,
      isBreak: false,
      sessions: [
        { id: 'd3_s2', isBreak: false, roomShort: 'SALA A', title: 'Wielki Interaktywny Quiz Kliniczny SKD 2026 (z nagrodami)', speaker: 'Prowadzenie: prof. A. Nowak & dr E. Wiśniewska' }
      ]
    },
    {
      timeSlot: '12:00 - 12:15',
      isLiveNow: false,
      isBreak: true,
      sessions: [
        { id: 'd3_b2', isBreak: true, roomShort: 'FOYER', title: '☕ Krótka Przerwa Kawowa', speaker: 'Strefa Wystawców' }
      ]
    },
    {
      timeSlot: '12:15 - 13:45',
      isLiveNow: false,
      isBreak: false,
      sessions: [
        { id: 'd3_s3', isBreak: false, roomShort: 'SALA B', title: 'Leczenie przeciwkrzepliwe w szczególnych grupach pacjentów', speaker: 'prof. dr hab. n. med. Grzegorz Opolski' },
        { id: 'd3_s3b', isBreak: false, roomShort: 'WARSZTAT', title: 'Warsztat: Resuscytacja zaawansowana (ALS) – Symulacja', speaker: 'Zespół Ratownictwa Medycznego SKD' }
      ]
    },
    {
      timeSlot: '13:45 - 14:15',
      isLiveNow: false,
      isBreak: true,
      sessions: [
        { id: 'd3_lunch', isBreak: true, roomShort: 'RESTAURACJA', title: '🍽️ Poczęstunek Zamykający Kongres & Pożegnalna Kawa', speaker: 'Poziom 0' }
      ]
    },
    {
      timeSlot: '14:15 - 15:30',
      isLiveNow: false,
      isBreak: false,
      sessions: [
        { id: 'd3_s4', isBreak: false, roomShort: 'SALA A', title: 'Uroczysta Sesja Zamknięcia: Wręczenie nagród naukowych', speaker: 'Prezydium Polskiego Towarzystwa Kardiologicznego' }
      ]
    }
  ]
};

// ================= 2. BAZA QUIZÓW I DEDYKOWANYCH Q&A =================
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

// ================= 3. ANTY-HEJT I FILTR BEŁKOTU =================
const BANNED_PATTERNS = [
  /gej/i, /gay/i, /homo/i, /lesb/i, /trans/i,
  /kurw/i, /chuj/i, /jeb/i, /pierd/i, /pizd/i, /cwel/i, /debil/i, /idiot/i,
  /sex/i, /seks/i, /cyck/i, /dupa/i, /ruchan/i,
  /pis\b/i, /po\b/i, /tusk/i, /kaczor/i, /konfa/i
];

function sanitizeAndValidateQuestion(text) {
  const cleanText = text.trim().replace(/\s+/g, ' ');
  if (cleanText.length < 10) return { valid: false, error: 'Pytanie jest zbyt krótkie (min. 10 znaków).' };
  for (const pattern of BANNED_PATTERNS) {
    if (pattern.test(cleanText)) return { valid: false, error: 'Pytanie zawiera treści niezgodne z regulaminem sesji naukowej.' };
  }
  const words = cleanText.split(' ').filter(w => w.length > 0);
  for (const word of words) {
    if (word.length > 22) return { valid: false, error: 'Wykryto nienaturalnie długie słowo lub bełkot.' };
  }
  if (words.filter(w => w.length >= 2).length < 2) return { valid: false, error: 'Pytanie musi składać się z co najmniej 2 wyrazów.' };
  if (/(.)\1{3,}/i.test(cleanText)) return { valid: false, error: 'Wykryto nienaturalne powtórzenia znaków.' };
  if (/(.{2,4})\1{3,}/i.test(cleanText.replace(/\s/g, ''))) return { valid: false, error: 'Wykryto powtarzający się ciąg znaków (spam).' };
  const lettersOnly = cleanText.toLowerCase().replace(/[^a-ząćęłńóśźż]/g, '');
  if (lettersOnly.length >= 8) {
    const vowels = lettersOnly.match(/[aeiouyąęó]/g) || [];
    const vowelRatio = vowels.length / lettersOnly.length;
    if (vowelRatio < 0.18 || vowelRatio > 0.70) return { valid: false, error: 'Treść nie przypomina poprawnego pytania w języku polskim.' };
  }
  return { valid: true, text: cleanText };
}

function cleanString(str) {
  if (!str) return '';
  return str.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l").replace(/Ł/g, "l").replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();
}

let activeQuestionData = null;
let currentGlobalDay = 'day-1';
let currentActiveTab = 'program';
let userCalendarPlan = JSON.parse(localStorage.getItem('med_conf_cal_plan') || '["d1_s2", "d2_s1"]');
let searchOriginDay = null; // Pamięta dzień, z którego rozpoczęto wyszukiwanie

// ================= 4. WYSZUKIWARKA Z SMART AUTO-SWITCH =================
window.runLiveSearch = function(rawVal) {
  const rawQ = (rawVal || '').trim();
  const q = cleanString(rawQ);
  const clearBtn = document.getElementById('search-clear-btn');
  
  if (clearBtn) {
    if (q.length > 0) clearBtn.classList.remove('hidden');
    else clearBtn.classList.add('hidden');
  }

  // Jeśli użytkownik skasował tekst, wracamy do dnia startowego
  if (q.length === 0) {
    if (searchOriginDay && searchOriginDay !== currentGlobalDay) {
      switchGlobalDay(searchOriginDay, false);
    }
    searchOriginDay = null;
    updateDayBadgesFromCounts({ 'day-1': 0, 'day-2': 0, 'day-3': 0 }, '');
    return;
  }

  // Zapisz dzień, z którego wystartowano
  if (!searchOriginDay) {
    searchOriginDay = currentGlobalDay;
  }

  // 1. Zlicz dopasowania we wszystkich 3 dniach
  const dayResults = calculateResultsAcrossDays(q);
  updateDayBadgesFromCounts(dayResults, q);

  // 2. AUTO-SWITCH: Jeśli w bieżącym dniu 0, a DOKŁADNIE 1 inny dzień ma wyniki
  if (dayResults[currentGlobalDay] === 0) {
    const matchingDays = Object.keys(dayResults).filter(k => dayResults[k] > 0);
    
    if (matchingDays.length === 1) {
      const targetDay = matchingDays[0];
      switchGlobalDay(targetDay, false);
      showAutoSwitchNotification(DAY_NAMES[targetDay], dayResults[targetDay]);
      return;
    }
  }

  // 3. Renderuj widoczne karty w bieżącym dniu
  filterActiveTimelineCards(q, rawQ, dayResults);
};

function filterActiveTimelineCards(q, rawQ, dayResults) {
  const activeContainerId = currentActiveTab === 'myplan' ? 'myplan-timeline' : 'program-timeline';
  const container = document.getElementById(activeContainerId);
  if (!container) return;

  const slots = container.querySelectorAll('.session-slot');
  let currentDayMatches = 0;

  slots.forEach(slot => {
    const cards = slot.querySelectorAll('.card');
    let slotHasMatch = false;

    cards.forEach(card => {
      const target = card.getAttribute('data-search') || '';
      if (q.length === 0 || target.includes(q)) {
        card.classList.remove('hidden');
        slotHasMatch = true;
        currentDayMatches++;
      } else {
        card.classList.add('hidden');
      }
    });

    if (slotHasMatch) slot.classList.remove('hidden');
    else slot.classList.add('hidden');
  });

  // Komunikat, gdy w obecnym dniu brak wyników
  let noRes = document.getElementById('search-no-results');
  if (currentDayMatches === 0 && q.length > 0) {
    const otherDaysWithHits = Object.keys(dayResults).filter(k => k !== currentGlobalDay && dayResults[k] > 0);

    let jumpButtonsHtml = '';
    if (otherDaysWithHits.length > 0) {
      jumpButtonsHtml = `
        <div style="margin-top:10px; border-top:1px solid #e2e8f0; padding-top:10px;">
          <div style="font-size:11px; font-weight:700; color:#1e3a8a; margin-bottom:6px;">Dostępne w innych dniach:</div>
          <div style="display:flex; justify-content:center; gap:6px; flex-wrap:wrap;">
            ${otherDaysWithHits.map(dayKey => `
              <button onclick="switchGlobalDay('${dayKey}')" style="background:#eff6ff; border:1px solid #bfdbfe; color:#1e3a8a; font-size:11px; font-weight:700; padding:5px 10px; border-radius:7px; cursor:pointer;">
                👉 ${DAY_NAMES[dayKey]} (${dayResults[dayKey]})
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (!noRes) {
      noRes = document.createElement('div');
      noRes.id = 'search-no-results';
      container.appendChild(noRes);
    }
    noRes.style.cssText = 'text-align:center; padding:18px 12px; background:#f8fafc; border:1px dashed #cbd5e1; border-radius:12px; margin-top:8px;';
    noRes.innerHTML = `
      <div style="font-size:12.5px; font-weight:700; color:#0f172a; margin-bottom:3px;">Brak wyników w: ${DAY_NAMES[currentGlobalDay]}</div>
      <div style="font-size:11px; color:#64748b;">Dla zapytania: <strong>„${rawQ}”</strong></div>
      ${jumpButtonsHtml}
    `;
  } else {
    if (noRes) noRes.remove();
  }
}

function showAutoSwitchNotification(dayName, count) {
  const toast = document.getElementById('app-toast');
  if (!toast) return;
  toast.innerHTML = `
    <span>Przełączono na <strong>${dayName}</strong> (${count} wynik)</span>
    <button onclick="undoAutoSwitch()" style="margin-left:8px; background:#334155; border:none; color:#38bdf8; font-weight:800; font-size:10.5px; padding:2px 6px; border-radius:4px; cursor:pointer;">Cofnij</button>
  `;
  toast.classList.remove('hidden');
  setTimeout(() => { toast.classList.add('hidden'); }, 3000);
}

window.undoAutoSwitch = function() {
  if (searchOriginDay) {
    switchGlobalDay(searchOriginDay, false);
    const toast = document.getElementById('app-toast');
    if (toast) toast.classList.add('hidden');
  }
};

function calculateResultsAcrossDays(cleanQ) {
  const counts = { 'day-1': 0, 'day-2': 0, 'day-3': 0 };
  if (!cleanQ) return counts;

  ['day-1', 'day-2', 'day-3'].forEach(dKey => {
    const slots = CALENDAR_SLOTS[dKey] || [];
    slots.forEach(slot => {
      const activeSessions = currentActiveTab === 'myplan'
        ? slot.sessions.filter(s => !s.isBreak && userCalendarPlan.includes(s.id))
        : slot.sessions;

      activeSessions.forEach(sess => {
        const text = cleanString(`${sess.title} ${sess.speaker} ${sess.roomShort}`);
        if (text.includes(cleanQ)) counts[dKey]++;
      });
    });
  });

  return counts;
}

function updateDayBadgesFromCounts(counts, cleanQ) {
  const dayKeys = ['day-1', 'day-2', 'day-3'];
  const dayBaseLabels = ['Pt (24.04)', 'Sob (25.04)', 'Nd (26.04)'];

  dayKeys.forEach((dKey, index) => {
    const btn = document.getElementById(`btn-day-${index + 1}`);
    if (!btn) return;

    if (!cleanQ) {
      btn.innerText = dayBaseLabels[index];
    } else {
      const count = counts[dKey];
      const badgeStyle = count > 0 ? 'background:#dbeafe; color:#1e3a8a;' : 'background:#f1f5f9; color:#94a3b8;';
      btn.innerHTML = `${dayBaseLabels[index]} <span style="font-size:9.5px; padding:1px 5px; border-radius:10px; font-weight:800; ${badgeStyle}">(${count})</span>`;
    }
  });
}

window.clearLiveSearch = function() {
  const input = document.getElementById('global-search-input');
  if (input) input.value = '';
  runLiveSearch('');
};

function switchGlobalDay(dayKey, resetSearchOrigin = true) {
  currentGlobalDay = dayKey;
  if (resetSearchOrigin) searchOriginDay = dayKey;

  ['day-1', 'day-2', 'day-3'].forEach((d, i) => {
    const btn = document.getElementById(`btn-day-${i+1}`);
    if (btn) {
      if (d === dayKey) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });

  renderProgramTimeline();
  renderMyPlanTimeline();
  
  const input = document.getElementById('global-search-input');
  if (input && input.value.trim().length > 0) {
    const q = cleanString(input.value.trim());
    const dayResults = calculateResultsAcrossDays(q);
    filterActiveTimelineCards(q, input.value.trim(), dayResults);
  }
}

function toggleCalendarSession(sessionId) {
  if (userCalendarPlan.includes(sessionId)) {
    userCalendarPlan = userCalendarPlan.filter(id => id !== sessionId);
    showToast('Usunięto z Twojego Planu');
  } else {
    userCalendarPlan.push(sessionId);
    showToast('✓ Dodano do Twojego Planu');
  }
  localStorage.setItem('med_conf_cal_plan', JSON.stringify(userCalendarPlan));
  updateMyPlanCount();
  renderProgramTimeline();
  renderMyPlanTimeline();
}

function updateMyPlanCount() {
  const countEl = document.getElementById('nav-my-count');
  if (countEl) countEl.innerText = userCalendarPlan.length;
}

function renderProgramTimeline() {
  const container = document.getElementById('program-timeline');
  if (!container) return;
  const slots = CALENDAR_SLOTS[currentGlobalDay] || [];
  container.innerHTML = buildTimelineHTML(slots, false);
}

function renderMyPlanTimeline() {
  const container = document.getElementById('myplan-timeline');
  if (!container) return;
  const slots = CALENDAR_SLOTS[currentGlobalDay] || [];
  const html = buildTimelineHTML(slots, true);
  
  if (!html.trim()) {
    container.innerHTML = `
      <div style="text-align:center; padding:32px 14px; background:#f8fafc; border:1px dashed #cbd5e1; border-radius:12px; margin-top:6px;">
        <div style="font-size:13px; font-weight:700; color:#0f172a; margin-bottom:4px;">Brak wybranych sesji na ten dzień</div>
        <div style="font-size:11px; color:#64748b; margin-bottom:12px;">Wejdź w zakładkę „Program” i kliknij „+ Dodaj do planu” przy wykładach.</div>
        <button onclick="switchTab('program')" class="btn-primary" style="font-size:11px; padding:6px 14px;">Przeglądaj Program</button>
      </div>
    `;
  } else {
    container.innerHTML = html;
  }
}

function buildTimelineHTML(slots, onlyMyPlan) {
  let output = '';

  slots.forEach(slot => {
    let visibleSessions = onlyMyPlan
      ? slot.sessions.filter(s => !s.isBreak && userCalendarPlan.includes(s.id))
      : slot.sessions;

    if (visibleSessions.length === 0) return;

    let sessionsHtml = '<div class="session-cards">';
    visibleSessions.forEach(sess => {
      const searchData = cleanString(`${sess.title} ${sess.speaker} ${sess.roomShort}`);
      
      if (sess.isBreak) {
        sessionsHtml += `
          <div class="card break-card" data-search="${searchData}">
            <div class="card-head">
              <span class="badge-break">ORGANIZACYJNA</span>
              <span style="font-size:9.5px; font-weight:700; color:#64748b;">${sess.roomShort}</span>
            </div>
            <div class="card-title">${sess.title}</div>
            <div class="card-speaker">${sess.speaker}</div>
          </div>
        `;
      } else {
        const isSelected = userCalendarPlan.includes(sess.id);
        sessionsHtml += `
          <div class="card ${isSelected ? 'selected' : ''}" data-search="${searchData}">
            <div class="card-head">
              <span class="badge-room">${sess.roomShort}</span>
              <button onclick="toggleCalendarSession('${sess.id}')" class="btn-add-plan ${isSelected ? 'in-plan' : ''}">
                ${isSelected ? '✓ W TWOIM PLANIE' : '+ Dodaj do planu'}
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
        <div class="t-dot ${slot.isLiveNow ? 'live' : ''} ${slot.isBreak ? 'break' : ''}"></div>
        ${sessionsHtml}
      </div>
    `;
  });

  return output;
}

// ================= 5. OBSŁUGA QUIZU & PIN =================
function loadQuestionFromWelcome() {
  const pin = document.getElementById('main-pin-input').value.trim();
  processPin(pin);
}

function quickTestPin(pin) {
  document.getElementById('main-pin-input').value = pin;
  processPin(pin);
}

const mainPinInput = document.getElementById('main-pin-input');
if (mainPinInput) {
  mainPinInput.addEventListener('input', function() {
    if (this.value.length === 4) processPin(this.value.trim());
  });
}

function processPin(pin) {
  const errorMsg = document.getElementById('main-pin-error');
  if (QUESTIONS_BY_PIN[pin]) {
    errorMsg.classList.add('hidden');
    renderQuestion(QUESTIONS_BY_PIN[pin]);
    document.getElementById('vote-pin-welcome').classList.add('hidden');
    document.getElementById('vote-active-view').classList.remove('hidden');
    showToast(`✓ Dołączono do sesji (${QUESTIONS_BY_PIN[pin].roomShort})`);
  } else {
    errorMsg.classList.remove('hidden');
    if ('vibrate' in navigator) navigator.vibrate(100);
  }
}

function resetPinVote() {
  activeQuestionData = null;
  document.getElementById('main-pin-input').value = '';
  document.getElementById('main-pin-error').classList.add('hidden');
  document.getElementById('vote-active-view').classList.add('hidden');
  document.getElementById('vote-pin-welcome').classList.remove('hidden');
  closeQuestionForm();
}

function renderQuestion(data) {
  activeQuestionData = data;
  document.getElementById('active-pin-badge').innerText = data.pin;
  document.getElementById('vote-room-tag').innerText = data.roomShort;
  document.getElementById('vote-session-name').innerText = data.session;
  document.getElementById('vote-speaker-name').innerText = `Prelegent: ${data.speaker}`;
  document.getElementById('vote-topic-title').innerText = `Temat: ${data.topic}`;
  document.getElementById('vote-question-text').innerText = data.question;
  document.getElementById('vote-question-sub').innerText = data.questionSub;
  document.getElementById('qa-speaker-badge').innerText = data.speakerShort;

  const optionsContainer = document.getElementById('vote-options');
  optionsContainer.innerHTML = '';
  document.getElementById('vote-alert').classList.add('hidden');

  data.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.onclick = () => castVote(opt.key, data.options);
    btn.className = "vote-btn";
    btn.innerHTML = `
      <div style="display:flex; align-items:center; position:relative; z-index:2; width:82%;">
        <span class="vote-badge-letter">${opt.key}</span>
        <span style="font-size:11px; font-weight:600; text-align:left; color:#0f172a; line-height:1.3;">${opt.text}</span>
      </div>
      <div class="vote-bar"></div>
      <span class="vote-pct hidden" style="position:relative; z-index:2; font-size:11px; font-weight:800; font-family:monospace; color:#1e3a8a; background:#fff; padding:1px 6px; border-radius:4px; border:1px solid #bfdbfe;">0%</span>
    `;
    optionsContainer.appendChild(btn);
  });

  renderDedicatedQaList();
}

function castVote(selectedKey, optionsData) {
  if ('vibrate' in navigator) navigator.vibrate(35);
  const buttons = document.querySelectorAll('.vote-btn');
  buttons.forEach(btn => btn.disabled = true);
  document.getElementById('vote-alert').classList.remove('hidden');

  buttons.forEach((btn, index) => {
    const opt = optionsData[index];
    const bar = btn.querySelector('.vote-bar');
    const pctText = btn.querySelector('.vote-pct');
    if (opt.key === selectedKey) {
      btn.classList.add('selected');
    }
    pctText.classList.remove('hidden');
    pctText.innerText = `${opt.pct}%`;
    bar.style.width = `${opt.pct}%`;
  });
}

// ================= 6. Q&A Z FILTREM =================
function openQuestionForm() {
  document.getElementById('qa-form-closed').classList.add('hidden');
  document.getElementById('qa-form-opened').classList.remove('hidden');
  document.getElementById('qa-validation-error').classList.add('hidden');
  document.getElementById('dedicated-qa-input').focus();
}

function closeQuestionForm() {
  document.getElementById('qa-form-opened').classList.add('hidden');
  document.getElementById('qa-form-closed').classList.remove('hidden');
  document.getElementById('dedicated-qa-input').value = '';
  document.getElementById('qa-validation-error').classList.add('hidden');
}

function renderDedicatedQaList() {
  const container = document.getElementById('dedicated-qa-list');
  container.innerHTML = '';

  if (!activeQuestionData || !activeQuestionData.qaList || activeQuestionData.qaList.length === 0) {
    container.innerHTML = '<div style="font-size:10px; color:#94a3b8; text-align:center; padding:6px;">Brak pytań do tego wykładu. Zadaj pierwsze!</div>';
    return;
  }

  activeQuestionData.qaList.forEach((q, index) => {
    const item = document.createElement('div');
    item.className = 'qa-item';
    item.innerHTML = `
      <div class="qa-item-text">${q.text}</div>
      <button onclick="toggleUpvoteQuestion(${index})" class="btn-upvote ${q.upvoted ? 'active' : ''}">
        ${q.upvoted ? '✓ Poparto' : 'Popieram'} (${q.votes})
      </button>
    `;
    container.appendChild(item);
  });
}

function toggleUpvoteQuestion(index) {
  if (!activeQuestionData) return;
  const q = activeQuestionData.qaList[index];
  q.votes += q.upvoted ? -1 : 1;
  q.upvoted = !q.upvoted;
  renderDedicatedQaList();
}

function submitDedicatedQuestion() {
  const input = document.getElementById('dedicated-qa-input');
  const errorBox = document.getElementById('qa-validation-error');
  const rawText = input.value;

  const result = sanitizeAndValidateQuestion(rawText);

  if (!result.valid) {
    errorBox.innerText = result.error;
    errorBox.classList.remove('hidden');
    if ('vibrate' in navigator) navigator.vibrate(80);
    return;
  }

  errorBox.classList.add('hidden');
  activeQuestionData.qaList.unshift({
    id: 'q_' + Date.now(),
    text: result.text,
    votes: 1,
    upvoted: true
  });

  renderDedicatedQaList();
  closeQuestionForm();
  showToast('✓ Wysłano Twoje pytanie do prelegenta');
}

// ================= 7. ZAKŁADKI =================
function switchTab(tabId) {
  currentActiveTab = tabId;

  ['program', 'myplan', 'vote', 'oil'].forEach(t => {
    const tabEl = document.getElementById(`tab-${t}`);
    const navBtn = document.getElementById(`nav-${t}`);
    if (tabEl) tabEl.classList.add('hidden');
    if (navBtn) navBtn.classList.remove('active');
  });

  const activeTabEl = document.getElementById(`tab-${tabId}`);
  const activeNavBtn = document.getElementById(`nav-${tabId}`);
  if (activeTabEl) activeTabEl.classList.remove('hidden');
  if (activeNavBtn) activeNavBtn.classList.add('active');
  
  const daysBar = document.getElementById('calendar-days-bar');
  const searchBar = document.getElementById('search-container');
  if (daysBar && searchBar) {
    if (tabId === 'program' || tabId === 'myplan') {
      daysBar.classList.remove('hidden');
      searchBar.classList.remove('hidden');
    } else {
      daysBar.classList.add('hidden');
      searchBar.classList.add('hidden');
    }
  }

  if (tabId === 'program') renderProgramTimeline();
  if (tabId === 'myplan') renderMyPlanTimeline();

  const input = document.getElementById('global-search-input');
  if (input && input.value.trim().length > 0) {
    runLiveSearch(input.value);
  }
}

function showToast(text) {
  const toast = document.getElementById('app-toast');
  if (!toast) return;
  toast.innerText = text;
  toast.classList.remove('hidden');
  setTimeout(() => { toast.classList.add('hidden'); }, 1800);
}

// ================= 8. OBSŁUGA PWA I SERVICE WORKERA =================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.log('SW registration skipped:', err);
    });
  });
}

let deferredPrompt = null;
const installCard = document.getElementById('pwa-install-card');
const installBtn = document.getElementById('pwa-install-action');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installCard) installCard.classList.remove('hidden');
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        if (installCard) installCard.classList.add('hidden');
      }
      deferredPrompt = null;
    } else {
      alert('Aby zainstalować aplikację na iPhone: kliknij ikonę "Udostępnij" (kwadrat ze strzałką) na dole Safari, a następnie wybierz "Do ekranu początkowego" (+).');
    }
  });
}

const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator.standalone);

if (isIos && !isInStandaloneMode && installCard) {
  installCard.classList.remove('hidden');
}

// Inicjalizacja startowa
updateMyPlanCount();
renderProgramTimeline();