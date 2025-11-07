// Simple modular motivation rotator: periodically updates the hero microcopy.
export function startMotivationCycle(doc) {
  const el = doc.getElementById('motivation-text');
  if (!el) return;
  const messages = [
    'Accuracy over speed — the speed will come.',
    'Keep your rhythm. Consistency beats bursts.',
    'Small mistakes are fine. Breathe and continue.',
    'Flow > force. Relax your shoulders and type.',
    'Eyes forward, fingers light — trust your muscle memory.',
    'Be curious. Try new layouts and content modes.',
    'Precision mode is a great focus drill — give it a spin.',
    'Numbers & symbols sharpen precision. Quotes train cadence.',
  ];
  let i = 0;
  const update = () => {
    el.textContent = messages[i % messages.length];
    i++;
  };
  update();
  setInterval(update, 6500);
}