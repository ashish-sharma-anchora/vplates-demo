/**
 * Tabs Promo Gallery — preserves child DOM for Universal Editor.
 * Each row = one Promo Tab with cells:
 *   [tabLabel, panelColor, panelBody, panelImage]
 *
 * panelBody richtext: Use --- (horizontal rule) to separate
 * left panel content from right-side content.
 * Everything before --- = left colored panel.
 * Everything after --- = right content area with CTA.
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
    const labelCell = cells[0];
    const colorCell = cells[1];
    const bodyCell = cells[2];
    const imageCell = cells[3];

    const tabLabel = labelCell ? labelCell.textContent.trim() : `Tab ${index + 1}`;
    const tabId = `tab-${tabLabel.toLowerCase().replace(/\s+/g, '-')}`;

    // Extract panel color — EDS may convert "#43b02a" to a link <a href="#43b02a">
    let panelColor = '';
    if (colorCell) {
      const link = colorCell.querySelector('a');
      if (link) {
        // EDS converted the hex color to a link — extract from href or text
        const href = link.getAttribute('href') || '';
        const text = link.textContent.trim();
        panelColor = text.startsWith('#') ? text : href;
      } else {
        panelColor = colorCell.textContent.trim();
      }
    }

    // Mark row as tab panel
    row.classList.add('tabs-panel');
    row.setAttribute('role', 'tabpanel');
    row.id = `${tabId}-panel`;
    row.setAttribute('aria-labelledby', `${tabId}-btn`);
    if (index !== 0) row.hidden = true;

    // Hide label and color cells
    if (labelCell) labelCell.classList.add('tabs-cell-hidden');
    if (colorCell) colorCell.classList.add('tabs-cell-hidden');

    // Process body cell — split at <hr> into left and right
    if (bodyCell) {
      const leftDiv = document.createElement('div');
      leftDiv.classList.add('tabs-panel-left');
      const rightDiv = document.createElement('div');
      rightDiv.classList.add('tabs-panel-right');

      let currentTarget = leftDiv;
      [...bodyCell.children].forEach((child) => {
        if (child.tagName === 'HR') {
          currentTarget = rightDiv;
        } else {
          currentTarget.appendChild(child.cloneNode(true));
        }
      });

      // Apply panel color
      if (panelColor) {
        leftDiv.style.backgroundColor = panelColor;
      }

      // Move image into left panel at bottom with absolute positioning
      if (imageCell) {
        const pic = imageCell.querySelector('picture');
        if (pic) {
          const imgWrapper = document.createElement('div');
          imgWrapper.classList.add('tabs-panel-plate-image');
          imgWrapper.appendChild(pic.cloneNode(true));
          leftDiv.appendChild(imgWrapper);
        }
        imageCell.classList.add('tabs-cell-hidden');
      }

      // Replace body cell content
      bodyCell.textContent = '';
      bodyCell.classList.add('tabs-panel-body');

      // Add watermark title
      const watermark = document.createElement('span');
      watermark.classList.add('tabs-panel-watermark');
      watermark.textContent = tabLabel;
      bodyCell.appendChild(watermark);

      bodyCell.appendChild(leftDiv);
      bodyCell.appendChild(rightDiv);
    }

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
