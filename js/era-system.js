const eras      = ['era-01', 'era-02', 'era-03', 'era-04'];
let current     = 0;
let isAnimating = false;

function initEras() {
  eras.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (i === 0) el.classList.add('active');
  });
}

function goToEra(index) {
  if (isAnimating) return;
  if (index < 0 || index >= eras.length) return;
  if (index === current) return;

  const target = document.getElementById(eras[index]);
  if (!target) return;

  isAnimating = true;

  const overlay = document.getElementById('glitch-overlay');
  overlay.classList.add('fade-in');

  setTimeout(() => {
    document.getElementById(eras[current]).classList.remove('active');
    target.classList.add('active');
    current = index;
    updateSidebar();

    overlay.classList.remove('fade-in');
    overlay.classList.add('fade-out');

    setTimeout(() => {
      overlay.classList.remove('fade-out');
      isAnimating = false;
    }, 300);
  }, 300);
}

function updateSidebar() {
  document.querySelectorAll('aside nav a').forEach((link, i) => {
    if (i === current) {
      link.classList.add('bg-primary/10', 'text-primary', 'border-l-2', 'border-primary');
      link.classList.remove('text-primary/30');
    } else {
      link.classList.remove('bg-primary/10', 'text-primary', 'border-l-2', 'border-primary');
      link.classList.add('text-primary/30');
    }
  });
}

let scrollCooldown = false;

window.addEventListener('wheel', (e) => {
  if (scrollCooldown || isAnimating) return;
  scrollCooldown = true;                          // ← linha corrigida
  setTimeout(() => scrollCooldown = false, 800);
  if (e.deltaY > 0) goToEra(current + 1);
  else              goToEra(current - 1);
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goToEra(current + 1);
  if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  goToEra(current - 1);
});

document.querySelectorAll('a[href^="#era-"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const id    = link.getAttribute('href').replace('#', '');
    const index = eras.indexOf(id);
    if (index !== -1) goToEra(index);
  });
});

initEras();