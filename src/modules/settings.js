// Centralized settings handling for easy extension and replacement
export class Settings {
  constructor(root = document) {
    this.root = root;
    this.modeSelect = root.getElementById('mode-select');
    this.contentSelect = root.getElementById('content-select');
    this.durationSelect = root.getElementById('duration-select');
    this.wordCountSelect = root.getElementById('wordcount-select');
    this.puncToggle = root.getElementById('punctuation-toggle');
    this.difficultySelect = root.getElementById('difficulty-select');
    this.precisionToggle = root.getElementById('precision-toggle');
    this.errorSoundToggle = root.getElementById('error-sound-toggle');
    this.customTextArea = root.getElementById('custom-text');
    this._listeners = new Set();
    this._wire();
  }
  _wire() {
    const updateVisible = () => {
      const mode = this.modeSelect.value;
      this.root.querySelectorAll('.control-group[data-for]').forEach(el => {
        const target = el.getAttribute('data-for');
        el.hidden = target !== mode;
      });
      const label = this.root.getElementById('progress-label');
      label.textContent = mode === 'time' ? 'Time' : 'Words';
      const content = this.contentSelect.value;
      this.root.querySelectorAll('.control-group[data-for-content]').forEach(el => {
        const target = el.getAttribute('data-for-content');
        el.hidden = target !== content;
      });
    };
    ['change'].forEach(evt => {
      this.modeSelect.addEventListener(evt, () => { updateVisible(); this._emit(); });
      this.contentSelect.addEventListener(evt, () => { updateVisible(); this._emit(); });
      this.durationSelect.addEventListener(evt, () => this._emit());
      this.wordCountSelect.addEventListener(evt, () => this._emit());
      this.puncToggle.addEventListener(evt, () => this._emit());
      this.difficultySelect.addEventListener(evt, () => this._emit());
      this.precisionToggle.addEventListener(evt, () => this._emit());
      this.errorSoundToggle.addEventListener(evt, () => this._emit());
      this.customTextArea.addEventListener('input', () => this._emit());
    });
    updateVisible();
  }
  onChange(listener) { this._listeners.add(listener); return () => this._listeners.delete(listener); }
  _emit() { for (const l of this._listeners) try { l(this.value()); } catch(e){ console.error(e);} }
  value() {
    return {
      mode: this.modeSelect?.value || 'time',
      content: this.contentSelect?.value || 'words',
      duration: parseInt(this.durationSelect?.value || '60', 10),
      wordCount: parseInt(this.wordCountSelect?.value || '50', 10),
      punctuation: !!this.puncToggle?.checked,
      difficulty: this.difficultySelect?.value || 'normal',
      precision: !!this.precisionToggle?.checked,
      errorSound: !!this.errorSoundToggle?.checked,
      customText: this.customTextArea?.value || '',
    };
  }
}