const KEY = 'typing-speed-leaderboard-v1';

export function loadLeaderboard() {
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(data)) return [];
    return data;
  } catch {
    return [];
  }
}

export function saveLeaderboard(entries) {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries));
  } catch (e) {
    console.error('Failed to save leaderboard', e);
  }
}

export function addResult(result) {
  const entries = loadLeaderboard();
  entries.push(result);
  entries.sort((a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy);
  const trimmed = entries.slice(0, 10);
  saveLeaderboard(trimmed);
  return trimmed;
}

export function clearLeaderboard() {
  try { localStorage.removeItem(KEY); } catch {}
}