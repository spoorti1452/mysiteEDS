export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'hero-wrapper';

  [...block.children].forEach((row) => {
    if (!row.textContent.trim()) return;

    const div = document.createElement('div');
    div.className = 'hero-content';

    const text = row.textContent.trim();

    // Simple detection
    if (row.querySelector('img')) {
      const img = row.querySelector('img');
      div.className = 'hero-image';
      div.append(img);
    } else if (text.toLowerCase().includes('→')) {
      const link = document.createElement('a');
      const parts = text.split('→');
      link.href = parts[1].trim();
      link.textContent = parts[0].trim();
      link.className = 'hero-cta';
      div.append(link);
    } else if (!wrapper.querySelector('.hero-title')) {
      const h1 = document.createElement('h1');
      h1.className = 'hero-title';
      h1.textContent = text;
      div.append(h1);
    } else {
      const p = document.createElement('p');
      p.className = 'hero-subtitle';
      p.textContent = text;
      div.append(p);
    }

    wrapper.append(div);
  });

  block.innerHTML = '';
  block.append(wrapper);
}