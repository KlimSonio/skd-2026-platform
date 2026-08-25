// ================= 1. BAZA DANYCH KALENDARZA =================
const DAY_NAMES = {
  'day-1': 'Piątek (24.04)',
  'day-2': 'Sobota (25.04)',
  'day-3': 'Niedziela (26.04)'
};

const CALENDAR_SLOTS = {
  'day-1': [
    {
      timeSlot: '08:00 - 09:00',
      isLiveNow: false,
      isBreak: true,
      sessions: [
        {
          id: 'd1_b0',
          isBreak: true,
          roomShort: 'HOL GŁÓWNY',
          title: '☕ Rejestracja Uczestników & Kawa Powitalna',
          speaker: 'Strefa Expo • Parter',
          description: 'Odbiór pakietów konferencyjnych, identyfikatorów oraz materiałów naukowych. Zapraszamy na poranną kawę i rozmowy kuluarowe w strefie wystawców.'
        }
      ]
    },
    {
      timeSlot: '09:00 - 10:30',
      isLiveNow: false,
      isBreak: false,
      sessions: [
        {
          id: 'd1_s1',
          isBreak: false,
          roomShort: 'SALA A',
          title: 'Inauguracja: Nowe Horyzonty w Kardiologii Klinicznej 2026',
          speaker: 'prof. dr hab. n. med. Janina Kotowska',
          description: 'Oficjalne otwarcie kongresu SKD 2026. Przegląd przełomowych badań klinicznych z ostatniego roku, wyznaczających nowe standardy postępowania w kardiologii zachowawczej i interwencyjnej.'
        },
        {
          id: 'd1_s1b',
          isBreak: false,
          roomShort: 'SALA B',
          title: 'Podstawy Elektrokardiografii w Stanach Nagłych',
          speaker: 'dr hab. n. med. Tomasz Lis',
          description: 'Szybkie i bezbłędne rozpoznawanie elektrokardiograficznych stanów zagrożenia życia na SOR: od ostrego niedokrwienia po złożone zaburzenia rytmu i przewodzenia.'
        }
      ]
    },
    {
      timeSlot: '10:30 - 10:45',
      isLiveNow: false,
      isBreak: true,
      sessions: [
        {
          id: 'd1_b1',
          isBreak: true,
          roomShort: 'FOYER',
          title: '☕ Przerwa Kawowa & Networking',
          speaker: 'Strefa Wystawców • Parter & Poziom +1',
          description: 'Krótka przerwa regeneracyjna przy kawie oraz możliwość odwiedzenia stoisk partnerów technologicznych i farmaceutycznych.'
        }
      ]
    },
    {
      timeSlot: '10:45 - 12:15',
      isLiveNow: false,
      isBreak: false,
      sessions: [
        {
          id: 'd1_s2',
          isBreak: false,
          roomShort: 'SALA A',
          title: 'Ostre zespoły wieńcowe u chorych z cukrzycą typu 2',
          speaker: 'prof. dr hab. n. med. Andrzej Nowak',
          description: 'Specyfika patofizjologiczna i wyzwania kliniczne rewaskularyzacji u pacjentów ze współistniejącą cukrzycą. Optymalizacja farmakoterapii przeciwpłytkowej w ostrej fazie i po wypisie.'
        },
        {
          id: 'd1_s3',
          isBreak: false,
          roomShort: 'SALA B',
          title: 'Migotanie przedsionków – krioablacja vs farmakoterapia',
          speaker: 'dr hab. n. med. Ewa Wiśniewska',
          description: 'Analiza wskazań do wczesnej interwencji zabiegowej w napadowym i przetrwałym migotaniu przedsionków. Zestawienie bezpieczeństwa i długoterminowej skuteczności zabiegów krioablacji z lekami antyarytmicznymi.'
        },
        {
          id: 'd1_s3c',
          isBreak: false,
          roomShort: 'WARSZTAT',
          title: 'Warsztat: Interpretacja trudnych zapisów Holter EKG',
          speaker: 'dr n. med. Paweł Górski',
          description: 'Praktyczne warsztaty z analizy nietypowych zaburzeń rytmu serca, artefaktów i bloków przewodzenia na podstawie rzeczywistych 24- i 48-godzinnych zapisów holterowskich.'
        }
      ]
    },
    {
      timeSlot: '12:15 - 12:30',
      isLiveNow: false,
      isBreak: true,
      sessions: [
        {
          id: 'd1_b2',
          isBreak: true,
          roomShort: 'FOYER',
          title: '☕ Krótka Przerwa Kawowa',
          speaker: 'Strefa Expo',
          description: 'Przerwa na kawę przed sesjami południowymi i warsztatami praktycznymi.'
        }
      ]
    },
    {
      timeSlot: '12:30 - 14:00',
      isLiveNow: false,
      isBreak: false,
      sessions: [
        {
          id: 'd1_s4',
          isBreak: false,
          roomShort: 'WARSZTAT',
          title: 'Warsztat USG: Echokardiografia Obciążeniowa w praktyce',
          speaker: 'dr n. med. Marek Zieliński',
          description: 'Ocena żywotności mięśnia sercowego i rezerwy wieńcowej w teście obciążeniowym z dobutaminą. Analiza asymetrii kurczliwości i kryteriów przerywania próby.'
        },
        {
          id: 'd1_s4b',
          isBreak: false,
          roomShort: 'SALA A',
          title: 'Nowoczesna farmakoterapia zaburzeń lipidowych – inhibitory PCSK9',
          speaker: 'prof. dr hab. n. med. Krzysztof Baran',
          description: 'Miejsce inhibitorów PCSK9, kwasu bempediowego oraz siRNA (inklisiran) w terapii pacjentów bardzo wysokiego ryzyka sercowo-naczyniowego z nietolerancją statyn.'
        }
      ]
    },
    {
      timeSlot: '14:00 - 15:00',
      isLiveNow: false,
      isBreak: true,
      sessions: [
        {
          id: 'd1_lunch',
          isBreak: true,
          roomShort: 'RESTAURACJA',
          title: '🍽️ Przerwa Obiadowa (Lunch) & Sesja Plakatowa',
          speaker: 'Poziom 0 • Główna Strefa Gastronomiczna',
          description: 'Ciepły posiłek dla uczestników połączony z prezentacją prac oryginalnych i przypadków klinicznych w strefie plakatowej.'
        }
      ]
    },
    {
      timeSlot: '15:00 - 16:30',
      isLiveNow: false,
      isBreak: false,
      sessions: [
        {
          id: 'd1_s5',
          isBreak: false,
          roomShort: 'SALA A',
          title: 'Niewydolność Serca z zachowaną frakcją wyrzutową (HFpEF)',
          speaker: 'prof. dr hab. n. med. Roman Kaczmarek',
          description: 'Aktualne kryteria rozpoznania według skali HFA-PEFF, rola flozyn (iSGLT2), antagonistów MRA oraz leczenia chorób współistniejących, w tym otyłości i nadciśnienia.'
        },
        {
          id: 'd1_s5b',
          isBreak: false,
          roomShort: 'SALA B',
          title: 'Postępowanie w zatorowości płucnej wysokiego ryzyka',
          speaker: 'dr hab. n. med. Monika Wróbel',
          description: 'Protokół wstrząsu obturacyjnego, kwalifikacja do fibrynolizy ogólnoustrojowej vs trombektomii mechanicznej oraz rola zespołów szybkiego reagowania (PERT).'
        }
      ]
    },
    {
      timeSlot: '16:30 - 16:45',
      isLiveNow: false,
      isBreak: true,
      sessions: [
        {
          id: 'd1_b3',
          isBreak: true,
          roomShort: 'FOYER',
          title: '☕ Popołudniowa Kawa i Przekąski',
          speaker: 'Strefa Wystawców',
          description: 'Krótka chwila wytchnienia i poczęstunek przed popołudniową debatą ekspercką.'
        }
      ]
    },
    {
      timeSlot: '16:45 - 18:00',
      isLiveNow: false,
      isBreak: false,
      sessions: [
        {
          id: 'd1_s6',
          isBreak: false,
          roomShort: 'SALA A',
          title: 'Debata Ekspertów: Trudne decyzje kliniczne – Case Studies',
          speaker: 'Panel Przewodniczących Sekcji PTK',
          description: 'Wspólna analiza niejednoznacznych przypadków klinicznych z udziałem ekspertów i aktywnym głosowaniem publiczności.'
        }
      ]
    }
  ],
  'day-2': [
    {
      timeSlot: '08:00 - 08:30',
      isLiveNow: false,
      isBreak: true,
      sessions: [
        {
          id: 'd2_b0',
          isBreak: true,
          roomShort: 'HOL GŁÓWNY',
          title: '☕ Poranna Kawa & Networking Dnia 2',
          speaker: 'Strefa Expo',
          description: 'Powitalna kawa i rozpoczęcie drugiego dnia obrad naukowych.'
        }
      ]
    },
    {
      timeSlot: '08:30 - 10:00',
      isLiveNow: false,
      isBreak: false,
      sessions: [
        {
          id: 'd2_s1',
          isBreak: false,
          roomShort: 'SALA A',
          title: 'Choroby strukturalne serca: TAVI oraz naprawa zastawki',
          speaker: 'prof. dr hab. n. med. Tadeusz Kamiński',
          description: 'Najnowsze osiągnięcia w przezcewnikowym wszczepianiu zastawki aortalnej (TAVI) oraz zabiegach brzeg-do-brzegu (TEER) na zastawce mitralnej i trójdzielnej.'
        },
        {
          id: 'd2_s1b',
          isBreak: false,
          roomShort: 'SALA B',
          title: 'Oporne nadciśnienie tętnicze – denerwacja nerkowa',
          speaker: 'dr hab. n. med. Karolina Dąbrowska',
          description: 'Kwalifikacja chorych i aktualne dowody kliniczne na skuteczność denerwacji tętnic nerkowych jako bezpiecznej metody wspomagającej farmakoterapię.'
        }
      ]
    },
    {
      timeSlot: '10:00 - 10:15',
      isLiveNow: false,
      isBreak: true,
      sessions: [
        {
          id: 'd2_b1',
          isBreak: true,
          roomShort: 'FOYER',
          title: '☕ Przerwa Kawowa',
          speaker: 'Strefa Expo',
          description: 'Przerwa kawowa i networking w strefie wystawienniczej.'
        }
      ]
    },
    {
      timeSlot: '10:15 - 11:45',
      isLiveNow: false,
      isBreak: false,
      sessions: [
        {
          id: 'd2_s2',
          isBreak: false,
          roomShort: 'SALA A',
          title: 'Kardiomiopatia przerostowa: Nowe leki blokujące miozynę sercową',
          speaker: 'prof. dr hab. n. med. Michał Sokołowski',
          description: 'Przełom w farmakoterapii HCM: inhibitory miozyny sercowej (mawakamten) – mechanizm działania, kwalifikacja i monitorowanie bezpieczeństwa terapii.'
        },
        {
          id: 'd2_s2b',
          isBreak: false,
          roomShort: 'WARSZTAT',
          title: 'Warsztat: Rezonans magnetyczny (CMR) w zapaleniu mięśnia sercowego',
          speaker: 'dr n. med. Piotr Włodarczyk',
          description: 'Ocena kryteriów Lake Louise w CMR, interpretacja mapowania T1/T2 oraz identyfikacja późnego wzmocnienia kontrastowego (LGE) w praktyce klinicznej.'
        }
      ]
    },
    {
      timeSlot: '11:45 - 12:00',
      isLiveNow: false,
      isBreak: true,
      sessions: [
        {
          id: 'd2_b2',
          isBreak: true,
          roomShort: 'FOYER',
          title: '☕ Krótka Przerwa Kawowa',
          speaker: 'Strefa Wystawców',
          description: 'Krótka przerwa przed blokiem kardio-onkologicznym i prewencyjnym.'
        }
      ]
    },
    {
      timeSlot: '12:00 - 13:30',
      isLiveNow: false,
      isBreak: false,
      sessions: [
        {
          id: 'd2_s3',
          isBreak: false,
          roomShort: 'SALA B',
          title: 'Kardio-onkologia: Monitorowanie kardiotoksyczności chemioterapii',
          speaker: 'dr hab. n. med. Agnieszka Majewska',
          description: 'Współpraca kardiologa z onkologiem: wczesna detekcja uszkodzenia mięśnia sercowego przy użyciu biomarkerów i techniki GLS-echo podczas nowoczesnych terapii celowanych.'
        },
        {
          id: 'd2_s3b',
          isBreak: false,
          roomShort: 'SALA A',
          title: 'Prewencja pierwotna i wtórna chorób sercowo-naczyniowych',
          speaker: 'prof. dr hab. n. med. Dariusz Dudek',
          description: 'Aktualizacja kart ryzyka SCORE2, modyfikacja stylu życia, cele terapeutyczne w redukcji ciśnienia i cholesterolu LDL oraz nowoczesne programy rehabilitacji kardiologicznej.'
        }
      ]
    },
    {
      timeSlot: '13:30 - 14:30',
      isLiveNow: false,
      isBreak: true,
      sessions: [
        {
          id: 'd2_lunch',
          isBreak: true,
          roomShort: 'RESTAURACJA',
          title: '🍽️ Przerwa Obiadowa (Lunch) & Forum Młodych Kardiologów',
          speaker: 'Poziom 0',
          description: 'Obiad bufetowy połączony ze spotkaniem integracyjnym i dyskusją o ścieżkach rozwoju dla rezydentów oraz młodych kardiologów.'
        }
      ]
    },
    {
      timeSlot: '14:30 - 16:00',
      isLiveNow: false,
      isBreak: false,
      sessions: [
        {
          id: 'd2_s4',
          isBreak: false,
          roomShort: 'SALA A',
          title: 'Sztuczna Inteligencja i Algorytmy Predykcyjne w Kardiologii 2026',
          speaker: 'dr inż. Adam Pawlak & prof. J. Kotowska',
          description: 'Praktyczne wdrożenia modeli uczenia maszynowego w automatycznej analizie EKG, wczesnym wykrywaniu kardiomiopatii oraz przewidywaniu dekompensacji niewydolności serca.'
        },
        {
          id: 'd2_s4b',
          isBreak: false,
          roomShort: 'WARSZTAT',
          title: 'Warsztat: Angio-TK tętnic wieńcowych (CCTA) krok po kroku',
          speaker: 'dr n. med. Wojciech Krawczyk',
          description: 'Zasady akwizycji obrazu, bramkowanie EKG, ocena stopnia zwężeń według CAD-RADS 2.0 oraz analiza niestabilnych blaszek miażdżycowych.'
        }
      ]
    },
    {
      timeSlot: '16:00 - 16:15',
      isLiveNow: false,
      isBreak: true,
      sessions: [
        {
          id: 'd2_b3',
          isBreak: true,
          roomShort: 'FOYER',
          title: '☕ Przerwa Kawowa',
          speaker: 'Strefa Expo',
          description: 'Przerwa na kawę przed popołudniowym posiedzeniem zespołu Heart Team.'
        }
      ]
    },
    {
      timeSlot: '16:15 - 17:45',
      isLiveNow: false,
      isBreak: false,
      sessions: [
        {
          id: 'd2_s5',
          isBreak: false,
          roomShort: 'SALA A',
          title: 'Wielodyscyplinarny Heart Team – wspólne podejmowanie trudnych decyzji',
          speaker: 'Kardiochirurdzy & Kardiolodzy Inwazyjni',
          description: 'Symulacja posiedzenia Heart Team w złożonej chorobie wielonaczyniowej i wielozastawkowej: optymalny wybór między CABG a wielonaczyniowym PCI.'
        }
      ]
    }
  ],
  'day-3': [
    {
      timeSlot: '08:00 - 08:30',
      isLiveNow: false,
      isBreak: true,
      sessions: [
        {
          id: 'd3_b0',
          isBreak: true,
          roomShort: 'HOL GŁÓWNY',
          title: '☕ Kawa Poranna Finałowego Dnia Kongresu',
          speaker: 'Strefa Expo',
          description: 'Poranna kawa i powitanie uczestników ostatniego dnia konferencji SKD 2026.'
        }
      ]
    },
    {
      timeSlot: '08:30 - 10:00',
      isLiveNow: false,
      isBreak: false,
      sessions: [
        {
          id: 'd3_s1',
          isBreak: false,
          roomShort: 'SALA A',
          title: 'Podsumowanie najnowszych wytycznych ESC 2026',
          speaker: 'prof. dr hab. n. med. Stanisław Bartkowiak',
          description: 'Syntetyczne zestawienie zmian w oficjalnych rekomendacjach Europejskiego Towarzystwa Kardiologicznego wraz z komentarzem klinicznym eksperta.'
        },
        {
          id: 'd3_s1b',
          isBreak: false,
          roomShort: 'SALA B',
          title: 'Opieka koordynowana nad pacjentem po zawale serca (KOS-Zawał)',
          speaker: 'dr hab. n. med. Beata Szulc',
          description: 'Doświadczenia i wyniki polskiego programu KOS-Zawał: wpływ wczesnej rehabilitacji i systematycznej kontroli ambulatoryjnej na rokowanie odległe.'
        }
      ]
    },
    {
      timeSlot: '10:00 - 10:15',
      isLiveNow: false,
      isBreak: true,
      sessions: [
        {
          id: 'd3_b1',
          isBreak: true,
          roomShort: 'FOYER',
          title: '☕ Przerwa Kawowa',
          speaker: 'Strefa Expo',
          description: 'Krótka przerwa przed wielkim konkursem wiedzy klinicznej.'
        }
      ]
    },
    {
      timeSlot: '10:15 - 12:00',
      isLiveNow: false,
      isBreak: false,
      sessions: [
        {
          id: 'd3_s2',
          isBreak: false,
          roomShort: 'SALA A',
          title: 'Wielki Interaktywny Quiz Kliniczny SKD 2026 (z nagrodami)',
          speaker: 'Prowadzenie: prof. A. Nowak & dr E. Wiśniewska',
          description: 'Emocjonujący turniej wiedzy klinicznej z głosowaniem na żywo przez aplikację kongresową. Do wygrania atrakcyjne nagrody naukowe i edukacyjne!'
        }
      ]
    },
    {
      timeSlot: '12:00 - 12:15',
      isLiveNow: false,
      isBreak: true,
      sessions: [
        {
          id: 'd3_b2',
          isBreak: true,
          roomShort: 'FOYER',
          title: '☕ Krótka Przerwa Kawowa',
          speaker: 'Strefa Wystawców',
          description: 'Chwila odpoczynku przed ostatnim blokiem sesji i warsztatów.'
        }
      ]
    },
    {
      timeSlot: '12:15 - 13:45',
      isLiveNow: false,
      isBreak: false,
      sessions: [
        {
          id: 'd3_s3',
          isBreak: false,
          roomShort: 'SALA B',
          title: 'Leczenie przeciwkrzepliwe w szczególnych grupach pacjentów',
          speaker: 'prof. dr hab. n. med. Grzegorz Opolski',
          description: 'Dobór NOAC u chorych w podeszłym wieku, ze schyłkową niewydolnością nerek, skazami krwotocznymi oraz u pacjentów po niedawnych krwawieniach z przewodu pokarmowego.'
        },
        {
          id: 'd3_s3b',
          isBreak: false,
          roomShort: 'WARSZTAT',
          title: 'Warsztat: Resuscytacja zaawansowana (ALS) – Symulacja',
          speaker: 'Zespół Ratownictwa Medycznego SKD',
          description: 'Praktyczne scenariusze zatrzymania krążenia w mechanizmach do defibrylacji i bez defibrylacji na zaawansowanych fantomach wysokiej wierności.'
        }
      ]
    },
    {
      timeSlot: '13:45 - 14:15',
      isLiveNow: false,
      isBreak: true,
      sessions: [
        {
          id: 'd3_lunch',
          isBreak: true,
          roomShort: 'RESTAURACJA',
          title: '🍽️ Poczęstunek Zamykający Kongres & Pożegnalna Kawa',
          speaker: 'Poziom 0',
          description: 'Poczęstunek dla uczestników oraz czas na podsumowanie wrażeń i kontaktów nawiązanych podczas kongresu.'
        }
      ]
    },
    {
      timeSlot: '14:15 - 15:30',
      isLiveNow: false,
      isBreak: false,
      sessions: [
        {
          id: 'd3_s4',
          isBreak: false,
          roomShort: 'SALA A',
          title: 'Uroczysta Sesja Zamknięcia: Wręczenie nagród naukowych',
          speaker: 'Prezydium Polskiego Towarzystwa Kardiologicznego',
          description: 'Podsumowanie obrad Konferencji SKD 2026, wręczenie nagród za najlepsze doniesienia plakatowe i prace młodych naukowców oraz oficjalne zakończenie kongresu.'
        }
      ]
    }
  ]
};