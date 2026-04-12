/**
 * Tabs Promo Gallery — preserves child DOM for Universal Editor.
 * Each row = one Promo Tab with cells: [tabLabel, panelColor, panelBody, contentBody].
 * JS adds tab navigation and decorates the two-column panel layout.
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
    // Cells: 0=tabLabel, 1=panelColor, 2=panelBody (left panel), 3=contentBody (right)
    const labelCell = cells[0];
    const colorCell = cells[1];
    const panelCell = cells[2];
    const contentCell = cells[3];

    const tabLabel = labelCell ? labelCell.textContent.trim() : `Tab ${index + 1}`;
    const panelColor = colorCell ? colorCell.textContent.trim() : '';
    const tabId = `tab-${tabLabel.toLowerCase().replace(/\s+/g, '-')}`;

    // Mark row as tab panel
    row.classList.add('tabs-panel');
    row.setAttribute('role', 'tabpanel');
    row.id = `${tabId}-panel`;
    row.setAttribute('aria-labelledby', `${tabId}-btn`);
    if (index !== 0) row.hidden = true;

    // Mark cells with roles
    if (labelCell) labelCell.classList.add('tabs-panel-label');
    if (colorCell) colorCell.classList.add('tabs-panel-color');
    if (panelCell) {
      panelCell.classList.add('tabs-panel-left');
      // Apply background color from authored value
      if (panelColor) {
        panelCell.style.backgroundColor = panelColor;
        panelCell.style.color = '#fff';
      }
    }
    if (contentCell) contentCell.classList.add('tabs-panel-right');

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

  // Insert tab nav before rows
  block.prepend(tabNav);
}
