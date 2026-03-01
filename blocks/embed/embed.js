export default function decorate(block) {
  const link = block.querySelector('a');
  if (!link) return;

  let url = link.href;

  // Convert YouTube watch URL to embed URL automatically
  if (url.includes('youtube.com/watch')) {
    const videoId = new URL(url).searchParams.get('v');
    url = `https://www.youtube.com/embed/${videoId}`;
  }

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