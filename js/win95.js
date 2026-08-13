// ══════════════════════════════════════
//  WIN95 WINDOW SYSTEM
// ══════════════════════════════════════

let highestZ = 200; // z-index base das janelas

// ── ABRIR JANELA ──────────────────────
function openWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;

    win.style.display = win.classList.contains('doom-window') ? 'flex' : 'block';
    focusWindow(win);
    addToTaskbar(id);

}

// ── FECHAR JANELA ─────────────────────
function closeWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;

    if (id === 'win-snake') stopDoom();
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
    win.style.top    = window.innerWidth < 768 ? '64px' : '68px';
    win.style.left   = '0px';
    win.style.width  = '100%';
    win.style.height = window.innerWidth < 768 ? 'calc(100% - 158px)' : 'calc(100% - 68px)';
    win.dataset.maximized = 'true';
  }

  focusWindow(id);
}

// ── FOCAR JANELA (traz pra frente) ────
function focusWindow(target) {
  // tira o foco de todas
  document.querySelectorAll('.win95-window').forEach(w => {
    w.classList.remove('focused');
  });
  // foca a janela clicada
  const win = typeof target === 'string' ? document.getElementById(target) : target;
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
      w.style.display = w.classList.contains('doom-window') ? 'flex' : 'block';
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

  titlebar.addEventListener('pointerdown', (e) => {
    if (window.innerWidth < 768 || win.dataset.maximized === 'true') return;
    if (e.target.closest('.win95-btn')) return;
    isDragging = true;
    startX    = e.clientX;
    startY    = e.clientY;
    startLeft = parseInt(win.style.left) || 0;
    startTop  = parseInt(win.style.top)  || 0;
    focusWindow(win.id);
    titlebar.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  });

  document.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx   = e.clientX - startX;
    const dy   = e.clientY - startY;
    win.style.left = (startLeft + dx) + 'px';
    win.style.top  = (startTop  + dy) + 'px';
  });

  document.addEventListener('pointerup', () => {
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
    const era2 = document.getElementById('era-02');
    if (era2?.classList.contains('active')) openWindow('win-error');
  }, 3000); // aparece 3s após entrar na ERA_02
}

// ── INIT ──────────────────────────────
document.querySelectorAll('.win95-window').forEach(win => {
  makeDraggable(win);

  // foca ao clicar em qualquer parte da janela
  win.addEventListener('mousedown', () => focusWindow(win.id));
});

startClock();

// Dispara o System Error quando ERA_02 fica ativa
const observer = new MutationObserver(() => {
  const era2 = document.getElementById('era-02');
  if (era2 && era2.classList.contains('active')) {
    scheduleSystemError();
    observer.disconnect(); // só uma vez
  }
});

observer.observe(document.getElementById('era-02'), {
  attributes: true,
  attributeFilter: ['class']
});

function startDoom() {
    const overlay = document.getElementById('doom-overlay');
    const frame   = document.getElementById('doom-frame');
    if (!overlay || !frame) return;

    const status = overlay.querySelector('span:nth-child(2)');
    if (status) status.textContent = 'INICIALIZANDO...';
    overlay.disabled = true;

    const revealGame = () => {
      if (frame.src === 'about:blank') return;
      overlay.style.display = 'none';
      frame.focus();
    };

    if (frame.src === 'about:blank') {
      frame.onload = () => {
        frame.onload = null;
        revealGame();
      };
      frame.src = frame.dataset.src;
    } else {
      revealGame();
    }
}

function stopDoom() {
  const overlay = document.getElementById('doom-overlay');
  const frame = document.getElementById('doom-frame');
  if (!overlay || !frame) return;

  // Navegar o iframe encerra o documento, o áudio e o worker do emulador.
  frame.onload = null;
  frame.src = 'about:blank';
  overlay.style.display = 'flex';
  overlay.disabled = false;

  const status = overlay.querySelector('span:nth-child(2)');
  if (status) status.textContent = '▶ Clique aqui para jogar';
}

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  const focused = [...document.querySelectorAll('.win95-window.focused')].pop();
  if (focused) closeWindow(focused.id);
});
