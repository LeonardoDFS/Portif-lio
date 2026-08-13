const eras = ['era-01', 'era-02', 'era-03', 'era-04'];
const eraLabels = [
  'ERA_01 / TERMINAL',
  'ERA_02 / DESKTOP',
  'ERA_03 / Y2K_WEB',
  'ERA_04 / PRESENT_DAY',
];

let current = 0;
let isAnimating = false;
let scrollCooldown = false;

function getEraIndexFromHash() {
  const id = window.location.hash.replace('#', '');
  const index = eras.indexOf(id);
  return index >= 0 ? index : current;
}

function updateNavigation() {
  document.querySelectorAll('[data-era-index]').forEach(link => {
    const isCurrent = Number(link.dataset.eraIndex) === current;
    link.classList.toggle('active', isCurrent);
    link.classList.toggle('bg-primary/10', isCurrent);
    link.classList.toggle('text-primary', isCurrent);
    link.classList.toggle('border-l-2', isCurrent && link.closest('aside'));
    link.classList.toggle('border-primary', isCurrent && link.closest('aside'));
    link.classList.toggle('text-primary/30', !isCurrent && link.closest('aside'));

    if (isCurrent) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  const label = document.getElementById('current-era-label');
  if (label) label.textContent = eraLabels[current];
}

function setActiveEra(index) {
  eras.forEach((id, i) => {
    const era = document.getElementById(id);
    if (!era) return;
    era.classList.toggle('active', i === index);
    era.setAttribute('aria-hidden', i === index ? 'false' : 'true');
  });

  current = index;
  updateNavigation();
}

function initEras() {
  const initial = getEraIndexFromHash();
  setActiveEra(initial);
}

function goToEra(index, options = {}) {
  const { updateHistory = true, instant = false } = options;
  if (isAnimating || index < 0 || index >= eras.length || index === current) return;

  const target = document.getElementById(eras[index]);
  const active = document.getElementById(eras[current]);
  const overlay = document.getElementById('glitch-overlay');
  if (!target || !active || !overlay) return;

  if (current === 1 && index !== 1 && typeof stopDoom === 'function') {
    stopDoom();
  }

  const completeTransition = () => {
    setActiveEra(index);
    target.querySelector('.era-scroll')?.scrollTo({ top: 0, behavior: 'auto' });

    if (updateHistory) {
      history.pushState({ era: eras[index] }, '', `#${eras[index]}`);
    }

    overlay.classList.remove('fade-in');
    overlay.classList.add('fade-out');
    window.setTimeout(() => {
      overlay.classList.remove('fade-out');
      isAnimating = false;
    }, instant ? 0 : 300);
  };

  if (instant || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    completeTransition();
    return;
  }

  isAnimating = true;
  const loadingText = document.getElementById('loading-text');
  if (loadingText) loadingText.textContent = `LOADING ${eraLabels[index]}...`;
  overlay.classList.add('fade-in');
  window.setTimeout(completeTransition, 300);
}

function canScrollCurrentEra(deltaY) {
  const activeEra = document.getElementById(eras[current]);
  const scrollArea = activeEra?.querySelector('.era-scroll, .overflow-y-auto');
  if (!scrollArea || scrollArea.scrollHeight <= scrollArea.clientHeight + 2) return false;

  if (deltaY > 0) {
    return scrollArea.scrollTop + scrollArea.clientHeight < scrollArea.scrollHeight - 2;
  }
  return scrollArea.scrollTop > 2;
}

window.addEventListener('wheel', event => {
  if (!window.matchMedia('(pointer: fine) and (min-width: 768px)').matches) return;
  if (scrollCooldown || isAnimating || canScrollCurrentEra(event.deltaY)) return;

  scrollCooldown = true;
  window.setTimeout(() => { scrollCooldown = false; }, 700);
  if (event.deltaY > 0) goToEra(current + 1);
  else goToEra(current - 1);
}, { passive: true });

window.addEventListener('keydown', event => {
  const interactive = event.target.closest?.('a, button, input, textarea, select, iframe');
  if (interactive) return;

  if (event.key === 'ArrowDown' || event.key === 'ArrowRight' || event.key === 'PageDown') {
    goToEra(current + 1);
  }
  if (event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'PageUp') {
    goToEra(current - 1);
  }
});

document.querySelectorAll('a[href^="#era-"]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const index = eras.indexOf(link.hash.replace('#', ''));
    if (index === current) {
      document.getElementById(eras[current])?.querySelector('.era-scroll, .overflow-y-auto')?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    goToEra(index);
  });
});

window.addEventListener('popstate', () => {
  const index = getEraIndexFromHash();
  if (index !== current) goToEra(index, { updateHistory: false, instant: true });
});

initEras();
