// Simple Pub/Sub event bus to decouple modules
export class EventBus {
  constructor() {
    this.events = new Map();
  }
  on(event, handler) {
    if (!this.events.has(event)) this.events.set(event, new Set());
    this.events.get(event).add(handler);
    return () => this.off(event, handler);
  }
  off(event, handler) {
    const set = this.events.get(event);
    if (!set) return;
    set.delete(handler);
    if (set.size === 0) this.events.delete(event);
  }
  emit(event, payload) {
    const set = this.events.get(event);
    if (!set) return;
    for (const handler of set) {
      try { handler(payload); } catch (e) { console.error("EventBus handler error", e); }
    }
  }
}