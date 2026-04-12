/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-cta-tiles variant.
 * Base: columns. Source: https://www.vplates.com.au/
 * Extracts: 4 CTA tiles with title, subtitle, and link.
 * Selectors from captured DOM: .cta-tiles__list
 *
 * Columns blocks do NOT require field hints (per xwalk hinting rules).
 * Each tile becomes a column with title, subtitle, and link.
 */
export default function parse(element, { document }) {
  const tiles = Array.from(element.querySelectorAll('.cta-tiles__item'));

  const cells = [];

  // Each row = one tile, each tile = one column cell with title + subtitle + link
  // For columns block: all tiles in a single row, each tile is a cell
  const row = [];

  for (const tile of tiles) {
    const link = tile.querySelector('a');
    const titleEl = tile.querySelector('.cta-tiles__title, .field-title');
    const subtitleEl = tile.querySelector('.cta-tiles__description, .field-subtitle');

    const cellContent = document.createDocumentFragment();

    // Title as heading
    if (titleEl) {
      const h3 = document.createElement('h3');
      h3.textContent = titleEl.textContent.trim();
      cellContent.appendChild(h3);
    }

    // Subtitle as paragraph
    if (subtitleEl) {
      const p = document.createElement('p');
      p.textContent = subtitleEl.textContent.trim();
      cellContent.appendChild(p);
    }

    // Link
    if (link) {
      const linkPara = document.createElement('p');
      const a = document.createElement('a');
      a.href = link.href || '#';
      a.textContent = titleEl ? titleEl.textContent.trim() : 'Learn more';
      linkPara.appendChild(a);
      cellContent.appendChild(linkPara);
    }

    row.push(cellContent);
  }

  if (row.length > 0) {
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-cta-tiles', cells });
  element.replaceWith(block);
}
