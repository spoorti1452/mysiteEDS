export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Containers
  const tabsWrapper = document.createElement('div');
  tabsWrapper.className = 'tabs-wrapper';

  const tabButtons = document.createElement('div');
  tabButtons.className = 'tab-buttons';
  tabButtons.setAttribute('role', 'tablist');

  const tabContents = document.createElement('div');
  tabContents.className = 'tab-contents';

  // Give the block a stable id for ARIA
  if (!block.id) block.id = `tabs-${Math.random().toString(36).slice(2, 8)}`;

  const buttons = [];
  const panels = [];

  rows.forEach((row, index) => {
    // Find title (prefer a heading)
    let titleNode =
      row.querySelector('h1, h2, h3, h4, h5, h6') ||
      row.firstElementChild ||
      row;

    const titleText = (titleNode?.textContent || `Tab ${index + 1}`).trim();

    // Button
    const btn = document.createElement('button');
    btn.className = 'tab-btn';
    btn.type = 'button';
    btn.id = `${block.id}-tab-${index}`;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    btn.setAttribute('aria-controls', `${block.id}-panel-${index}`);
    btn.tabIndex = index === 0 ? 0 : -1;
    btn.textContent = titleText;
    tabButtons.append(btn);
    buttons.push(btn);

    // Panel
    const panel = document.createElement('div');
    panel.className = 'tab-content';
    panel.id = `${block.id}-panel-${index}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', btn.id);
    panel.hidden = index !== 0;

    // Remove the title node from content if it belongs to this row
    if (titleNode && titleNode.parentElement === row) {
      titleNode.remove();
    }

    // Move remaining content into panel
    while (row.firstChild) panel.appendChild(row.firstChild);

    tabContents.append(panel);
    panels.push(panel);
    row.remove();

    // Click handler
    btn.addEventListener('click', () => activate(index));
  });

  // Keyboard nav
  tabButtons.addEventListener('keydown', (e) => {
    const current = buttons.findIndex((b) => b.getAttribute('aria-selected') === 'true');
    const lastIdx = buttons.length - 1;
    let next = current;

    switch (e.key) {
      case 'ArrowRight':
      case 'Right':
        next = current === lastIdx ? 0 : current + 1;
        break;
      case 'ArrowLeft':
      case 'Left':
        next = current === 0 ? lastIdx : current - 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = lastIdx;
        break;
      default:
        return;
    }
    e.preventDefault();
    activate(next);
    buttons[next].focus();
  });

  function activate(idx) {
    buttons.forEach((b, i) => {
      const active = i === idx;
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
      b.tabIndex = active ? 0 : -1;
    });
    panels.forEach((p, i) => {
      p.hidden = i !== idx;
    });
  }

  tabsWrapper.append(tabButtons, tabContents);
  block.textContent = '';
  block.append(tabsWrapper);
}