export default function decorate(block) {
  const link = block.querySelector('a');
  if (!link) return;

  const url = link.href;

  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.width = '100%';
  iframe.height = '500';
  iframe.style.border = '0';
  iframe.allowFullscreen = true;
  iframe.loading = 'lazy';

  block.textContent = '';
  block.append(iframe);
}