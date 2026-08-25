// js/config.js
export const CONFIG = {
  // W środowisku produkcyjnym: '/directus'
  // W środowisku lokalnym możesz podmienić na: 'https://skd.91.99.102.15.nip.io/directus' lub 'http://localhost:8055'
  API_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'https://skd.91.99.102.15.nip.io/directus'
    : '/directus',
  
  CONFERENCE: {
    NAME: 'Konferencja SKD 2026',
    DATES: {
      'day-1': '2026-04-24',
      'day-2': '2026-04-25',
      'day-3': '2026-04-26'
    }
  }
};