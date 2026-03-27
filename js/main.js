// ─── CONFIGURAÇÃO ──────────────────────────────────────────────
const CHAR_SPEED     = 25;
const TW_PAUSE       = 100;
const TW_START       = 200;
const BOOT_INTERVAL  = 250;
const BOOT_PAUSE     = 300;
const SKILL_INTERVAL = 150;
const FILL_DURATION  = 700;

// ─── TYPEWRITER ────────────────────────────────────────────────
function typeWriter(el, text, speed, onDone) {
  let i = 0;
  el.textContent = '';

  const timer = setInterval(() => {
    el.textContent += text.charAt(i);
    i++;
    if (i >= text.length) {
      clearInterval(timer);
      if (onDone) onDone();
    }
  }, speed);
}

function runTypewriters(onAllDone) {
  const fields = document.querySelectorAll('.typewriter');
  let accDelay = TW_START;

  fields.forEach((el, i) => {
    const text     = el.dataset.text;
    const isLast   = i === fields.length - 1;
    const myDelay  = accDelay;

    setTimeout(() => {
      typeWriter(el, text, CHAR_SPEED, isLast ? onAllDone : null);
    }, myDelay);

    accDelay += text.length * CHAR_SPEED + TW_PAUSE;
  });
}

// ─── BOOT LOG ──────────────────────────────────────────────────
function runBootLog(onAllDone) {
  const lines = document.querySelectorAll('#boot-log .boot-line');

  lines.forEach((line, i) => {
    const isLast = i === lines.length - 1;

    setTimeout(() => {
      line.classList.add('visible');
      if (isLast) setTimeout(onAllDone, 300 + BOOT_PAUSE);
    }, i * BOOT_INTERVAL);
  });
}

// ─── SKILLS ────────────────────────────────────────────────────
function runSkills() {
  const rows = document.querySelectorAll('#skill-matrix .skill-row');

  rows.forEach((row, i) => {
    setTimeout(() => {
      const label   = row.querySelector('.boot-line');
      const fill    = row.querySelector('.skill-fill');
      const counter = row.querySelector('.counter');

      // Label aparece
      label.classList.add('visible');

      // Barra enche — reinicia a animação do zero
      fill.style.animationDuration = FILL_DURATION + 'ms';
      fill.style.animationDelay    = '0ms';
      fill.style.animationName     = 'none';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          fill.style.animationName = 'fillBar';
        });
      });

      // Contador sobe junto
      const target    = parseInt(counter.dataset.target);
      const steps     = 40;
      const increment = target / steps;
      const interval  = FILL_DURATION / steps;
      let current     = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = Math.floor(current) + '%';
      }, interval);

    }, i * SKILL_INTERVAL);
  });
}

// ─── TIMELINE PRINCIPAL ────────────────────────────────────────
runTypewriters(() => {
  runBootLog(() => {
    runSkills();
  });
});