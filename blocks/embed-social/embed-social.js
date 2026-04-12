export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  block.textContent = '';

  // Row 1: heading
  const headingRow = rows[0];
  const heading = headingRow.querySelector('h2');
  if (heading) {
    heading.classList.add('embed-social-title');
    block.appendChild(heading);
  }

  // Row 2: embed source URL
  const sourceRow = rows[1];
  const link = sourceRow.querySelector('a');
  if (link) {
    const embedContainer = document.createElement('div');
    embedContainer.classList.add('embed-social-container');

    const iframe = document.createElement('iframe');
    iframe.src = link.href;
    iframe.classList.add('embed-social-iframe');
    iframe.setAttribute('allowtransparency', 'true');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('loading', 'lazy');
    iframe.title = 'Social media feed';

    embedContainer.appendChild(iframe);
    block.appendChild(embedContainer);
  }
}
