// Copyright dynamique + reveal + navbar 
document.addEventListener('DOMContentLoaded', () => {
  const c = document.getElementById('copyright');
  if (c) c.textContent = `© ${new Date().getFullYear()} Karmous Orsula - tous droits reservés`;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('reveal-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
});

const header = document.querySelector('header.sticky-top');
const onScrollHeader = () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 10);
};
onScrollHeader();
window.addEventListener('scroll', onScrollHeader, { passive: true });

// Formes géométriques animées 
(() => {
  const container = document.querySelector('.floating-shapes');
  if (!container) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const root = getComputedStyle(document.documentElement);
  const COLORS = [
    'rgba(42,161,152,0.45)',
    'rgba(42,161,152,0.28)',
    'rgba(255,255,255,0.22)'
  ];
  const SHAPES = ['circle', 'square', 'triangle'];

  const w = window.innerWidth;
  let COUNT = 18;
  if (w >= 576) COUNT = 24;
  if (w >= 992) COUNT = 34;
  if (w >= 1400) COUNT = 44;

  const layer1 = document.createElement('div'); layer1.className = 'layer-1';
  const layer2 = document.createElement('div'); layer2.className = 'layer-2';
  const layer3 = document.createElement('div'); layer3.className = 'layer-3';
  const frag   = document.createDocumentFragment();
  frag.append(layer1, layer2, layer3);
  container.appendChild(frag);

  const makeShape = () => {
    const el   = document.createElement('div');
    const type = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const size = 14 + Math.random() * 46;
    const clr  = COLORS[Math.floor(Math.random() * COLORS.length)];

    el.className = `shape ${type}${Math.random() < 0.35 ? ' glow' : ''}`;
    el.style.left = `${Math.random() * 100}%`;
    el.style.animationDuration = `${8 + Math.random() * 14}s`;
    el.style.animationDelay = `${Math.random() * 10}s`;
    el.style.setProperty('--drift', `${Math.random() * 30 - 15}px`);

    if (type === 'triangle') {
      const half = Math.round(size / 2);
      el.style.width = '0';
      el.style.height = '0';
      el.style.borderLeft  = `${half}px solid transparent`;
      el.style.borderRight = `${half}px solid transparent`;
      el.style.borderBottom = `${Math.round(size)}px solid ${clr}`;
    } else {
      el.style.width = `${Math.round(size)}px`;
      el.style.height = `${Math.round(size)}px`;
      el.style.background = clr;
    }

    const r = Math.random();
    (r < 0.4 ? layer1 : r < 0.75 ? layer2 : layer3).appendChild(el);

    el.style.opacity = (0.35 + Math.random() * 0.45).toFixed(2);
    return el;
  };

  const frag2 = document.createDocumentFragment();
  for (let i = 0; i < COUNT; i++) frag2.appendChild(makeShape());
  container.appendChild(frag2);

  document.addEventListener('visibilitychange', () => {
    container.style.animationPlayState = document.hidden ? 'paused' : 'running';
    container.querySelectorAll('.shape').forEach(s => {
      s.style.animationPlayState = document.hidden ? 'paused' : 'running';
    });
  });


})();
