export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const imageRow = rows[0];
  const textRow = rows[1];

  // Build hero structure
  block.textContent = '';
  block.classList.add('hero-plate-checker');

  // Create two-column layout: left (form) + right (plate preview)
  const formCol = document.createElement('div');
  formCol.classList.add('hero-plate-checker-form');

  const previewCol = document.createElement('div');
  previewCol.classList.add('hero-plate-checker-preview');

  // Extract text content elements
  const textDiv = textRow.querySelector('div');
  const elements = textDiv ? [...textDiv.children] : [];

  // Title (h2)
  const title = elements.find((el) => el.tagName === 'H2');
  if (title) {
    title.classList.add('hero-plate-checker-title');
    formCol.appendChild(title);
  }

  // Vehicle type toggle
  const vehiclePara = elements.find((el) => el.tagName === 'P' && el.textContent.includes('|'));
  if (vehiclePara) {
    const vehicleToggle = document.createElement('div');
    vehicleToggle.classList.add('hero-plate-checker-vehicles');
    const types = vehiclePara.textContent.split('|').map((t) => t.trim());
    types.forEach((type, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = type;
      btn.classList.add('hero-plate-checker-vehicle-btn');
      if (i === 0) btn.classList.add('active');
      btn.addEventListener('click', () => {
        vehicleToggle.querySelectorAll('.hero-plate-checker-vehicle-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
      vehicleToggle.appendChild(btn);
    });
    formCol.appendChild(vehicleToggle);
  }

  // Input label
  const labelPara = elements.find((el) => el.tagName === 'P' && el.textContent.includes('Enter between'));
  if (labelPara) {
    const inputGroup = document.createElement('div');
    inputGroup.classList.add('hero-plate-checker-input-group');

    const plateInput = document.createElement('input');
    plateInput.type = 'text';
    plateInput.maxLength = 6;
    plateInput.placeholder = 'CUSTOM';
    plateInput.classList.add('hero-plate-checker-input');
    plateInput.setAttribute('aria-label', labelPara.textContent.trim());

    const counter = document.createElement('span');
    counter.classList.add('hero-plate-checker-counter');
    counter.textContent = '0/6';

    const labelEl = document.createElement('p');
    labelEl.classList.add('hero-plate-checker-label');
    labelEl.textContent = labelPara.textContent.trim();

    // Plate display (large text)
    const plateDisplay = document.createElement('div');
    plateDisplay.classList.add('hero-plate-checker-plate-text');
    plateDisplay.textContent = 'CUSTOM';

    plateInput.addEventListener('input', () => {
      const val = plateInput.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      plateInput.value = val;
      counter.textContent = `${val.length}/6`;
      plateDisplay.textContent = val || 'CUSTOM';
    });

    inputGroup.appendChild(labelEl);
    inputGroup.appendChild(counter);
    formCol.appendChild(inputGroup);
    formCol.appendChild(plateDisplay);
  }

  // CTA button (Check availability)
  const ctaPara = elements.find((el) => el.tagName === 'P' && el.querySelector('a[href*="select-a-style"]'));
  if (ctaPara) {
    const link = ctaPara.querySelector('a');
    const ctaBtn = document.createElement('a');
    ctaBtn.href = link.href;
    ctaBtn.textContent = link.textContent;
    ctaBtn.classList.add('hero-plate-checker-cta', 'button', 'ghost');
    formCol.appendChild(ctaBtn);
  }

  // Disclaimer
  const disclaimerPara = elements.find((el) => el.querySelector('em'));
  if (disclaimerPara) {
    disclaimerPara.classList.add('hero-plate-checker-disclaimer');
    formCol.appendChild(disclaimerPara);
  }

  // "See popular plates" link
  const popularPara = elements.find((el) => el.tagName === 'P' && el.querySelector('a[href*="browse-styles"]'));
  if (popularPara && popularPara !== ctaPara) {
    popularPara.classList.add('hero-plate-checker-popular');
    formCol.appendChild(popularPara);
  }

  // Plate preview image (right column)
  const imageDiv = imageRow.querySelector('div');
  if (imageDiv) {
    const img = imageDiv.querySelector('img');
    if (img) {
      img.classList.add('hero-plate-checker-preview-img');
      previewCol.appendChild(img);
    }
  }

  block.appendChild(formCol);
  block.appendChild(previewCol);
}
