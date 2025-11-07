export class Timer {
  constructor({ durationMs = 60000, onTick = () => {}, onEnd = () => {} } = {}) {
    this.durationMs = durationMs;
    this.onTick = onTick;
    this.onEnd = onEnd;
    this._startAt = null;
    this._interval = null;
    this._remainingMs = durationMs;
    this._running = false;
  }
  start() {
    if (this._running) return;
    this._running = true;
    const now = Date.now();
    if (this._startAt == null) this._startAt = now;
    const endAt = this._startAt + this.durationMs;
    this._interval = setInterval(() => {
      const now = Date.now();
      this._remainingMs = Math.max(0, endAt - now);
      this.onTick({ remainingMs: this._remainingMs, elapsedMs: this.elapsedMs() });
      if (this._remainingMs <= 0) {
        this.stop();
        this.onEnd();
      }
    }, 100);
  }
  stop() {
    if (this._interval) clearInterval(this._interval);
    this._interval = null;
    this._running = false;
  }
  reset(durationMs = this.durationMs) {
    this.stop();
    this.durationMs = durationMs;
    this._startAt = null;
    this._remainingMs = durationMs;
  }
  running() { return this._running; }
  remainingMs() { return this._remainingMs; }
  elapsedMs() {
    if (this._startAt == null) return 0;
    if (this._interval == null && this._remainingMs > 0) return Date.now() - this._startAt; // paused
    return this.durationMs - this._remainingMs;
  }
}