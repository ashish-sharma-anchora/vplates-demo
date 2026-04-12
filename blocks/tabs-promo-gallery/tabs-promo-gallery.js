/**
 * Tabs Promo Gallery — preserves child DOM for Universal Editor.
 * Each row = one Promo Tab with 4 cells (after field grouping):
 *   Cell 0: config (grouped: config_label + config_color)
 *   Cell 1: panel (richtext — left panel content)
 *   Cell 2: image (plate image reference)
 *   Cell 3: content (richtext — right side content + CTA)
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // Build tab navigation
  const tabNav = document.createElement('div');
  tabNav.classList.add('tabs-nav');
  tabNav.setAttribute('role', 'tablist');
  tabNav.setAttribute('aria-label', 'Promoted products');

  rows.forEach((row, index) => {
    const cells = [...row.children];
    // Cell 0: config (label + color grouped), Cell 1: panel, Cell 2: image, Cell 3: content
    const configCell = cells[0];
    const panelCell = cells[1];
    const imageCell = cells[2];
    const contentCell = cells[3];

    // Extract label and color from config cell
    // Config cell contains two values — label text and color hex
    let tabLabel = `Tab ${index + 1}`;
    let panelColor = '';
    if (configCell) {
      const texts = [];
      configCell.querySelectorAll('p, span, div').forEach((el) => {
        const t = el.textContent.trim();
        if (t) texts.push(t);
      });
      // Also check for links (EDS converts #hex to links)
      const link = configCell.querySelector('a');
      if (link) {
        const linkText = link.textContent.trim();
        if (linkText.startsWith('#')) {
          panelColor = linkText;
        }
      }
      // First non-color text is the label
      if (texts.length > 0) {
        const nonColorTexts = texts.filter((t) => !t.startsWith('#'));
        const colorTexts = texts.filter((t) => t.startsWith('#'));
        if (nonColorTexts.length > 0) [tabLabel] = nonColorTexts;
        if (colorTexts.length > 0 && !panelColor) [panelColor] = colorTexts;
      }
      // Fallback: if configCell has plain text
      if (tabLabel === `Tab ${index + 1}`) {
        const plainText = configCell.textContent.trim();
        if (plainText) {
          // Try to split by line breaks or by # character
          const parts = plainText.split(/\n|(?=#)/).map((p) => p.trim()).filter(Boolean);
          parts.forEach((p) => {
            if (p.startsWith('#') && !panelColor) panelColor = p;
            else if (!tabLabel || tabLabel === `Tab ${index + 1}`) tabLabel = p;
          });
        }
      }
    }

    const tabId = `tab-${tabLabel.toLowerCase().replace(/\s+/g, '-')}`;

    // Mark row as tab panel
    row.classList.add('tabs-panel');
    row.setAttribute('role', 'tabpanel');
    row.id = `${tabId}-panel`;
    row.setAttribute('aria-labelledby', `${tabId}-btn`);
    if (index !== 0) row.hidden = true;

    // Hide config cell
    if (configCell) configCell.classList.add('tabs-cell-hidden');

    // Style panel cell (left)
    if (panelCell) {
      panelCell.classList.add('tabs-panel-left');
      if (panelColor) {
        panelCell.style.backgroundColor = panelColor;
      }
    }

    // Move image into panel cell at bottom
    if (imageCell && panelCell) {
      const pic = imageCell.querySelector('picture');
      if (pic) {
        const imgWrapper = document.createElement('div');
        imgWrapper.classList.add('tabs-panel-plate-image');
        imgWrapper.appendChild(pic.cloneNode(true));
        panelCell.appendChild(imgWrapper);
      }
      imageCell.classList.add('tabs-cell-hidden');
    }

    // Style content cell (right)
    if (contentCell) {
      contentCell.classList.add('tabs-panel-right');
    }

    // Add watermark title to the row
    const watermark = document.createElement('span');
    watermark.classList.add('tabs-panel-watermark');
    watermark.textContent = tabLabel;
    row.appendChild(watermark);

    // Create tab button
    const tabBtn = document.createElement('button');
    tabBtn.type = 'button';
    tabBtn.role = 'tab';
    tabBtn.id = `${tabId}-btn`;
    tabBtn.textContent = tabLabel;
    tabBtn.setAttribute('aria-controls', `${tabId}-panel`);
    tabBtn.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    tabBtn.classList.add('tabs-nav-btn');
    if (index === 0) tabBtn.classList.add('active');
    tabBtn.tabIndex = index === 0 ? 0 : -1;
    tabNav.appendChild(tabBtn);
  });

  // Tab switching
  tabNav.addEventListener('click', (e) => {
    const btn = e.target.closest('.tabs-nav-btn');
    if (!btn) return;

    tabNav.querySelectorAll('.tabs-nav-btn').forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
      b.tabIndex = -1;
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    btn.tabIndex = 0;

    const panelId = btn.getAttribute('aria-controls');
    rows.forEach((row) => {
      row.hidden = row.id !== panelId;
    });
  });

  // Keyboard navigation
  tabNav.addEventListener('keydown', (e) => {
    const tabs = [...tabNav.querySelectorAll('.tabs-nav-btn')];
    const currentIdx = tabs.indexOf(document.activeElement);
    let newIdx;

    if (e.key === 'ArrowRight') newIdx = (currentIdx + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') newIdx = (currentIdx - 1 + tabs.length) % tabs.length;
    else return;

    tabs[newIdx].click();
    tabs[newIdx].focus();
  });

  block.prepend(tabNav);
}
