export function computeStats({ correctChars, totalChars, errors, elapsedMs }) {
  const minutes = Math.max(elapsedMs, 1) / 60000;
  const wpm = Math.round((correctChars / 5) / minutes);
  const raw = Math.round((totalChars / 5) / minutes);
  const acc = totalChars > 0 ? Math.max(0, Math.min(100, Math.round((correctChars / totalChars) * 100))) : 100;
  return { wpm, raw, accuracy: acc, errors };
}