/**
 * Tabs Promo Gallery — flat items grouped into tabs with carousel.
 * PRESERVES original child DOM for Universal Editor compatibility.
 *
 * Each child row = one Promo Card with 4 cells (after field grouping):
 *   Cell 0: config (grouped: config_group + config_color)
 *   Cell 1: panel (richtext — left panel heading + description)
 *   Cell 2: image (plate image reference)
 *   Cell 3: content (richtext — right side description + CTA)
 *
 * JS groups items by config_group to build tabs.
 * Groups with 2+ items get carousel prev/next controls.
 * Original rows are decorated in place — NOT moved or destroyed.
 */

function parseConfigCell(cell) {
  let group = '';
  let color = '';
  if (!cell) return { group, color };

  const link = cell.querySelector('a');
  if (link) {
    const linkText = link.textContent.trim();
    if (linkText.startsWith('#')) color = linkText;
  }

  const texts = [];
  cell.querySelectorAll('p, span, div').forEach((el) => {
    const t = el.textContent.trim();
    if (t) texts.push(t);
  });

  if (texts.length === 0) {
    const plain = cell.textContent.trim();
    if (plain) {
      plain.split(/\n|(?=#)/).map((p) => p.trim()).filter(Boolean).forEach((p) => texts.push(p));
    }
  }

  texts.forEach((t) => {
    if (t.startsWith('#') && !color) color = t;
    else if (!group) group = t;
  });

  return { group: group || 'Default', color };
}

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // Parse rows and group by tab name
  const groups = new Map();
  const rowMeta = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    const { group, color } = parseConfigCell(cells[0]);

    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(row);

    rowMeta.push({ row, group, color });

    // Hide config cell, style panel and content cells
    if (cells[0]) cells[0].classList.add('tabs-cell-hidden');
    if (cells[1]) {
      cells[1].classList.add('tabs-panel-left');
      if (color) cells[1].style.backgroundColor = color;

      // Move image into left panel bottom
      if (cells[2]) {
        const pic = cells[2].querySelector('picture');
        if (pic) {
          const imgWrapper = document.createElement('div');
          imgWrapper.classList.add('tabs-panel-plate-image');
          imgWrapper.appendChild(pic.cloneNode(true));
          cells[1].appendChild(imgWrapper);
        }
        cells[2].classList.add('tabs-cell-hidden');
      }
    }
    if (cells[3]) cells[3].classList.add('tabs-panel-right');

    // Each row is a card — style it
    row.classList.add('tabs-card');
  });

  // Build tab nav
  const tabNav = document.createElement('div');
  tabNav.classList.add('tabs-nav');
  tabNav.setAttribute('role', 'tablist');
  tabNav.setAttribute('aria-label', 'Promoted products');

  let isFirstGroup = true;

  groups.forEach((groupRows, groupName) => {
    const tabId = `tab-${groupName.toLowerCase().replace(/\s+/g, '-')}`;

    // Tab button
    const tabBtn = document.createElement('button');
    tabBtn.type = 'button';
    tabBtn.role = 'tab';
    tabBtn.id = `${tabId}-btn`;
    tabBtn.textContent = groupName;
    tabBtn.setAttribute('aria-controls', `${tabId}-panel`);
    tabBtn.setAttribute('aria-selected', isFirstGroup ? 'true' : 'false');
    tabBtn.classList.add('tabs-nav-btn');
    if (isFirstGroup) tabBtn.classList.add('active');
    tabBtn.tabIndex = isFirstGroup ? 0 : -1;
    tabBtn.dataset.group = groupName;
    tabNav.appendChild(tabBtn);

    // Mark rows for this group
    groupRows.forEach((row, cardIdx) => {
      row.dataset.group = groupName;
      // Hide non-first groups, hide non-first cards within a group
      if (!isFirstGroup || cardIdx > 0) row.classList.add('tabs-card-hidden');
    });

    // Add carousel controls if 2+ cards
    if (groupRows.length > 1) {
      const controls = document.createElement('div');
      controls.classList.add('tabs-carousel-controls');
      controls.dataset.group = groupName;
      if (!isFirstGroup) controls.classList.add('tabs-card-hidden');

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

      const showCard = (idx) => {
        groupRows.forEach((r, i) => r.classList.toggle('tabs-card-hidden', i !== idx));
        currentCard = idx;
      };

      prevBtn.addEventListener('click', () => {
        showCard(currentCard > 0 ? currentCard - 1 : groupRows.length - 1);
      });
      nextBtn.addEventListener('click', () => {
        showCard(currentCard < groupRows.length - 1 ? currentCard + 1 : 0);
      });

      controls.appendChild(prevBtn);
      controls.appendChild(nextBtn);

      // Insert controls after the last row of this group
      const lastRow = groupRows[groupRows.length - 1];
      lastRow.after(controls);
    }

    // Add watermark after tab nav (before first row of group)
    const watermark = document.createElement('span');
    watermark.classList.add('tabs-panel-watermark');
    watermark.dataset.group = groupName;
    watermark.textContent = groupName;
    if (!isFirstGroup) watermark.classList.add('tabs-card-hidden');
    groupRows[0].before(watermark);

    isFirstGroup = false;
  });

  // Tab switching — show/hide rows and controls by group
  tabNav.addEventListener('click', (e) => {
    const btn = e.target.closest('.tabs-nav-btn');
    if (!btn) return;
    const activeGroup = btn.dataset.group;

    tabNav.querySelectorAll('.tabs-nav-btn').forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
      b.tabIndex = -1;
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    btn.tabIndex = 0;

    // Show/hide cards, watermarks, and carousel controls by group
    block.querySelectorAll('.tabs-card, .tabs-panel-watermark, .tabs-carousel-controls').forEach((el) => {
      if (el.dataset.group === activeGroup) {
        el.classList.remove('tabs-card-hidden');
      } else {
        el.classList.add('tabs-card-hidden');
      }
    });

    // For the active group, show only the first card (reset carousel)
    const activeRows = groups.get(activeGroup);
    if (activeRows) {
      activeRows.forEach((r, i) => {
        if (i > 0) r.classList.add('tabs-card-hidden');
        else r.classList.remove('tabs-card-hidden');
      });
    }
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

  // Prepend tab nav — don't destroy any existing DOM
  block.prepend(tabNav);
}
