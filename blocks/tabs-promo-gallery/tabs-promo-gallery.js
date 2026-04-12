export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  block.textContent = '';

  // Build tab navigation
  const tabNav = document.createElement('div');
  tabNav.classList.add('tabs-nav');
  tabNav.setAttribute('role', 'tablist');
  tabNav.setAttribute('aria-label', 'Promoted products');

  // Build tab panels container
  const tabPanels = document.createElement('div');
  tabPanels.classList.add('tabs-panels');

  rows.forEach((row, index) => {
    const cols = [...row.children];
    if (cols.length < 2) return;

    const tabLabel = cols[0].textContent.trim();
    const tabContent = cols[1];
    const tabId = `tab-${tabLabel.toLowerCase().replace(/\s+/g, '-')}`;

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

    // Create tab panel
    const panel = document.createElement('div');
    panel.role = 'tabpanel';
    panel.id = `${tabId}-panel`;
    panel.setAttribute('aria-labelledby', `${tabId}-btn`);
    panel.classList.add('tabs-panel');
    if (index !== 0) panel.hidden = true;

    // Parse carousel items (separated by <hr>)
    const items = [];
    let currentItem = document.createElement('div');
    currentItem.classList.add('carousel-item');

    [...tabContent.children].forEach((child) => {
      if (child.tagName === 'HR') {
        if (currentItem.children.length > 0) {
          items.push(currentItem);
          currentItem = document.createElement('div');
          currentItem.classList.add('carousel-item');
        }
      } else {
        currentItem.appendChild(child.cloneNode(true));
      }
    });
    if (currentItem.children.length > 0) items.push(currentItem);

    // Build carousel
    const carousel = document.createElement('div');
    carousel.classList.add('promo-carousel');

    const carouselList = document.createElement('div');
    carouselList.classList.add('promo-carousel-list');
    items.forEach((item, i) => {
      if (i > 0) item.classList.add('hidden');
      carouselList.appendChild(item);
    });
    carousel.appendChild(carouselList);

    // Carousel controls (only if multiple items)
    if (items.length > 1) {
      const controls = document.createElement('div');
      controls.classList.add('promo-carousel-controls');

      const prevBtn = document.createElement('button');
      prevBtn.type = 'button';
      prevBtn.classList.add('promo-carousel-prev');
      prevBtn.innerHTML = '<span aria-hidden="true">&larr;</span><span class="sr-only">Previous</span>';

      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.classList.add('promo-carousel-next');
      nextBtn.innerHTML = '<span aria-hidden="true">&rarr;</span><span class="sr-only">Next</span>';

      let currentIndex = 0;

      const showItem = (idx) => {
        items.forEach((item, i) => {
          item.classList.toggle('hidden', i !== idx);
        });
        currentIndex = idx;
      };

      prevBtn.addEventListener('click', () => {
        const newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        showItem(newIndex);
      });

      nextBtn.addEventListener('click', () => {
        const newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        showItem(newIndex);
      });

      controls.appendChild(prevBtn);
      controls.appendChild(nextBtn);
      carousel.appendChild(controls);
    }

    panel.appendChild(carousel);
    tabPanels.appendChild(panel);
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
    tabPanels.querySelectorAll('.tabs-panel').forEach((p) => {
      p.hidden = p.id !== panelId;
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

  block.appendChild(tabNav);
  block.appendChild(tabPanels);
}
