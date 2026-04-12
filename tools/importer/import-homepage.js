/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroPlateCheckerParser from './parsers/hero-plate-checker.js';
import columnsCtaTilesParser from './parsers/columns-cta-tiles.js';
import tabsPromoGalleryParser from './parsers/tabs-promo-gallery.js';
import embedSocialParser from './parsers/embed-social.js';

// TRANSFORMER IMPORTS
import vplatesCleanupTransformer from './transformers/vplates-cleanup.js';
import vplatesSectionsTransformer from './transformers/vplates-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-plate-checker': heroPlateCheckerParser,
  'columns-cta-tiles': columnsCtaTilesParser,
  'tabs-promo-gallery': tabsPromoGalleryParser,
  'embed-social': embedSocialParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'VPlates homepage with plate checker hero, CTA tiles, promo gallery tabs, and Instagram social feed',
  urls: [
    'https://www.vplates.com.au/',
  ],
  blocks: [
    {
      name: 'hero-plate-checker',
      instances: ['section#quick-check-combo.quick-combo'],
    },
    {
      name: 'columns-cta-tiles',
      instances: ['.cta-tiles__list'],
    },
    {
      name: 'tabs-promo-gallery',
      instances: ['.promo-gallery'],
    },
    {
      name: 'embed-social',
      instances: ['.instagram'],
    },
  ],
  sections: [
    {
      id: 'section-2-hero',
      name: 'Plate Checker Hero',
      selector: 'section#quick-check-combo',
      style: 'black',
      blocks: ['hero-plate-checker'],
      defaultContent: [],
    },
    {
      id: 'section-3-cta-tiles',
      name: 'CTA Tiles',
      selector: '.component.Tiles.List',
      style: null,
      blocks: ['columns-cta-tiles'],
      defaultContent: [],
    },
    {
      id: 'section-4-promo-tabs',
      name: 'Promo Gallery Tabs',
      selector: '.promo-gallery',
      style: null,
      blocks: ['tabs-promo-gallery'],
      defaultContent: [],
    },
    {
      id: 'section-5-instagram',
      name: 'Instagram Feed',
      selector: '.instagram',
      style: null,
      blocks: ['embed-social'],
      defaultContent: ['.instagram__title'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  vplatesCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [vplatesSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
