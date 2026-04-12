/**
 * Tabs Promo Gallery — flat items grouped into tabs with carousel.
 *
 * Each child row = one Promo Card with 4 cells (after field grouping):
 *   Cell 0: config (grouped: config_group + config_color)
 *   Cell 1: panel (richtext — left panel heading + description)
 *   Cell 2: image (plate image reference)
 *   Cell 3: content (richtext — right side description + CTA)
 *
 * JS groups items by config_group to build tabs dynamically.
 * Groups with 2+ items get carousel prev/next controls.
 */

function parseConfigCell(cell) {
  let group = '';
  let color = '';
  if (!cell) return { group, color };

  // EDS may convert #hex to a link — check for links first
  const link = cell.querySelector('a');
  if (link) {
    const linkText = link.textContent.trim();
    if (linkText.startsWith('#')) color = linkText;
  }

  // Collect all text nodes / paragraphs
  const texts = [];
  cell.querySelectorAll('p, span, div').forEach((el) => {
    const t = el.textContent.trim();
    if (t) texts.push(t);
  });

  // Fallback: plain text content
  if (texts.length === 0) {
    const plain = cell.textContent.trim();
    if (plain) {
      plain.split(/\n|(?=#)/).map((p) => p.trim()).filter(Boolean).forEach((p) => texts.push(p));
    }
  }

  // Separate group name from color
  texts.forEach((t) => {
    if (t.startsWith('#') && !color) color = t;
    else if (!group) group = t;
  });

  return { group: group || 'Default', color };
}

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // Parse all rows and group by tab name
  const groups = new Map(); // preserves insertion order
  const cardData = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    const configCell = cells[0];
    const panelCell = cells[1];
    const imageCell = cells[2];
    const contentCell = cells[3];

    const { group, color } = parseConfigCell(configCell);

    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(row);

    cardData.push({
      row, group, color, configCell, panelCell, imageCell, contentCell,
    });

    // Hide config cell
    if (configCell) configCell.classList.add('tabs-cell-hidden');
  });

  // Build tab navigation
  const tabNav = document.createElement('div');
  tabNav.classList.add('tabs-nav');
  tabNav.setAttribute('role', 'tablist');
  tabNav.setAttribute('aria-label', 'Promoted products');

  const tabPanels = [];
  let tabIndex = 0;

  groups.forEach((groupRows, groupName) => {
    const tabId = `tab-${groupName.toLowerCase().replace(/\s+/g, '-')}`;
    const isFirst = tabIndex === 0;

    // Create tab button
    const tabBtn = document.createElement('button');
    tabBtn.type = 'button';
    tabBtn.role = 'tab';
    tabBtn.id = `${tabId}-btn`;
    tabBtn.textContent = groupName;
    tabBtn.setAttribute('aria-controls', `${tabId}-panel`);
    tabBtn.setAttribute('aria-selected', isFirst ? 'true' : 'false');
    tabBtn.classList.add('tabs-nav-btn');
    if (isFirst) tabBtn.classList.add('active');
    tabBtn.tabIndex = isFirst ? 0 : -1;
    tabNav.appendChild(tabBtn);

    // Create tab panel container
    const panel = document.createElement('div');
    panel.classList.add('tabs-panel');
    panel.setAttribute('role', 'tabpanel');
    panel.id = `${tabId}-panel`;
    panel.setAttribute('aria-labelledby', `${tabId}-btn`);
    if (!isFirst) panel.hidden = true;

    // Watermark
    const watermark = document.createElement('span');
    watermark.classList.add('tabs-panel-watermark');
    watermark.textContent = groupName;
    panel.appendChild(watermark);

    // Carousel container
    const carousel = document.createElement('div');
    carousel.classList.add('tabs-carousel');

    // Add each card to the carousel
    groupRows.forEach((row, cardIdx) => {
      const data = cardData.find((d) => d.row === row);
      const card = document.createElement('div');
      card.classList.add('tabs-card');
      if (cardIdx > 0) card.classList.add('tabs-card-hidden');

      // Left panel
      if (data.panelCell) {
        data.panelCell.classList.add('tabs-panel-left');
        if (data.color) data.panelCell.style.backgroundColor = data.color;

        // Move image into left panel
        if (data.imageCell) {
          const pic = data.imageCell.querySelector('picture');
          if (pic) {
            const imgWrapper = document.createElement('div');
            imgWrapper.classList.add('tabs-panel-plate-image');
            imgWrapper.appendChild(pic.cloneNode(true));
            data.panelCell.appendChild(imgWrapper);
          }
          data.imageCell.classList.add('tabs-cell-hidden');
        }

        card.appendChild(data.panelCell);
      }

      // Right content
      if (data.contentCell) {
        data.contentCell.classList.add('tabs-panel-right');
        card.appendChild(data.contentCell);
      }

      carousel.appendChild(card);
    });

    panel.appendChild(carousel);

    // Carousel controls (only if 2+ items in this group)
    if (groupRows.length > 1) {
      const controls = document.createElement('div');
      controls.classList.add('tabs-carousel-controls');

      const prevBtn = document.createElement('button');
      prevBtn.type = 'button';
      prevBtn.classList.add('tabs-carousel-prev');
      prevBtn.innerHTML = '&#8592;';
      prevBtn.setAttribute('aria-label', 'Previous item');

      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.classList.add('tabs-carousel-next');
      nextBtn.innerHTML = '&#8594;';
      nextBtn.setAttribute('aria-label', 'Next item');

      let currentCard = 0;
      const cards = carousel.querySelectorAll('.tabs-card');

      const showCard = (idx) => {
        cards.forEach((c, i) => c.classList.toggle('tabs-card-hidden', i !== idx));
        currentCard = idx;
      };

      prevBtn.addEventListener('click', () => {
        showCard(currentCard > 0 ? currentCard - 1 : cards.length - 1);
      });
      nextBtn.addEventListener('click', () => {
        showCard(currentCard < cards.length - 1 ? currentCard + 1 : 0);
      });

      controls.appendChild(prevBtn);
      controls.appendChild(nextBtn);
      panel.appendChild(controls);
    }

    tabPanels.push(panel);
    tabIndex += 1;
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
    tabPanels.forEach((p) => { p.hidden = p.id !== panelId; });
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

  // Rebuild block: nav + panels (replaces old row-based DOM)
  block.textContent = '';
  block.appendChild(tabNav);
  tabPanels.forEach((p) => block.appendChild(p));
}
