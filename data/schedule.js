// ================= 1. BAZA DANYCH KALENDARZA (PL / EN) =================
const DAY_NAMES = {
  pl: {
    'day-1': 'Piątek (24.04)',
    'day-2': 'Sobota (25.04)',
    'day-3': 'Niedziela (26.04)'
  },
  en: {
    'day-1': 'Friday (Apr 24)',
    'day-2': 'Saturday (Apr 25)',
    'day-3': 'Sunday (Apr 26)'
  }
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
          roomShort_pl: 'HOL GŁÓWNY',
          roomShort_en: 'MAIN FOYER',
          title_pl: '☕ Rejestracja Uczestników & Kawa Powitalna',
          title_en: '☕ Attendee Registration & Welcome Coffee',
          speaker_pl: 'Strefa Expo • Parter',
          speaker_en: 'Expo Area • Ground Floor',
          desc_pl: 'Odbiór pakietów konferencyjnych, identyfikatorów oraz materiałów naukowych. Zapraszamy na poranną kawę i rozmowy kuluarowe w strefie wystawców.',
          desc_en: 'Collection of conference packs, badges, and scientific materials. Join us for morning coffee and networking in the exhibition area.'
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
          roomShort_pl: 'SALA A',
          roomShort_en: 'HALL A',
          title_pl: 'Inauguracja: Nowe Horyzonty w Kardiologii Klinicznej 2026',
          title_en: 'Inauguration: New Horizons in Clinical Cardiology 2026',
          speaker_pl: 'prof. dr hab. n. med. Janina Kotowska',
          speaker_en: 'Prof. Janina Kotowska, MD, PhD',
          desc_pl: 'Oficjalne otwarcie kongresu SKD 2026. Przegląd przełomowych badań klinicznych z ostatniego roku, wyznaczających nowe standardy postępowania w kardiologii zachowawczej i interwencyjnej.',
          desc_en: 'Official opening of the SKD 2026 Congress. Review of breakthrough clinical trials setting new standards in conservative and interventional cardiology.'
        },
        {
          id: 'd1_s1b',
          isBreak: false,
          roomShort_pl: 'SALA B',
          roomShort_en: 'HALL B',
          title_pl: 'Podstawy Elektrokardiografii w Stanach Nagłych',
          title_en: 'Basics of Electrocardiography in Emergency Medicine',
          speaker_pl: 'dr hab. n. med. Tomasz Lis',
          speaker_en: 'Tomasz Lis, MD, PhD, Assoc. Prof.',
          desc_pl: 'Szybkie i bezbłędne rozpoznawanie elektrokardiograficznych stanów zagrożenia życia na SOR: od ostrego niedokrwienia po złożone zaburzenia rytmu i przewodzenia.',
          desc_en: 'Rapid identification of life-threatening ECG patterns in the ER: from acute ischemia to complex arrhythmias and conduction blocks.'
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
          roomShort_pl: 'FOYER',
          roomShort_en: 'FOYER',
          title_pl: '☕ Przerwa Kawowa & Networking',
          title_en: '☕ Coffee Break & Networking',
          speaker_pl: 'Strefa Wystawców • Parter & Poziom +1',
          speaker_en: 'Exhibitor Zone • Ground Floor & Level +1',
          desc_pl: 'Krótka przerwa regeneracyjna przy kawie oraz możliwość odwiedzenia stoisk partnerów technologicznych i farmaceutycznych.',
          desc_en: 'Short networking coffee break with an opportunity to visit partner and medical tech booths.'
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
          roomShort_pl: 'SALA A',
          roomShort_en: 'HALL A',
          title_pl: 'Ostre zespoły wieńcowe u chorych z cukrzycą typu 2',
          title_en: 'Acute Coronary Syndromes in Type 2 Diabetes Patients',
          speaker_pl: 'prof. dr hab. n. med. Andrzej Nowak',
          speaker_en: 'Prof. Andrzej Nowak, MD, PhD',
          desc_pl: 'Specyfika patofizjologiczna i wyzwania kliniczne rewaskularyzacji u pacjentów ze współistniejącą cukrzycą. Optymalizacja farmakoterapii przeciwpłytkowej w ostrej fazie i po wypisie.',
          desc_en: 'Pathophysiological characteristics and revascularization challenges in diabetic patients. Optimizing antiplatelet therapy in acute and post-discharge phases.'
        },
        {
          id: 'd1_s3',
          isBreak: false,
          roomShort_pl: 'SALA B',
          roomShort_en: 'HALL B',
          title_pl: 'Migotanie przedsionków – krioablacja vs farmakoterapia',
          title_en: 'Atrial Fibrillation – Cryoablation vs Pharmacotherapy',
          speaker_pl: 'dr hab. n. med. Ewa Wiśniewska',
          speaker_en: 'Ewa Wiśniewska, MD, PhD, Assoc. Prof.',
          desc_pl: 'Analiza wskazań do wczesnej interwencji zabiegowej w napadowym i przetrwałym migotaniu przedsionków. Zestawienie bezpieczeństwa i długoterminowej skuteczności.',
          desc_en: 'Indications for early catheter ablation in paroxysmal and persistent atrial fibrillation. Safety and long-term efficacy comparison.'
        },
        {
          id: 'd1_s3c',
          isBreak: false,
          roomShort_pl: 'WARSZTAT',
          roomShort_en: 'WORKSHOP',
          title_pl: 'Warsztat: Interpretacja trudnych zapisów Holter EKG',
          title_en: 'Workshop: Interpretation of Complex Holter ECG Traces',
          speaker_pl: 'dr n. med. Paweł Górski',
          speaker_en: 'Paweł Górski, MD, PhD',
          desc_pl: 'Praktyczne warsztaty z analizy nietypowych zaburzeń rytmu serca, artefaktów i bloków przewodzenia na podstawie rzeczywistych 24- i 48-godzinnych zapisów.',
          desc_en: 'Hands-on workshop on analyzing complex arrhythmias, artifacts, and conduction blocks from real 24/48-hour Holter recordings.'
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
          roomShort_pl: 'FOYER',
          roomShort_en: 'FOYER',
          title_pl: '☕ Krótka Przerwa Kawowa',
          title_en: '☕ Short Coffee Break',
          speaker_pl: 'Strefa Expo',
          speaker_en: 'Expo Area',
          desc_pl: 'Przerwa na kawę przed sesjami południowymi i warsztatami praktycznymi.',
          desc_en: 'Coffee break before afternoon sessions and practical workshops.'
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
          roomShort_pl: 'WARSZTAT',
          roomShort_en: 'WORKSHOP',
          title_pl: 'Warsztat USG: Echokardiografia Obciążeniowa w praktyce',
          title_en: 'USG Workshop: Stress Echocardiography in Practice',
          speaker_pl: 'dr n. med. Marek Zieliński',
          speaker_en: 'Marek Zieliński, MD, PhD',
          desc_pl: 'Ocena żywotności mięśnia sercowego i rezerwy wieńcowej w teście obciążeniowym z dobutaminą. Analiza asymetrii kurczliwości i kryteriów przerywania próby.',
          desc_en: 'Evaluation of myocardial viability and coronary flow reserve with dobutamine stress echocardiography. Contractility asymmetry and test endpoints.'
        },
        {
          id: 'd1_s4b',
          isBreak: false,
          roomShort_pl: 'SALA A',
          roomShort_en: 'HALL A',
          title_pl: 'Nowoczesna farmakoterapia zaburzeń lipidowych – inhibitory PCSK9',
          title_en: 'Modern Lipid-Lowering Pharmacotherapy – PCSK9 Inhibitors',
          speaker_pl: 'prof. dr hab. n. med. Krzysztof Baran',
          speaker_en: 'Prof. Krzysztof Baran, MD, PhD',
          desc_pl: 'Miejsce inhibitorów PCSK9, kwasu bempediowego oraz siRNA (inklisiran) w terapii pacjentów bardzo wysokiego ryzyka z nietolerancją statyn.',
          desc_en: 'The role of PCSK9 inhibitors, bempedoic acid, and siRNA (inclisiran) in very high cardiovascular risk patients with statin intolerance.'
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
          roomShort_pl: 'RESTAURACJA',
          roomShort_en: 'RESTAURANT',
          title_pl: '🍽️ Przerwa Obiadowa (Lunch) & Sesja Plakatowa',
          title_en: '🍽️ Lunch Break & Poster Session',
          speaker_pl: 'Poziom 0 • Główna Strefa Gastronomiczna',
          speaker_en: 'Level 0 • Main Dining Area',
          desc_pl: 'Ciepły posiłek dla uczestników połączony z prezentacją prac oryginalnych i przypadków klinicznych w strefie plakatowej.',
          desc_en: 'Hot buffet lunch combined with original research and clinical case presentations in the poster session hall.'
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
          roomShort_pl: 'SALA A',
          roomShort_en: 'HALL A',
          title_pl: 'Niewydolność Serca z zachowaną frakcją wyrzutową (HFpEF)',
          title_en: 'Heart Failure with Preserved Ejection Fraction (HFpEF)',
          speaker_pl: 'prof. dr hab. n. med. Roman Kaczmarek',
          speaker_en: 'Prof. Roman Kaczmarek, MD, PhD',
          desc_pl: 'Aktualne kryteria rozpoznania według skali HFA-PEFF, rola flozyn (iSGLT2), antagonistów MRA oraz leczenia chorób współistniejących.',
          desc_en: 'Diagnostic criteria according to HFA-PEFF score, the clinical impact of SGLT2 inhibitors, MRA antagonists, and comorbidities management.'
        },
        {
          id: 'd1_s5b',
          isBreak: false,
          roomShort_pl: 'SALA B',
          roomShort_en: 'HALL B',
          title_pl: 'Postępowanie w zatorowości płucnej wysokiego ryzyka',
          title_en: 'Management of High-Risk Pulmonary Embolism',
          speaker_pl: 'dr hab. n. med. Monika Wróbel',
          speaker_en: 'Monika Wróbel, MD, PhD, Assoc. Prof.',
          desc_pl: 'Protokół wstrząsu obturacyjnego, kwalifikacja do fibrynolizy ogólnoustrojowej vs trombektomii mechanicznej oraz rola zespołów PERT.',
          desc_en: 'Obstructive shock protocol, qualification for systemic thrombolysis vs mechanical thrombectomy, and the role of PERT teams.'
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
          roomShort_pl: 'FOYER',
          roomShort_en: 'FOYER',
          title_pl: '☕ Popołudniowa Kawa i Przekąski',
          title_en: '☕ Afternoon Coffee & Refreshments',
          speaker_pl: 'Strefa Wystawców',
          speaker_en: 'Exhibitor Area',
          desc_pl: 'Krótka chwila wytchnienia i poczęstunek przed popołudniową debatą ekspercką.',
          desc_en: 'Short break with refreshments before the afternoon expert panel debate.'
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
          roomShort_pl: 'SALA A',
          roomShort_en: 'HALL A',
          title_pl: 'Debata Ekspertów: Trudne decyzje kliniczne – Case Studies',
          title_en: 'Expert Debate: Difficult Clinical Decisions – Case Studies',
          speaker_pl: 'Panel Przewodniczących Sekcji PTK',
          speaker_en: 'PTK Section Chairpersons Panel',
          desc_pl: 'Wspólna analiza niejednoznacznych przypadków klinicznych z udziałem ekspertów i aktywnym głosowaniem publiczności.',
          desc_en: 'Joint analysis of borderline clinical cases with live audience polling and expert commentary.'
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
          roomShort_pl: 'HOL GŁÓWNY',
          roomShort_en: 'MAIN FOYER',
          title_pl: '☕ Poranna Kawa & Networking Dnia 2',
          title_en: '☕ Day 2 Morning Coffee & Networking',
          speaker_pl: 'Strefa Expo',
          speaker_en: 'Expo Area',
          desc_pl: 'Powitalna kawa i rozpoczęcie drugiego dnia obrad naukowych.',
          desc_en: 'Welcome coffee and kick-off for the second day of scientific sessions.'
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
          roomShort_pl: 'SALA A',
          roomShort_en: 'HALL A',
          title_pl: 'Choroby strukturalne serca: TAVI oraz naprawa zastawki',
          title_en: 'Structural Heart Disease: TAVI and Valve Repair',
          speaker_pl: 'prof. dr hab. n. med. Tadeusz Kamiński',
          speaker_en: 'Prof. Tadeusz Kamiński, MD, PhD',
          desc_pl: 'Najnowsze osiągnięcia w przezcewnikowym wszczepianiu zastawki aortalnej (TAVI) oraz zabiegach brzeg-do-brzegu (TEER) na zastawce mitralnej i trójdzielnej.',
          desc_en: 'Advances in transcatheter aortic valve implantation (TAVI) and edge-to-edge repair (TEER) for mitral and tricuspid valves.'
        },
        {
          id: 'd2_s1b',
          isBreak: false,
          roomShort_pl: 'SALA B',
          roomShort_en: 'HALL B',
          title_pl: 'Oporne nadciśnienie tętnicze – denerwacja nerkowa',
          title_en: 'Resistant Hypertension – Renal Denervation',
          speaker_pl: 'dr hab. n. med. Karolina Dąbrowska',
          speaker_en: 'Karolina Dąbrowska, MD, PhD, Assoc. Prof.',
          desc_pl: 'Kwalifikacja chorych i aktualne dowody kliniczne na skuteczność denerwacji tętnic nerkowych jako bezpiecznej metody wspomagającej farmakoterapię.',
          desc_en: 'Patient selection and clinical evidence for renal denervation as an adjunctive procedure in resistant hypertension.'
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
          roomShort_pl: 'FOYER',
          roomShort_en: 'FOYER',
          title_pl: '☕ Przerwa Kawowa',
          title_en: '☕ Coffee Break',
          speaker_pl: 'Strefa Expo',
          speaker_en: 'Expo Area',
          desc_pl: 'Przerwa kawowa i networking w strefie wystawienniczej.',
          desc_en: 'Coffee break and networking in the exhibition area.'
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
          roomShort_pl: 'SALA A',
          roomShort_en: 'HALL A',
          title_pl: 'Kardiomiopatia przerostowa: Nowe leki blokujące miozynę sercową',
          title_en: 'Hypertrophic Cardiomyopathy: Cardiac Myosin Inhibitors',
          speaker_pl: 'prof. dr hab. n. med. Michał Sokołowski',
          speaker_en: 'Prof. Michał Sokołowski, MD, PhD',
          desc_pl: 'Przełom w farmakoterapii HCM: inhibitory miozyny sercowej (mawakamten) – mechanizm działania, kwalifikacja i monitorowanie bezpieczeństwa terapii.',
          desc_en: 'Breakthrough in HCM therapy: cardiac myosin inhibitors (mavacamten) – mechanisms, qualification, and safety monitoring.'
        },
        {
          id: 'd2_s2b',
          isBreak: false,
          roomShort_pl: 'WARSZTAT',
          roomShort_en: 'WORKSHOP',
          title_pl: 'Warsztat: Rezonans magnetyczny (CMR) w zapaleniu mięśnia sercowego',
          title_en: 'Workshop: Cardiovascular Magnetic Resonance (CMR) in Myocarditis',
          speaker_pl: 'dr n. med. Piotr Włodarczyk',
          speaker_en: 'Piotr Włodarczyk, MD, PhD',
          desc_pl: 'Ocena kryteriów Lake Louise w CMR, interpretacja mapowania T1/T2 oraz identyfikacja późnego wzmocnienia kontrastowego (LGE).',
          desc_en: 'Evaluation of Lake Louise criteria in CMR, T1/T2 mapping interpretation, and late gadolinium enhancement (LGE) analysis.'
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
          roomShort_pl: 'FOYER',
          roomShort_en: 'FOYER',
          title_pl: '☕ Krótka Przerwa Kawowa',
          title_en: '☕ Short Coffee Break',
          speaker_pl: 'Strefa Wystawców',
          speaker_en: 'Exhibitor Area',
          desc_pl: 'Krótka przerwa przed blokiem kardio-onkologicznym i prewencyjnym.',
          desc_en: 'Short break prior to the cardio-oncology and prevention session.'
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
          roomShort_pl: 'SALA B',
          roomShort_en: 'HALL B',
          title_pl: 'Kardio-onkologia: Monitorowanie kardiotoksyczności chemioterapii',
          title_en: 'Cardio-Oncology: Monitoring Chemotherapy Cardiotoxicity',
          speaker_pl: 'dr hab. n. med. Agnieszka Majewska',
          speaker_en: 'Agnieszka Majewska, MD, PhD, Assoc. Prof.',
          desc_pl: 'Współpraca kardiologa z onkologiem: wczesna detekcja uszkodzenia mięśnia sercowego przy użyciu biomarkerów i techniki GLS-echo.',
          desc_en: 'Cardiologist-oncologist collaboration: early detection of myocardial strain using biomarkers and GLS-echocardiography.'
        },
        {
          id: 'd2_s3b',
          isBreak: false,
          roomShort_pl: 'SALA A',
          roomShort_en: 'HALL A',
          title_pl: 'Prewencja pierwotna i wtórna chorób sercowo-naczyniowych',
          title_en: 'Primary and Secondary Cardiovascular Disease Prevention',
          speaker_pl: 'prof. dr hab. n. med. Dariusz Dudek',
          speaker_en: 'Prof. Dariusz Dudek, MD, PhD',
          desc_pl: 'Aktualizacja kart ryzyka SCORE2, modyfikacja stylu życia, cele terapeutyczne w redukcji ciśnienia i cholesterolu LDL.',
          desc_en: 'Updated SCORE2 risk charts, lifestyle modification, and target goals for BP and LDL cholesterol reduction.'
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
          roomShort_pl: 'RESTAURACJA',
          roomShort_en: 'RESTAURANT',
          title_pl: '🍽️ Przerwa Obiadowa (Lunch) & Forum Młodych Kardiologów',
          title_en: '🍽️ Lunch Break & Young Cardiologists Forum',
          speaker_pl: 'Poziom 0',
          speaker_en: 'Level 0',
          desc_pl: 'Obiad bufetowy połączony ze spotkaniem integracyjnym i dyskusją o ścieżkach rozwoju dla rezydentów oraz młodych kardiologów.',
          desc_en: 'Buffet lunch paired with a networking forum on career pathways for residents and fellows.'
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
          roomShort_pl: 'SALA A',
          roomShort_en: 'HALL A',
          title_pl: 'Sztuczna Inteligencja i Algorytmy Predykcyjne w Kardiologii 2026',
          title_en: 'AI and Predictive Machine Learning Models in Cardiology 2026',
          speaker_pl: 'dr inż. Adam Pawlak & prof. J. Kotowska',
          speaker_en: 'Adam Pawlak, PhD & Prof. J. Kotowska',
          desc_pl: 'Praktyczne wdrożenia modeli uczenia maszynowego w automatycznej analizie EKG, wczesnym wykrywaniu kardiomiopatii oraz niewydolności serca.',
          desc_en: 'Clinical implementations of ML models in automated ECG diagnosis, early cardiomyopathy detection, and HF prediction.'
        },
        {
          id: 'd2_s4b',
          isBreak: false,
          roomShort_pl: 'WARSZTAT',
          roomShort_en: 'WORKSHOP',
          title_pl: 'Warsztat: Angio-TK tętnic wieńcowych (CCTA) krok po kroku',
          title_en: 'Workshop: Coronary CT Angiography (CCTA) Step by Step',
          speaker_pl: 'dr n. med. Wojciech Krawczyk',
          speaker_en: 'Wojciech Krawczyk, MD, PhD',
          desc_pl: 'Zasady akwizycji obrazu, bramkowanie EKG, ocena stopnia zwężeń według CAD-RADS 2.0 oraz analiza niestabilnych blaszek.',
          desc_en: 'Image acquisition principles, ECG gating, CAD-RADS 2.0 stenosis grading, and vulnerable plaque features.'
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
          roomShort_pl: 'FOYER',
          roomShort_en: 'FOYER',
          title_pl: '☕ Przerwa Kawowa',
          title_en: '☕ Coffee Break',
          speaker_pl: 'Strefa Expo',
          speaker_en: 'Expo Area',
          desc_pl: 'Przerwa na kawę przed popołudniowym posiedzeniem zespołu Heart Team.',
          desc_en: 'Coffee break prior to the afternoon Heart Team session.'
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
          roomShort_pl: 'SALA A',
          roomShort_en: 'HALL A',
          title_pl: 'Wielodyscyplinarny Heart Team – wspólne podejmowanie trudnych decyzji',
          title_en: 'Multidisciplinary Heart Team – Joint Decision Making',
          speaker_pl: 'Kardiochirurdzy & Kardiolodzy Inwazyjni',
          speaker_en: 'Cardiac Surgeons & Interventional Cardiologists',
          desc_pl: 'Symulacja posiedzenia Heart Team w złożonej chorobie wielonaczyniowej i wielozastawkowej: optymalny wybór między CABG a wielonaczyniowym PCI.',
          desc_en: 'Live Heart Team case simulation in complex multivessel/multivalvular disease: decision pathways between CABG and multivessel PCI.'
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
          roomShort_pl: 'HOL GŁÓWNY',
          roomShort_en: 'MAIN FOYER',
          title_pl: '☕ Kawa Poranna Finałowego Dnia Kongresu',
          title_en: '☕ Final Day Welcome Coffee',
          speaker_pl: 'Strefa Expo',
          speaker_en: 'Expo Area',
          desc_pl: 'Poranna kawa i powitanie uczestników ostatniego dnia konferencji SKD 2026.',
          desc_en: 'Morning coffee and welcome for the final day of the SKD 2026 Congress.'
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
          roomShort_pl: 'SALA A',
          roomShort_en: 'HALL A',
          title_pl: 'Podsumowanie najnowszych wytycznych ESC 2026',
          title_en: 'ESC 2026 Clinical Practice Guidelines Highlights',
          speaker_pl: 'prof. dr hab. n. med. Stanisław Bartkowiak',
          speaker_en: 'Prof. Stanisław Bartkowiak, MD, PhD',
          desc_pl: 'Syntetyczne zestawienie zmian w oficjalnych rekomendacjach Europejskiego Towarzystwa Kardiologicznego wraz z komentarzem klinicznym eksperta.',
          desc_en: 'Concise summary of updates in the European Society of Cardiology recommendations with expert clinical commentary.'
        },
        {
          id: 'd3_s1b',
          isBreak: false,
          roomShort_pl: 'SALA B',
          roomShort_en: 'HALL B',
          title_pl: 'Opieka koordynowana nad pacjentem po zawale serca (KOS-Zawał)',
          title_en: 'Coordinated Post-Myocardial Infarction Care (KOS-Zawał)',
          speaker_pl: 'dr hab. n. med. Beata Szulc',
          speaker_en: 'Beata Szulc, MD, PhD, Assoc. Prof.',
          desc_pl: 'Doświadczenia i wyniki polskiego programu KOS-Zawał: wpływ wczesnej rehabilitacji i systematycznej kontroli na rokowanie odległe.',
          desc_en: 'Results of the coordinated post-infarction care program: the long-term impact of early cardiac rehabilitation and regular follow-up.'
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
          roomShort_pl: 'FOYER',
          roomShort_en: 'FOYER',
          title_pl: '☕ Przerwa Kawowa',
          title_en: '☕ Coffee Break',
          speaker_pl: 'Strefa Expo',
          speaker_en: 'Expo Area',
          desc_pl: 'Krótka przerwa przed wielkim konkursem wiedzy klinicznej.',
          desc_en: 'Short coffee break before the clinical knowledge grand quiz.'
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
          roomShort_pl: 'SALA A',
          roomShort_en: 'HALL A',
          title_pl: 'Wielki Interaktywny Quiz Kliniczny SKD 2026 (z nagrodami)',
          title_en: 'Grand Interactive Clinical Quiz SKD 2026 (with prizes)',
          speaker_pl: 'Prowadzenie: prof. A. Nowak & dr E. Wiśniewska',
          speaker_en: 'Hosted by: Prof. A. Nowak & Dr E. Wiśniewska',
          desc_pl: 'Emocjonujący turniej wiedzy klinicznej z głosowaniem na żywo przez aplikację kongresową. Do wygrania atrakcyjne nagrody naukowe i edukacyjne!',
          desc_en: 'Live clinical tournament with real-time app voting and educational awards for the winners!'
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
          roomShort_pl: 'FOYER',
          roomShort_en: 'FOYER',
          title_pl: '☕ Krótka Przerwa Kawowa',
          title_en: '☕ Short Coffee Break',
          speaker_pl: 'Strefa Wystawców',
          speaker_en: 'Exhibitor Area',
          desc_pl: 'Chwila odpoczynku przed ostatnim blokiem sesji i warsztatów.',
          desc_en: 'Brief interval before the final session and simulation workshop block.'
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
          roomShort_pl: 'SALA B',
          roomShort_en: 'HALL B',
          title_pl: 'Leczenie przeciwkrzepliwe w szczególnych grupach pacjentów',
          title_en: 'Anticoagulation in Special Patient Populations',
          speaker_pl: 'prof. dr hab. n. med. Grzegorz Opolski',
          speaker_en: 'Prof. Grzegorz Opolski, MD, PhD',
          desc_pl: 'Dobór NOAC u chorych w podeszłym wieku, ze schyłkową niewydolnością nerek, skazami krwotocznymi oraz po niedawnych krwawieniach z przewodu pokarmowego.',
          desc_en: 'DOAC selection in elderly patients, end-stage renal disease, bleeding diathesis, and post-GI hemorrhage.'
        },
        {
          id: 'd3_s3b',
          isBreak: false,
          roomShort_pl: 'WARSZTAT',
          roomShort_en: 'WORKSHOP',
          title_pl: 'Warsztat: Resuscytacja zaawansowana (ALS) – Symulacja',
          title_en: 'Workshop: Advanced Life Support (ALS) Simulation',
          speaker_pl: 'Zespół Ratownictwa Medycznego SKD',
          speaker_en: 'SKD Emergency Medical Team',
          desc_pl: 'Praktyczne scenariusze zatrzymania krążenia w mechanizmach do defibrylacji i bez defibrylacji na zaawansowanych fantomach wysokiej wierności.',
          desc_en: 'Hands-on cardiac arrest simulation scenarios for shockable and non-shockable rhythms on high-fidelity manikins.'
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
          roomShort_pl: 'RESTAURACJA',
          roomShort_en: 'RESTAURANT',
          title_pl: '🍽️ Poczęstunek Zamykający Kongres & Pożegnalna Kawa',
          title_en: '🍽️ Congress Closing Reception & Farewell Coffee',
          speaker_pl: 'Poziom 0',
          speaker_en: 'Level 0',
          desc_pl: 'Poczęstunek dla uczestników oraz czas na podsumowanie wrażeń i kontaktów nawiązanych podczas kongresu.',
          desc_en: 'Closing reception, farewell refreshments, and final networking opportunities.'
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
          roomShort_pl: 'SALA A',
          roomShort_en: 'HALL A',
          title_pl: 'Uroczysta Sesja Zamknięcia: Wręczenie nagród naukowych',
          title_en: 'Closing Ceremony: Scientific Awards & Adjournment',
          speaker_pl: 'Prezydium Polskiego Towarzystwa Kardiologicznego',
          speaker_en: 'Polish Cardiac Society Board',
          desc_pl: 'Podsumowanie obrad Konferencji SKD 2026, wręczenie nagród za najlepsze doniesienia plakatowe i prace młodych naukowców oraz oficjalne zakończenie kongresu.',
          desc_en: 'Summary of the SKD 2026 proceedings, awards for outstanding poster presentations and young investigators, and official adjournment.'
        }
      ]
    }
  ]
};