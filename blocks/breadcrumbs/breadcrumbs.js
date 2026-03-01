export default function decorate(block) {
  const path = window.location.pathname.split('/').filter(Boolean);

  const nav = document.createElement('nav');
  nav.className = 'breadcrumbs-nav';

  const ul = document.createElement('ul');

  let fullPath = '';

  path.forEach((segment, index) => {
    fullPath += `/${segment}`;

    const li = document.createElement('li');

    const link = document.createElement('a');
    link.href = fullPath;
    link.textContent = segment.replace(/-/g, ' ');

    if (index === path.length - 1) {
      link.classList.add('active');
    }

    li.appendChild(link);
    ul.appendChild(li);
  });

  nav.appendChild(ul);
  block.appendChild(nav);
}