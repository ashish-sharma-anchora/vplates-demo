/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-plate-checker variant.
 * Base: hero. Source: https://www.vplates.com.au/
 * Extracts: title, vehicle type toggle, plate input, check availability CTA,
 * plate preview output, and "See popular plates" link.
 * Selectors from captured DOM: section#quick-check-combo.quick-combo
 *
 * xwalk model fields: image (reference), imageAlt (collapsed), text (richtext)
 * Row 1: image (plate preview output area)
 * Row 2: text (title + form elements + CTAs combined as richtext)
 */
export default function parse(element, { document }) {
  // Extract title
  const title = element.querySelector('.quick-combo__title, h2');

  // Extract vehicle type labels
  const vehicleLabels = Array.from(element.querySelectorAll('.quick-combo__vehicle-label'));

  // Extract input placeholder and label
  const inputLabel = element.querySelector('.quick-combo__combo-text-label');
  const input = element.querySelector('.quick-combo__combo-entry-text');

  // Extract CTA button
  const ctaButton = element.querySelector('.quick-combo__submit .button__text, .quick-combo__submit');

  // Extract plate preview output
  const plateOutput = element.querySelector('.quick-combo__output-combo');

  // Extract disclaimer
  const disclaimer = element.querySelector('.quick-combo__disclaimer');

  // Extract "See popular plates" link
  const popularLink = element.querySelector('.quick-combo__next-component-cta');

  // Build text content cell (richtext combining title, form description, CTA)
  const textContent = document.createDocumentFragment();

  // Field hint for text
  textContent.appendChild(document.createComment(' field:text '));

  if (title) {
    const h2 = document.createElement('h2');
    h2.textContent = title.textContent.trim();
    textContent.appendChild(h2);
  }

  // Vehicle types as paragraph
  if (vehicleLabels.length > 0) {
    const vehiclePara = document.createElement('p');
    vehiclePara.textContent = vehicleLabels.map((l) => l.textContent.trim()).join(' | ');
    textContent.appendChild(vehiclePara);
  }

  // Input label as paragraph
  if (inputLabel) {
    const labelPara = document.createElement('p');
    labelPara.textContent = inputLabel.textContent.trim();
    textContent.appendChild(labelPara);
  }

  // Plate text as heading (styled with plate font)
  if (plateOutput) {
    const plateHeading = document.createElement('h3');
    plateHeading.textContent = plateOutput.textContent.trim();
    textContent.appendChild(plateHeading);
  }

  // CTA button as link
  if (ctaButton) {
    const ctaPara = document.createElement('p');
    const ctaLink = document.createElement('a');
    ctaLink.href = 'https://www.vplates.com.au/create/select-a-style';
    ctaLink.textContent = ctaButton.textContent.trim() || 'Check availability';
    ctaPara.appendChild(ctaLink);
    textContent.appendChild(ctaPara);
  }

  // Disclaimer
  if (disclaimer) {
    const disclaimerPara = document.createElement('p');
    const em = document.createElement('em');
    em.textContent = disclaimer.textContent.trim();
    disclaimerPara.appendChild(em);
    textContent.appendChild(disclaimerPara);
  }

  // "See popular plates" link
  if (popularLink) {
    const linkPara = document.createElement('p');
    const link = document.createElement('a');
    link.href = popularLink.href || 'https://www.vplates.com.au/browse-styles';
    link.textContent = popularLink.textContent.trim();
    linkPara.appendChild(link);
    textContent.appendChild(linkPara);
  }

  // Build cells: Row 1 = image (empty placeholder), Row 2 = text content
  const cells = [];

  // Row 1: image field (plate preview placeholder image)
  const imgFrag = document.createDocumentFragment();
  imgFrag.appendChild(document.createComment(' field:image '));
  const img = document.createElement('img');
  img.src = 'https://www.vplates.com.au/-/media/project/vicroads/plates/home-carousel-images/business-foreground.svg';
  img.alt = 'Plate preview';
  imgFrag.appendChild(img);
  cells.push([imgFrag]);

  // Row 2: text content
  cells.push([textContent]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-plate-checker', cells });
  element.replaceWith(block);
}
