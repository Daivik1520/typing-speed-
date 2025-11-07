import { Settings } from './modules/settings.js';
import { renderText, updateTextProgress, updateStatsUI, updateProgressLabel, updateProgressBar, setTheme } from './modules/ui.js';
import { generateText } from './modules/textGenerator.js';
import { TestSession } from './modules/testSession.js';
import { addResult, loadLeaderboard, clearLeaderboard } from './modules/persistence.js';
import { startMotivationCycle } from './modules/motivation.js';
import { applyBranding } from './modules/branding.js';

let session = null;
let settings = null;
let inputEl = null;
let textContainer = null;
let audioCtx = null;

function playErrorBeep() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'square';
    o.frequency.value = 440;
    g.gain.value = 0.03;
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start();
    setTimeout(() => { o.stop(); o.disconnect(); g.disconnect(); }, 80);
  } catch {}
}

function setupThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  try {
    const pref = localStorage.getItem('typing-theme') || 'dark';
    setTheme(pref !== 'dark' ? false : true);
    btn.textContent = pref === 'dark' ? '🌙' : '☀️';
  } catch {}
  btn?.addEventListener('click', () => {
    const curLight = document.documentElement.classList.contains('theme-light');
    setTheme(curLight); // toggle
    const next = curLight ? 'dark' : 'light';
    btn.textContent = next === 'dark' ? '🌙' : '☀️';
    try { localStorage.setItem('typing-theme', next); } catch {}
  });
}

function buildLeaderboard() {
  const list = document.getElementById('leaderboard-list');
  if (!list) return;
  list.innerHTML = '';
  const entries = loadLeaderboard();
  entries.forEach((e, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${idx + 1}. ${e.wpm} WPM</strong> <span class="meta">Acc: ${e.accuracy}% • Raw: ${e.raw} • Errors: ${e.errors} • ${e.mode === 'time' ? e.duration + 's' : e.duration + ' words'} • ${new Date(e.ts).toLocaleString()}</span>`;
    list.appendChild(li);
  });
}

function wireLeaderboardControls() {
  const clearBtn = document.getElementById('clear-leaderboard');
  clearBtn?.addEventListener('click', () => { clearLeaderboard(); buildLeaderboard(); });
}

function init() {
  textContainer = document.getElementById('text-container');
  inputEl = document.getElementById('typing-input');
  settings = new Settings(document);
  setupThemeToggle();
  wireLeaderboardControls();
  buildLeaderboard();
  startMotivationCycle(document);
  applyBranding(document, { name: 'SAM', tagline: 'Precision & Flow' });

  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const resetBtn = document.getElementById('reset-btn');

  const prepareSession = () => {
    const conf = settings.value();
    const genOpts = {
      words: conf.wordCount,
      includePunctuation: conf.punctuation,
      type: conf.content,
      difficulty: conf.difficulty,
      customText: conf.customText,
    };
    if (conf.mode === 'words') {
      const text = generateText(genOpts);
      renderText(textContainer, text);
      session = new TestSession({ text, mode: 'words', duration: conf.wordCount, allowBackspace: !conf.precision, onUpdate: onUpdate, onEnd: onEnd, onChar: onChar });
      updateProgressLabel({ mode: 'words', totalWords: conf.wordCount }, document);
      updateProgressBar({ mode: 'words', totalWords: conf.wordCount }, document);
    } else {
      const wordsEstimate = 200; // generate plenty of text for time mode
      const text = generateText({ ...genOpts, words: wordsEstimate });
      renderText(textContainer, text);
      session = new TestSession({ text, mode: 'time', duration: conf.duration, allowBackspace: !conf.precision, onUpdate: onUpdate, onEnd: onEnd, onChar: onChar });
      updateProgressLabel({ mode: 'time', totalMs: conf.duration * 1000 }, document);
      updateProgressBar({ mode: 'time', totalMs: conf.duration * 1000 }, document);
    }
    inputEl.value = '';
    inputEl.focus();
    updateTextProgress(textContainer, session.typedStates, session.currentIndex);
    updateStatsUI({ wpm: 0, raw: 0, accuracy: 100, errors: 0 }, document);
    const hint = document.getElementById('hint');
    if (hint) hint.style.opacity = 0.8;
  };

  settings.onChange(() => {
    const wasRunning = session?.running;
    prepareSession();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = false;
    if (wasRunning) {
      session.start();
      startBtn.disabled = true;
      pauseBtn.disabled = false;
    }
  });

  const onUpdate = ({ stats, typedStates, currentIndex, mode, remainingMs, wordsRemaining, text }) => {
    updateTextProgress(textContainer, typedStates, currentIndex);
    updateStatsUI(stats, document);
    updateProgressLabel({ mode, remainingMs, wordsRemaining }, document);
    updateProgressBar({ mode, remainingMs, wordsRemaining }, document);
  };
  const onChar = ({ char, correct }) => {
    const conf = settings.value();
    if (!correct && conf.errorSound) playErrorBeep();
  };
  const onEnd = ({ stats, mode, duration }) => {
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = false;
    try {
      const saved = addResult({ ...stats, mode, duration, ts: Date.now() });
      buildLeaderboard(saved);
    } catch {}
    const hint = document.getElementById('hint');
    if (hint) hint.style.opacity = 1;
  };

  startBtn?.addEventListener('click', () => {
    if (!session) prepareSession();
    session.start();
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
    inputEl.focus();
    const hint = document.getElementById('hint');
    if (hint) hint.style.opacity = 0;
  });

  pauseBtn?.addEventListener('click', () => {
    session?.pause();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    inputEl.blur();
  });

  resetBtn?.addEventListener('click', () => {
    const conf = settings.value();
    const text = conf.mode === 'words'
      ? generateText({ words: conf.wordCount, includePunctuation: conf.punctuation })
      : generateText({ words: 200, includePunctuation: conf.punctuation });
    renderText(textContainer, text);
    session?.reset({ text, mode: conf.mode, duration: conf.mode === 'time' ? conf.duration : conf.wordCount });
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = false;
    inputEl.value = '';
    inputEl.focus();
    updateProgressLabel({ mode: conf.mode, totalMs: conf.duration * 1000, totalWords: conf.wordCount }, document);
    updateProgressBar({ mode: conf.mode, totalMs: conf.duration * 1000, totalWords: conf.wordCount }, document);
    const hint = document.getElementById('hint');
    if (hint) hint.style.opacity = 0.8;
  });

  inputEl?.addEventListener('input', (e) => {
    const val = e.target.value;
    if (!val) return;
    // Process all characters entered, then clear input for next cycle
    for (const ch of val) {
      session?.handleCharInput(ch);
    }
    e.target.value = '';
  });
  textContainer?.addEventListener('click', () => inputEl?.focus());
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      session?.handleBackspace();
    }
  });

  // Initial
  prepareSession();
}

window.addEventListener('DOMContentLoaded', init);