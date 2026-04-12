/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-promo-gallery variant.
 * Base: tabs. Source: https://www.vplates.com.au/
 * Extracts: 6 category tabs with carousel content per tab.
 * Selectors from captured DOM: .promo-gallery
 *
 * Each tab panel has carousel items with:
 * - Colored panel (left): title, description, plate image
 * - Content area (right): description text, "Learn more" CTA
 *
 * Structure: Each row = one tab. Cells = [tab label, tab content].
 * Tabs blocks skip the "classes" field and {{ component: tabs }} fields per xwalk rules.
 */
export default function parse(element, { document }) {
  // Extract tab buttons for labels
  const tabButtons = Array.from(element.querySelectorAll('.promo-gallery__tab-nav-btn'));

  // Extract tab panels
  const tabPanels = Array.from(element.querySelectorAll('.promo-tabs__promo-item'));

  const cells = [];

  for (let i = 0; i < tabButtons.length; i++) {
    const tabLabel = tabButtons[i].textContent.trim();
    const panel = tabPanels[i];

    if (!panel) continue;

    // Extract carousel items from this panel
    const carouselItems = Array.from(panel.querySelectorAll('.carousel-item'));
    const contentFrag = document.createDocumentFragment();

    for (const item of carouselItems) {
      // Panel section (colored left side)
      const panelTitle = item.querySelector('.carousel-item__panel-title, h4, h3');
      const panelText = item.querySelector('.carousel-item__panel-text, .carousel-item__panel-foreground p');
      const panelImage = item.querySelector('.carousel-item__panel-image:not(.carousel-item__panel-image--dummy)');
      const panelBgImage = item.querySelector('.carousel-item__panel-background-image');

      // Content section (right side)
      const contentText = item.querySelector('.carousel-item__content-text p');
      const ctaLink = item.querySelector('.carousel-item__content-cta');

      // Build content for this carousel item
      if (panelTitle) {
        const h4 = document.createElement('h4');
        h4.textContent = panelTitle.textContent.trim();
        contentFrag.appendChild(h4);
      }

      if (panelText) {
        const p = document.createElement('p');
        p.textContent = panelText.textContent.trim();
        contentFrag.appendChild(p);
      }

      if (panelImage) {
        const img = document.createElement('img');
        const src = panelImage.getAttribute('data-src') || panelImage.src;
        if (src && !src.startsWith('data:')) {
          img.src = src.startsWith('/') ? 'https://www.vplates.com.au' + src : src;
          img.alt = panelImage.alt || 'Plate style preview';
          contentFrag.appendChild(img);
        }
      } else if (panelBgImage) {
        const img = document.createElement('img');
        const src = panelBgImage.getAttribute('data-src') || panelBgImage.src;
        if (src && !src.startsWith('data:')) {
          img.src = src.startsWith('/') ? 'https://www.vplates.com.au' + src : src;
          img.alt = panelBgImage.alt || 'Background';
          contentFrag.appendChild(img);
        }
      }

      if (contentText) {
        const p = document.createElement('p');
        p.textContent = contentText.textContent.trim();
        contentFrag.appendChild(p);
      }

      if (ctaLink) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = ctaLink.href || '#';
        a.textContent = ctaLink.textContent.trim();
        p.appendChild(a);
        contentFrag.appendChild(p);
      }

      // Add separator between carousel items in same tab
      if (carouselItems.indexOf(item) < carouselItems.length - 1) {
        contentFrag.appendChild(document.createElement('hr'));
      }
    }

    // Row: [tab label, tab content]
    const labelFrag = document.createDocumentFragment();
    const labelEl = document.createElement('p');
    labelEl.textContent = tabLabel;
    labelFrag.appendChild(labelEl);

    cells.push([labelFrag, contentFrag]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-promo-gallery', cells });
  element.replaceWith(block);
}
