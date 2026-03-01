export default function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row) => {
    const title = row.children[0];
    const content = row.children[1];

    const button = document.createElement('button');
    button.className = 'accordion-title';
    button.innerHTML = title.innerHTML;

    const body = document.createElement('div');
    body.className = 'accordion-content';
    body.innerHTML = content.innerHTML;
    body.style.display = 'none';

    button.addEventListener('click', () => {
      const isOpen = body.style.display === 'block';
      body.style.display = isOpen ? 'none' : 'block';
    });

    row.innerHTML = '';
    row.append(button, body);
  });
}