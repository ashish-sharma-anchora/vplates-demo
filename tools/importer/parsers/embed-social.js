/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed-social variant.
 * Base: embed. Source: https://www.vplates.com.au/
 * Extracts: "Show off your style" heading + SnapWidget Instagram embed.
 * Selectors from captured DOM: .instagram
 *
 * xwalk: Field hints added for non-columns blocks.
 * Row 1: heading text
 * Row 2: embed URL
 */
export default function parse(element, { document }) {
  // Extract heading
  const heading = element.querySelector('.instagram__title, h2');

  // Extract SnapWidget iframe
  const iframe = element.querySelector('.instagram__holder iframe, .snapwidget-widget');

  const cells = [];

  // Row 1: heading
  const headingFrag = document.createDocumentFragment();
  headingFrag.appendChild(document.createComment(' field:heading '));
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    headingFrag.appendChild(h2);
  }
  cells.push([headingFrag]);

  // Row 2: embed source URL
  const embedFrag = document.createDocumentFragment();
  embedFrag.appendChild(document.createComment(' field:source '));
  if (iframe) {
    const src = iframe.src || iframe.getAttribute('data-src') || '';
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = src || 'https://snapwidget.com/embed/715844';
    a.textContent = a.href;
    p.appendChild(a);
    embedFrag.appendChild(p);
  }
  cells.push([embedFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-social', cells });
  element.replaceWith(block);
}
