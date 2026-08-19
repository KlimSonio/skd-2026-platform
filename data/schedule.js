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