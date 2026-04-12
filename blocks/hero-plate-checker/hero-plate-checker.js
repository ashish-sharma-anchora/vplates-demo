/**
 * Hero Plate Checker block — interactive plate combination checker.
 * The author configures: heading, CTA label/link, popular plates link.
 * The JS builds the entire form UI (vehicle toggle, plate input, preview).
 *
 * Expected authored markup (from UE, 4 rows):
 * Row 1: heading
 * Row 2: cta (button label)
 * Row 3: ctaLink (a href)
 * Row 4: browseLink (a href)
 */
export default function decorate(block) {
  // Extract authored content from block rows
  const rows = [...block.children];
  const getValue = (rowIdx) => {
    const row = rows[rowIdx];
    if (!row) return '';
    const cell = row.querySelector('div:last-child');
    if (!cell) return '';
    const link = cell.querySelector('a');
    if (link) return link.href;
    return cell.textContent.trim();
  };

  const title = getValue(0) || 'Check your combination';
  const ctaLabel = getValue(1) || 'Check availability';
  const ctaLink = getValue(2) || '/create/select-a-style';
  const browseLink = getValue(3) || '/browse-styles';

  // Vehicle type configuration
  const vehicles = [
    {
      id: 'car', label: 'Car', maxLength: 6, placeholder: 'CUSTOM', instructions: 'Enter between 2 and 6 letters/numbers',
    },
    {
      id: 'motorcycle', label: 'Motorbike', maxLength: 5, placeholder: 'MOTO5', instructions: 'Enter between 2 and 5 letters/numbers',
    },
  ];

  let activeVehicle = vehicles[0];

  // Clear block and rebuild
  block.textContent = '';

  // === Create all elements first (before referencing) ===

  // Title
  const titleEl = document.createElement('h2');
  titleEl.classList.add('hero-plate-checker-title');
  titleEl.textContent = title;

  // Plate combo input (visible styled input — matches original markup)
  const plateInput = document.createElement('input');
  plateInput.type = 'text';
  plateInput.spellcheck = false;
  plateInput.maxLength = activeVehicle.maxLength;
  plateInput.placeholder = activeVehicle.placeholder;
  plateInput.classList.add('hero-plate-checker-combo-input');
  plateInput.setAttribute('aria-label', activeVehicle.instructions);

  // Input group elements
  const labelEl = document.createElement('span');
  labelEl.classList.add('hero-plate-checker-label');
  labelEl.textContent = activeVehicle.instructions;

  const counter = document.createElement('span');
  counter.classList.add('hero-plate-checker-counter');
  counter.textContent = `0/${activeVehicle.maxLength}`;

  const inputGroup = document.createElement('div');
  inputGroup.classList.add('hero-plate-checker-input-group');
  inputGroup.appendChild(labelEl);
  inputGroup.appendChild(counter);

  // CTA button
  const ctaBtn = document.createElement('a');
  ctaBtn.href = ctaLink;
  ctaBtn.textContent = ctaLabel;
  ctaBtn.classList.add('hero-plate-checker-cta', 'disabled');

  // Plate visual for preview column
  const plateVisual = document.createElement('div');
  plateVisual.classList.add('hero-plate-checker-plate-visual');
  plateVisual.innerHTML = `
    <div class="plate-frame">
      <div class="plate-header">VIC</div>
      <div class="plate-text-display">${activeVehicle.placeholder}</div>
    </div>
  `;
  const plateTextDisplay = plateVisual.querySelector('.plate-text-display');

  // === Wire up events ===

  // Vehicle type toggle
  const vehicleToggle = document.createElement('div');
  vehicleToggle.classList.add('hero-plate-checker-vehicles');
  vehicles.forEach((v) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = v.label;
    btn.classList.add('hero-plate-checker-vehicle-btn');
    if (v.id === activeVehicle.id) btn.classList.add('active');
    btn.addEventListener('click', () => {
      vehicleToggle.querySelectorAll('.hero-plate-checker-vehicle-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeVehicle = v;
      plateInput.maxLength = v.maxLength;
      plateInput.placeholder = v.placeholder;
      plateInput.value = '';
      labelEl.textContent = v.instructions;
      counter.textContent = `0/${v.maxLength}`;
      plateTextDisplay.textContent = v.placeholder;
    });
    vehicleToggle.appendChild(btn);
  });

  // Plate input event — sync with plate preview and counter
  plateInput.addEventListener('input', () => {
    const val = plateInput.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    plateInput.value = val;
    counter.textContent = `${val.length}/${activeVehicle.maxLength}`;
    plateTextDisplay.textContent = val || activeVehicle.placeholder;
    ctaBtn.classList.toggle('disabled', val.length < 2);
  });

  // Popular plates link
  const popularEl = document.createElement('p');
  popularEl.classList.add('hero-plate-checker-popular');
  const popularA = document.createElement('a');
  popularA.href = browseLink;
  popularA.textContent = 'See popular plates';
  popularEl.appendChild(popularA);

  // Preview disclaimer
  const previewDisclaimer = document.createElement('p');
  previewDisclaimer.classList.add('hero-plate-checker-preview-disclaimer');
  previewDisclaimer.innerHTML = '<span class="info-icon">&#9432;</span> Representation of plates provided are for illustrative purposes only';

  // === Assemble form column ===
  const formCol = document.createElement('div');
  formCol.classList.add('hero-plate-checker-form');
  formCol.appendChild(titleEl);
  formCol.appendChild(vehicleToggle);
  formCol.appendChild(plateInput);
  formCol.appendChild(inputGroup);
  formCol.appendChild(ctaBtn);
  formCol.appendChild(popularEl);

  // === Assemble preview column ===
  const previewCol = document.createElement('div');
  previewCol.classList.add('hero-plate-checker-preview');
  previewCol.appendChild(plateVisual);
  previewCol.appendChild(previewDisclaimer);

  block.appendChild(formCol);
  block.appendChild(previewCol);
}
