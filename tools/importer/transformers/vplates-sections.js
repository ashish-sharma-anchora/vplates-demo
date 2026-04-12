/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: VPlates sections.
 * Adds section breaks (<hr>) and section-metadata blocks based on template sections.
 * Runs only in afterTransform hook.
 * Selectors from captured DOM at https://www.vplates.com.au/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to avoid DOM position shifts
    const reversedSections = [...sections].reverse();

    for (const section of reversedSections) {
      const selector = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;

      for (const sel of selector) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (!sectionEl) continue;

      // Add section-metadata block if section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(metaBlock);
      }

      // Add <hr> section break before each section (except first)
      const isFirst = sections.indexOf(section) === 0;
      if (!isFirst) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
