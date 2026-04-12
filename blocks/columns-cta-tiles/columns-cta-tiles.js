export default function decorate(block) {
  // Each row is a CTA tile item with cells: [tileTitle, tileDescription, tileLink]
  const rows = [...block.children];

  rows.forEach((row) => {
    row.classList.add('cta-tile');

    const cells = [...row.children];
    const titleCell = cells[0];
    const descCell = cells[1];
    const linkCell = cells[2];

    // Get the link href
    const link = linkCell ? linkCell.querySelector('a') : null;
    const href = link ? link.href : '#';

    // Make the whole tile clickable
    if (href !== '#') {
      row.addEventListener('click', () => {
        window.location.href = href;
      });
      row.style.cursor = 'pointer';
    }

    // Style the title
    if (titleCell) titleCell.classList.add('cta-tile-title');

    // Style the description
    if (descCell) descCell.classList.add('cta-tile-description');

    // Hide the link cell (whole tile is clickable)
    if (linkCell) linkCell.classList.add('cta-tile-link');

    // Add arrow indicator
    const arrow = document.createElement('span');
    arrow.classList.add('cta-tile-arrow');
    arrow.setAttribute('aria-hidden', 'true');
    row.appendChild(arrow);
  });
}
