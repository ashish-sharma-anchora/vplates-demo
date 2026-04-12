export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  const cols = [...row.children];
  block.classList.add(`columns-cta-tiles-${cols.length}-cols`);

  // Wrap each column as a clickable tile
  cols.forEach((col) => {
    col.classList.add('cta-tile');

    // Find the link and make the whole tile clickable
    const link = col.querySelector('a');
    if (link) {
      col.addEventListener('click', () => {
        window.location.href = link.href;
      });
      col.style.cursor = 'pointer';
    }

    // Add arrow indicator
    const arrow = document.createElement('span');
    arrow.classList.add('cta-tile-arrow');
    arrow.setAttribute('aria-hidden', 'true');
    col.appendChild(arrow);
  });
}
