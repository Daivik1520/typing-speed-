import { computeStats } from './stats.js';

// TestSession manages typing logic, state, and emits updates
export class TestSession {
  constructor({ text, mode = 'time', duration = 60, onUpdate = () => {}, onEnd = () => {}, allowBackspace = true, onChar = () => {} } = {}) {
    this.text = text || '';
    this.mode = mode; // 'time' or 'words'
    this.duration = duration; // seconds for time mode, words count for words mode
    this.correctChars = 0;
    this.totalChars = 0;
    this.errors = 0;
    this.currentIndex = 0;
    this.typedStates = new Array(this.text.length).fill(0); // 1 correct, -1 incorrect
    this._running = false;
    this._startAt = null;
    this._pausedAt = null;
    this._tickTimer = null;
    this.onUpdate = onUpdate;
    this.onEnd = onEnd;
    this.onChar = onChar;
    this.allowBackspace = allowBackspace;
    this._wordsTotal = (this.text.match(/\b\w+\b/g) || []).length;
    this._deadlineTimeout = null; // guarantees end for time mode
  }

  start() {
    if (this._running) return;
    this._running = true;
    if (!this._startAt) this._startAt = Date.now();
    this._startTicking();
    if (this.mode === 'time') {
      const remaining = Math.max(0, (this.duration * 1000) - this.elapsedMs());
      this._deadlineTimeout = setTimeout(() => this.finish(), remaining);
    }
    this._emitUpdate();
  }
  pause() {
    if (!this._running) return;
    this._running = false;
    this._pausedAt = Date.now();
    this._stopTicking();
    if (this._deadlineTimeout) { clearTimeout(this._deadlineTimeout); this._deadlineTimeout = null; }
    this._emitUpdate();
  }
  reset({ text, mode, duration } = {}) {
    this.text = text ?? this.text;
    if (mode) this.mode = mode;
    if (duration) this.duration = duration;
    this.correctChars = 0;
    this.totalChars = 0;
    this.errors = 0;
    this.currentIndex = 0;
    this.typedStates = new Array(this.text.length).fill(0);
    this._running = false;
    this._startAt = null;
    this._pausedAt = null;
    this._stopTicking();
    if (this._deadlineTimeout) { clearTimeout(this._deadlineTimeout); this._deadlineTimeout = null; }
    this._emitUpdate();
  }

  handleCharInput(ch) {
    if (!this._running) return;
    if (this.currentIndex >= this.text.length) return;
    const expected = this.text[this.currentIndex];
    const correct = ch === expected;
    if (correct) {
      this.correctChars++;
      this.totalChars++;
      this.typedStates[this.currentIndex] = 1;
    } else {
      this.errors++;
      this.totalChars++;
      this.typedStates[this.currentIndex] = -1;
    }
    try { this.onChar({ char: ch, correct }); } catch {}
    this.currentIndex++;
    this._emitUpdate();
    this._checkEndByWords();
  }

  handleBackspace() {
    if (!this._running) return;
    if (!this.allowBackspace) return;
    if (this.currentIndex <= 0) return;
    this.currentIndex--;
    const prevState = this.typedStates[this.currentIndex];
    if (prevState === 1) { this.correctChars--; this.totalChars--; }
    else if (prevState === -1) { this.errors--; this.totalChars--; }
    this.typedStates[this.currentIndex] = 0;
    this._emitUpdate();
  }

  elapsedMs() {
    if (!this._startAt) return 0;
    if (this._pausedAt && !this._running) return this._pausedAt - this._startAt;
    return Date.now() - this._startAt;
  }

  _startTicking() {
    this._stopTicking();
    this._tickTimer = setInterval(() => {
      this._emitUpdate();
      if (this.mode === 'time') {
        const remaining = Math.max(0, (this.duration * 1000) - this.elapsedMs());
        if (remaining <= 0) {
          this.finish();
        }
      }
    }, 100);
  }
  _stopTicking() {
    if (this._tickTimer) clearInterval(this._tickTimer);
    this._tickTimer = null;
  }
  _checkEndByWords() {
    if (this.mode !== 'words') return;
    const typedSoFar = this.text.slice(0, this.currentIndex);
    const wordsTyped = (typedSoFar.match(/\b\w+\b/g) || []).length;
    if (wordsTyped >= this.duration) {
      this.finish();
    }
  }
  finish() {
    if (!this._running) return;
    this._running = false;
    this._stopTicking();
    if (this._deadlineTimeout) { clearTimeout(this._deadlineTimeout); this._deadlineTimeout = null; }
    const stats = computeStats({
      correctChars: this.correctChars,
      totalChars: this.totalChars,
      errors: this.errors,
      elapsedMs: this.elapsedMs(),
    });
    this.onEnd({ stats, mode: this.mode, duration: this.duration, wordsTotal: this._wordsTotal });
  }
  _emitUpdate() {
    const stats = computeStats({
      correctChars: this.correctChars,
      totalChars: this.totalChars,
      errors: this.errors,
      elapsedMs: this.elapsedMs(),
    });
    this.onUpdate({
      stats,
      typedStates: this.typedStates,
      currentIndex: this.currentIndex,
      mode: this.mode,
      remainingMs: this.mode === 'time' ? Math.max(0, (this.duration * 1000) - this.elapsedMs()) : undefined,
      wordsRemaining: this.mode === 'words' ? Math.max(0, this.duration - (this.text.slice(0, this.currentIndex).match(/\b\w+\b/g) || []).length) : undefined,
      text: this.text,
    });
  }
}