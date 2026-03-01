export default function decorate(block) {
  const slides = [...block.children];

  const wrapper = document.createElement('div');
  wrapper.className = 'carousel-wrapper';

  const track = document.createElement('div');
  track.className = 'carousel-track';

  slides.forEach((row) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';

    while (row.firstElementChild) {
      slide.append(row.firstElementChild);
    }

    track.append(slide);
  });

  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-btn prev';
  prevBtn.textContent = '‹';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-btn next';
  nextBtn.textContent = '›';

  wrapper.append(prevBtn, track, nextBtn);
  block.replaceChildren(wrapper);

  let currentIndex = 0;

  function updateSlide() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlide();
  });

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlide();
  });
}