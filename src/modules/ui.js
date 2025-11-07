// UI rendering helpers, kept modular so logic stays separate
export function renderText(container, text) {
  if (!container) return;
  container.innerHTML = '';
  const frag = document.createDocumentFragment();
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const span = document.createElement('span');
    span.className = 'char' + (ch === ' ' ? ' space' : '');
    span.textContent = ch;
    frag.appendChild(span);
  }
  container.appendChild(frag);
}

export function updateTextProgress(container, typedStates, currentIndex) {
  if (!container) return;
  const nodes = container.children;
  const max = Math.min(nodes.length, typedStates.length);
  for (let i = 0; i < max; i++) {
    const n = nodes[i];
    const state = typedStates[i] || 0;
    n.classList.toggle('correct', state === 1);
    n.classList.toggle('incorrect', state === -1);
    n.classList.remove('current');
    n.classList.remove('current-word');
  }
  if (currentIndex >= 0 && currentIndex < nodes.length) {
    nodes[currentIndex].classList.add('current');
    // Ensure current char is visible within the scrolling container
    const node = nodes[currentIndex];
    const top = node.offsetTop;
    const bottom = top + node.offsetHeight;
    const viewTop = container.scrollTop;
    const viewBottom = viewTop + container.clientHeight;
    if (top < viewTop + 24) {
      container.scrollTop = Math.max(0, top - 24);
    } else if (bottom > viewBottom - 24) {
      container.scrollTop = Math.min(container.scrollHeight, bottom - container.clientHeight + 24);
    }

    // Highlight current word for better guidance
    const text = Array.from(nodes).map(n => n.textContent).join('');
    let start = currentIndex;
    while (start > 0 && /\S/.test(text[start - 1])) start--;
    let end = currentIndex;
    while (end < text.length && /\S/.test(text[end])) end++;
    for (let i = start; i < end; i++) {
      nodes[i]?.classList.add('current-word');
    }
  }
}

export function updateStatsUI({ wpm, raw, accuracy, errors }, root = document) {
  const wpmEl = root.getElementById('wpm');
  const rawEl = root.getElementById('raw-wpm');
  const accEl = root.getElementById('accuracy');
  const errEl = root.getElementById('errors');
  if (wpmEl) wpmEl.textContent = String(wpm);
  if (rawEl) rawEl.textContent = String(raw);
  if (accEl) accEl.textContent = `${accuracy}%`;
  if (errEl) errEl.textContent = String(errors);
}

export function updateProgressLabel({ mode, remainingMs, totalMs, wordsRemaining, totalWords }, root = document) {
  const valueEl = root.getElementById('progress-value');
  if (!valueEl) return;
  if (mode === 'time') {
    const secs = Math.ceil((remainingMs ?? totalMs) / 1000);
    valueEl.textContent = `${secs}s`;
  } else {
    const remaining = wordsRemaining ?? totalWords;
    valueEl.textContent = `${remaining}`;
  }
}

export function setTheme(dark = true) {
  const cls = dark ? '' : 'theme-light';
  document.documentElement.className = cls;
}

export function updateProgressBar({ mode, remainingMs, totalMs, wordsRemaining, totalWords }, root = document) {
  const bar = root.getElementById('progress-bar-fill');
  if (!bar) return;
  let pct = 0;
  if (mode === 'time') {
    const total = totalMs ?? Math.max(remainingMs ?? 0, 1);
    const rem = remainingMs ?? totalMs ?? 0;
    pct = Math.max(0, Math.min(100, 100 * (1 - rem / total)));
  } else {
    const total = totalWords ?? Math.max(wordsRemaining ?? 0, 1);
    const rem = wordsRemaining ?? totalWords ?? 0;
    pct = Math.max(0, Math.min(100, 100 * (1 - rem / total)));
  }
  bar.style.width = pct + '%';
}