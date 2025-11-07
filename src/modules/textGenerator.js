// Generates typing text. Modular so it's easy to swap sources or strategies.
const DEFAULT_WORDS = (
  'time person year way day thing man world life hand part child eye woman place work week case point government company number group problem fact '
  + 'be have do say get make go know take see come think look want give use find tell ask work seem feel try leave call good new first last long '
  + 'great little own other old right big high different small large next early young important few public bad same able'
).trim().split(/\s+/);

function randomItem(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

const QUOTES = [
  'The only limit to our realization of tomorrow is our doubts of today.',
  'Do not watch the clock. Do what it does. Keep going.',
  'Success is not final, failure is not fatal: it is the courage to continue that counts.',
  'Quality is not an act, it is a habit.',
  'It always seems impossible until it is done.'
];

const CODE_SNIPPETS = [
  'function sum(a, b) {\n  return a + b;\n}',
  'const greet = (name) => {\n  console.log(`Hello, ${name}!`);\n};',
  'for (let i = 0; i < 3; i++) {\n  console.log(i);\n}'
];

const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:\",.<>/?';

export function generateText({
  words = 50,
  includePunctuation = true,
  seed = Date.now(),
  type = 'words', // 'words' | 'quotes' | 'numbers' | 'code' | 'custom'
  difficulty = 'normal', // 'easy' | 'normal' | 'hard'
  customText = ''
}) {
  const rng = mulberry32(seed);
  const punct = [',', '.', ';', '!', '?'];
  const capsChanceByDiff = { easy: 0.03, normal: 0.08, hard: 0.15 };
  const punctChanceByDiff = { easy: 0.05, normal: includePunctuation ? 0.15 : 0, hard: includePunctuation ? 0.25 : 0 };
  const capsChance = capsChanceByDiff[difficulty] ?? 0.08;
  const punctChance = punctChanceByDiff[difficulty] ?? (includePunctuation ? 0.15 : 0);

  if (type === 'custom' && customText.trim().length > 0) {
    return customText.trim();
  }
  if (type === 'quotes') {
    return randomItem(QUOTES, rng);
  }
  if (type === 'code') {
    return randomItem(CODE_SNIPPETS, rng);
  }
  if (type === 'numbers') {
    const result = [];
    for (let i = 0; i < words; i++) {
      const n = Math.floor(rng() * 10000);
      let token = String(n);
      if (rng() < 0.5) token += randomItem(punct, rng);
      if (rng() < 0.5) token += randomItem(SYMBOLS.split(''), rng);
      result.push(token);
    }
    return result.join(' ');
  }

  const resultWords = [];
  for (let i = 0; i < words; i++) {
    let w = randomItem(DEFAULT_WORDS, rng);
    if (rng() < capsChance) w = w.charAt(0).toUpperCase() + w.slice(1);
    if (rng() < punctChance && i !== words - 1) w += randomItem(punct, rng);
    resultWords.push(w);
  }
  return resultWords.join(' ');
}