// assets/js/i18n.js
const I18N_DIR = './assets/i18n';

async function loadDict(lang) {
  const res = await fetch(`${I18N_DIR}/${lang}.json`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`i18n load failed: ${res.status}`);
  return res.json();
}

function applyTexts(dict) {
  // Texte
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = key.split('.').reduce((o,k)=>o?.[k], dict);
    if (typeof val === 'string') el.textContent = val;
  });

  // Attributs (ex: data-i18n-attr="title:meta.title,aria-label:nav.toggleLabel")
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    const mappings = el.getAttribute('data-i18n-attr').split(',').map(s=>s.trim());
    mappings.forEach(map => {
      const [attr, key] = map.split(':').map(s=>s.trim());
      const val = key.split('.').reduce((o,k)=>o?.[k], dict);
      if (typeof val === 'string') el.setAttribute(attr, val);
    });
  });
}

async function setLang(lang) {
  try {
    const dict = await loadDict(lang);
    applyTexts(dict);
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang-active', lang);
    localStorage.setItem('lang', lang);

    // bouton actif
    document.querySelectorAll('.lang-btn').forEach(b=>{
      b.classList.toggle('active', b.dataset.lang === lang);
    });

    // titre <title> (si pas balisé)
    if (!document.querySelector('title[data-i18n]') && dict?.meta?.title) {
      document.title = dict.meta.title;
    }
  } catch (e) {
    console.error(e);
  }
}

// --- Afficher seulement la langue vers laquelle on peut switcher ---
const updateLangButtons = (currentLang) => {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const btnLang = btn.dataset.lang;

    // si le bouton correspond à la langue actuelle -> on le cache
    if (btnLang === currentLang) {
      btn.classList.add('d-none');      // classe Bootstrap pour "display:none"
    } else {
      btn.classList.remove('d-none');   // l'autre reste visible
    }
  });
};


document.addEventListener('DOMContentLoaded', () => {
  // choix initial
  const stored = localStorage.getItem('lang');
  const browser = (navigator.language || 'fr').slice(0,2);
  const initial = stored || (browser === 'nl' ? 'nl' : 'fr');
  setLang(initial);

  // écouteurs UI
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
});
