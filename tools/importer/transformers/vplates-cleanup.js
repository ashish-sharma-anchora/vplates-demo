/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: VPlates cleanup.
 * Removes non-authorable content from Sitecore/Vue.js source pages.
 * Selectors from captured DOM at https://www.vplates.com.au/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove cookie/consent banners, overlays, loading panels
    WebImporter.DOMUtils.remove(element, [
      '#lightningjs-usabilla_live',
      '.loading__panel',
      '.error-bar',
      '#give-freely-root',
    ]);

    // Remove Sitecore hidden inputs and CSRF form
    WebImporter.DOMUtils.remove(element, [
      '#_CRSFform',
      'input[name="_SiteVirtualFolder"]',
      'input[name="_SiteRootPath"]',
      'input[name="_SiteStartPath"]',
      'input[name="_SiteContentStartPath"]',
    ]);

    // Remove overflow:hidden that may block parsing
    if (element.style && element.style.overflow === 'hidden') {
      element.style.overflow = 'scroll';
    }
  }

  if (hookName === H.after) {
    // Remove non-authorable site chrome (header, footer, nav flyout, search)
    WebImporter.DOMUtils.remove(element, [
      'header.header',
      'footer.footer',
      '.flyout-nav',
      '#header-main-search',
      '.footer__back-to-top',
    ]);

    // Remove remaining non-content elements
    WebImporter.DOMUtils.remove(element, [
      'noscript',
      'link',
      'iframe[src*="googletagmanager"]',
      '.visuallyhidden',
    ]);

    // Clean up tracking and Vue.js attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('data-endpoint');
      el.removeAttribute('data-recommendations-endpoint');
      el.removeAttribute('data-recommendations-paging');
      el.removeAttribute('data-recommendations-maximum');
      el.removeAttribute('data-collection');
      el.removeAttribute('data-results-page');
      el.removeAttribute('data-suggestion-endpoint');
      el.removeAttribute('onclick');
    });
  }
}
