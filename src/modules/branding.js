// Branding module: easily configure brand name and tagline without touching UI logic
export function applyBranding(doc, { name = 'SAM', tagline = 'Precision & Flow' } = {}) {
  const badge = doc.getElementById('brand-badge');
  if (badge) badge.textContent = `by ${name}`;

  const sub = doc.getElementById('brand-sub');
  if (sub) sub.textContent = `${name} — ${tagline}`;

  const footerP = doc.querySelector('.app-footer p');
  if (footerP && !footerP.dataset.brandApplied) {
    footerP.innerHTML = `Built for speed and accuracy • Modular design • Works offline • <strong>${name}</strong>`;
    footerP.dataset.brandApplied = 'true';
  }
}