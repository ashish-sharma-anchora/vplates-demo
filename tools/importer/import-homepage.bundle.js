var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-plate-checker.js
  function parse(element, { document }) {
    const title = element.querySelector(".quick-combo__title, h2");
    const vehicleLabels = Array.from(element.querySelectorAll(".quick-combo__vehicle-label"));
    const inputLabel = element.querySelector(".quick-combo__combo-text-label");
    const input = element.querySelector(".quick-combo__combo-entry-text");
    const ctaButton = element.querySelector(".quick-combo__submit .button__text, .quick-combo__submit");
    const plateOutput = element.querySelector(".quick-combo__output-combo");
    const disclaimer = element.querySelector(".quick-combo__disclaimer");
    const popularLink = element.querySelector(".quick-combo__next-component-cta");
    const textContent = document.createDocumentFragment();
    textContent.appendChild(document.createComment(" field:text "));
    if (title) {
      const h2 = document.createElement("h2");
      h2.textContent = title.textContent.trim();
      textContent.appendChild(h2);
    }
    if (vehicleLabels.length > 0) {
      const vehiclePara = document.createElement("p");
      vehiclePara.textContent = vehicleLabels.map((l) => l.textContent.trim()).join(" | ");
      textContent.appendChild(vehiclePara);
    }
    if (inputLabel) {
      const labelPara = document.createElement("p");
      labelPara.textContent = inputLabel.textContent.trim();
      textContent.appendChild(labelPara);
    }
    if (plateOutput) {
      const plateHeading = document.createElement("h3");
      plateHeading.textContent = plateOutput.textContent.trim();
      textContent.appendChild(plateHeading);
    }
    if (ctaButton) {
      const ctaPara = document.createElement("p");
      const ctaLink = document.createElement("a");
      ctaLink.href = "https://www.vplates.com.au/create/select-a-style";
      ctaLink.textContent = ctaButton.textContent.trim() || "Check availability";
      ctaPara.appendChild(ctaLink);
      textContent.appendChild(ctaPara);
    }
    if (disclaimer) {
      const disclaimerPara = document.createElement("p");
      const em = document.createElement("em");
      em.textContent = disclaimer.textContent.trim();
      disclaimerPara.appendChild(em);
      textContent.appendChild(disclaimerPara);
    }
    if (popularLink) {
      const linkPara = document.createElement("p");
      const link = document.createElement("a");
      link.href = popularLink.href || "https://www.vplates.com.au/browse-styles";
      link.textContent = popularLink.textContent.trim();
      linkPara.appendChild(link);
      textContent.appendChild(linkPara);
    }
    const cells = [];
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(" field:image "));
    const img = document.createElement("img");
    img.src = "https://www.vplates.com.au/-/media/project/vicroads/plates/home-carousel-images/business-foreground.svg";
    img.alt = "Plate preview";
    imgFrag.appendChild(img);
    cells.push([imgFrag]);
    cells.push([textContent]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-plate-checker", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-cta-tiles.js
  function parse2(element, { document }) {
    const tiles = Array.from(element.querySelectorAll(".cta-tiles__item"));
    const cells = [];
    const row = [];
    for (const tile of tiles) {
      const link = tile.querySelector("a");
      const titleEl = tile.querySelector(".cta-tiles__title, .field-title");
      const subtitleEl = tile.querySelector(".cta-tiles__description, .field-subtitle");
      const cellContent = document.createDocumentFragment();
      if (titleEl) {
        const h3 = document.createElement("h3");
        h3.textContent = titleEl.textContent.trim();
        cellContent.appendChild(h3);
      }
      if (subtitleEl) {
        const p = document.createElement("p");
        p.textContent = subtitleEl.textContent.trim();
        cellContent.appendChild(p);
      }
      if (link) {
        const linkPara = document.createElement("p");
        const a = document.createElement("a");
        a.href = link.href || "#";
        a.textContent = titleEl ? titleEl.textContent.trim() : "Learn more";
        linkPara.appendChild(a);
        cellContent.appendChild(linkPara);
      }
      row.push(cellContent);
    }
    if (row.length > 0) {
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-cta-tiles", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-promo-gallery.js
  function parse3(element, { document }) {
    const tabButtons = Array.from(element.querySelectorAll(".promo-gallery__tab-nav-btn"));
    const tabPanels = Array.from(element.querySelectorAll(".promo-tabs__promo-item"));
    const cells = [];
    for (let i = 0; i < tabButtons.length; i++) {
      const tabLabel = tabButtons[i].textContent.trim();
      const panel = tabPanels[i];
      if (!panel) continue;
      const carouselItems = Array.from(panel.querySelectorAll(".carousel-item"));
      const contentFrag = document.createDocumentFragment();
      for (const item of carouselItems) {
        const panelTitle = item.querySelector(".carousel-item__panel-title, h4, h3");
        const panelText = item.querySelector(".carousel-item__panel-text, .carousel-item__panel-foreground p");
        const panelImage = item.querySelector(".carousel-item__panel-image:not(.carousel-item__panel-image--dummy)");
        const panelBgImage = item.querySelector(".carousel-item__panel-background-image");
        const contentText = item.querySelector(".carousel-item__content-text p");
        const ctaLink = item.querySelector(".carousel-item__content-cta");
        if (panelTitle) {
          const h4 = document.createElement("h4");
          h4.textContent = panelTitle.textContent.trim();
          contentFrag.appendChild(h4);
        }
        if (panelText) {
          const p = document.createElement("p");
          p.textContent = panelText.textContent.trim();
          contentFrag.appendChild(p);
        }
        if (panelImage) {
          const img = document.createElement("img");
          const src = panelImage.getAttribute("data-src") || panelImage.src;
          if (src && !src.startsWith("data:")) {
            img.src = src.startsWith("/") ? "https://www.vplates.com.au" + src : src;
            img.alt = panelImage.alt || "Plate style preview";
            contentFrag.appendChild(img);
          }
        } else if (panelBgImage) {
          const img = document.createElement("img");
          const src = panelBgImage.getAttribute("data-src") || panelBgImage.src;
          if (src && !src.startsWith("data:")) {
            img.src = src.startsWith("/") ? "https://www.vplates.com.au" + src : src;
            img.alt = panelBgImage.alt || "Background";
            contentFrag.appendChild(img);
          }
        }
        if (contentText) {
          const p = document.createElement("p");
          p.textContent = contentText.textContent.trim();
          contentFrag.appendChild(p);
        }
        if (ctaLink) {
          const p = document.createElement("p");
          const a = document.createElement("a");
          a.href = ctaLink.href || "#";
          a.textContent = ctaLink.textContent.trim();
          p.appendChild(a);
          contentFrag.appendChild(p);
        }
        if (carouselItems.indexOf(item) < carouselItems.length - 1) {
          contentFrag.appendChild(document.createElement("hr"));
        }
      }
      const labelFrag = document.createDocumentFragment();
      const labelEl = document.createElement("p");
      labelEl.textContent = tabLabel;
      labelFrag.appendChild(labelEl);
      cells.push([labelFrag, contentFrag]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-promo-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed-social.js
  function parse4(element, { document }) {
    const heading = element.querySelector(".instagram__title, h2");
    const iframe = element.querySelector(".instagram__holder iframe, .snapwidget-widget");
    const cells = [];
    const headingFrag = document.createDocumentFragment();
    headingFrag.appendChild(document.createComment(" field:heading "));
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      headingFrag.appendChild(h2);
    }
    cells.push([headingFrag]);
    const embedFrag = document.createDocumentFragment();
    embedFrag.appendChild(document.createComment(" field:source "));
    if (iframe) {
      const src = iframe.src || iframe.getAttribute("data-src") || "";
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = src || "https://snapwidget.com/embed/715844";
      a.textContent = a.href;
      p.appendChild(a);
      embedFrag.appendChild(p);
    }
    cells.push([embedFrag]);
    const block = WebImporter.Blocks.createBlock(document, { name: "embed-social", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/vplates-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#lightningjs-usabilla_live",
        ".loading__panel",
        ".error-bar",
        "#give-freely-root"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#_CRSFform",
        'input[name="_SiteVirtualFolder"]',
        'input[name="_SiteRootPath"]',
        'input[name="_SiteStartPath"]',
        'input[name="_SiteContentStartPath"]'
      ]);
      if (element.style && element.style.overflow === "hidden") {
        element.style.overflow = "scroll";
      }
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header.header",
        "footer.footer",
        ".flyout-nav",
        "#header-main-search",
        ".footer__back-to-top"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "noscript",
        "link",
        'iframe[src*="googletagmanager"]',
        ".visuallyhidden"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("data-endpoint");
        el.removeAttribute("data-recommendations-endpoint");
        el.removeAttribute("data-recommendations-paging");
        el.removeAttribute("data-recommendations-maximum");
        el.removeAttribute("data-collection");
        el.removeAttribute("data-results-page");
        el.removeAttribute("data-suggestion-endpoint");
        el.removeAttribute("onclick");
      });
    }
  }

  // tools/importer/transformers/vplates-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const reversedSections = [...sections].reverse();
      for (const section of reversedSections) {
        const selector = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selector) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        const isFirst = sections.indexOf(section) === 0;
        if (!isFirst) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-plate-checker": parse,
    "columns-cta-tiles": parse2,
    "tabs-promo-gallery": parse3,
    "embed-social": parse4
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "VPlates homepage with plate checker hero, CTA tiles, promo gallery tabs, and Instagram social feed",
    urls: [
      "https://www.vplates.com.au/"
    ],
    blocks: [
      {
        name: "hero-plate-checker",
        instances: ["section#quick-check-combo.quick-combo"]
      },
      {
        name: "columns-cta-tiles",
        instances: [".cta-tiles__list"]
      },
      {
        name: "tabs-promo-gallery",
        instances: [".promo-gallery"]
      },
      {
        name: "embed-social",
        instances: [".instagram"]
      }
    ],
    sections: [
      {
        id: "section-2-hero",
        name: "Plate Checker Hero",
        selector: "section#quick-check-combo",
        style: "black",
        blocks: ["hero-plate-checker"],
        defaultContent: []
      },
      {
        id: "section-3-cta-tiles",
        name: "CTA Tiles",
        selector: ".component.Tiles.List",
        style: null,
        blocks: ["columns-cta-tiles"],
        defaultContent: []
      },
      {
        id: "section-4-promo-tabs",
        name: "Promo Gallery Tabs",
        selector: ".promo-gallery",
        style: null,
        blocks: ["tabs-promo-gallery"],
        defaultContent: []
      },
      {
        id: "section-5-instagram",
        name: "Instagram Feed",
        selector: ".instagram",
        style: null,
        blocks: ["embed-social"],
        defaultContent: [".instagram__title"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
