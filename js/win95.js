// ══════════════════════════════════════
//  WIN95 WINDOW SYSTEM
// ══════════════════════════════════════

let highestZ = 200; // z-index base das janelas

// ── ABRIR JANELA ──────────────────────
function openWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;

    win.style.display = 'block';
    focusWindow(win);
    addToTaskbar(id);

}

// ── FECHAR JANELA ─────────────────────
function closeWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;

    win.style.display = 'none';
    removeFromTaskbar(id);
}

// ── MINIMIZAR ─────────────────────────
function minimizeWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;

  win.style.display = 'none';
  // mantém na taskbar mas marca como minimizada
  const btn = document.querySelector(`[data-taskbar="${id}"]`);
  if (btn) btn.style.borderStyle = 'inset';
}

// ── MAXIMIZAR ─────────────────────────
function maximizeWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;

  if (win.dataset.maximized === 'true') {
    // restaura
    win.style.top    = win.dataset.prevTop;
    win.style.left   = win.dataset.prevLeft;
    win.style.width  = win.dataset.prevWidth;
    win.style.height = win.dataset.prevHeight || 'auto';
    win.dataset.maximized = 'false';
  } else {
    // salva posição atual
    win.dataset.prevTop    = win.style.top;
    win.dataset.prevLeft   = win.style.left;
    win.dataset.prevWidth  = win.style.width;
    win.dataset.prevHeight = win.style.height;
    // maximiza
    win.style.top    = '56px';
    win.style.left   = '0px';
    win.style.width  = '100%';
    win.style.height = 'calc(100% - 56px)';
    win.dataset.maximized = 'true';
  }

  focusWindow(id);
}

// ── FOCAR JANELA (traz pra frente) ────
function focusWindow(id) {
  // tira o foco de todas
  document.querySelectorAll('.win95-window').forEach(w => {
    w.classList.remove('focused');
  });
  // foca a janela clicada
  const win = document.getElementById(id);
  if (!win) return;
  highestZ++;
  win.style.zIndex = highestZ;
  win.classList.add('focused');
}

// ── TASKBAR ───────────────────────────
function addToTaskbar(id) {
  // evita duplicar
  if (document.querySelector(`[data-taskbar="${id}"]`)) return;

  const win   = document.getElementById(id);
  const title = win.querySelector('.win95-titlebar span:last-of-type')?.textContent || id;
  const bar   = document.getElementById('taskbar-windows');

  const btn = document.createElement('button');
  btn.className        = 'taskbar-item';
  btn.dataset.taskbar  = id;
  btn.textContent      = title;

  btn.addEventListener('click', () => {
    const w = document.getElementById(id);
    if (w.style.display === 'none') {
      // restaura se minimizada
      w.style.display = 'block';
      btn.style.borderStyle = '';
      focusWindow(id);
    } else if (w.classList.contains('focused')) {
      // minimiza se já está focada
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  });

  bar.appendChild(btn);
}

function removeFromTaskbar(id) {
  const btn = document.querySelector(`[data-taskbar="${id}"]`);
  if (btn) btn.remove();
}

// ── ARRASTAR JANELAS ──────────────────
function makeDraggable(win) {
  const titlebar = win.querySelector('.win95-titlebar');
  if (!titlebar) return;

  let isDragging = false;
  let startX, startY, startLeft, startTop;

  titlebar.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('win95-btn')) return;
    isDragging = true;
    startX    = e.clientX;
    startY    = e.clientY;
    startLeft = parseInt(win.style.left) || 0;
    startTop  = parseInt(win.style.top)  || 0;
    focusWindow(win.id);
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx   = e.clientX - startX;
    const dy   = e.clientY - startY;
    win.style.left = (startLeft + dx) + 'px';
    win.style.top  = (startTop  + dy) + 'px';
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

// ── RELÓGIO DA TASKBAR ────────────────
function startClock() {
  const clock = document.getElementById('win95-clock');
  if (!clock) return;

  function update() {
    const now = new Date();
    const h   = String(now.getHours()).padStart(2, '0');
    const m   = String(now.getMinutes()).padStart(2, '0');
    clock.textContent = `${h}:${m}`;
  }

  update();
  setInterval(update, 10000);
}

// ── SYSTEM ERROR AUTOMÁTICO ───────────
function scheduleSystemError() {
  setTimeout(() => {
    openWindow('win-error');
  }, 3000); // aparece 3s após entrar na ERA_02
}

// ── INIT ──────────────────────────────
document.querySelectorAll('.win95-window').forEach(win => {
  makeDraggable(win);
  win.addEventListener('mousedown', () => focusWindow(win.id));
});

startClock();

// Dispara System Error quando ERA_02 fica ativa
const era2el = document.getElementById('era-02');
if (era2el) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if ([...mutation.target.classList].includes('active')) {
        setTimeout(() => openWindow('win-error'), 3000);
        observer.disconnect();
      }
    });
  });

  observer.observe(era2el, {
    attributes: true,
    attributeFilter: ['class']
  });
}