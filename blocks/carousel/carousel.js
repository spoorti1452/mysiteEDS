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

    [...slide.children].forEach((div) => {
      if (div.querySelector('picture')) {
        div.className = 'carousel-image';
      } else {
        div.className = 'carousel-content';
      }
    });

    track.append(slide);
  });

  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-btn prev';
  prevBtn.innerHTML = '❮';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-btn next';
  nextBtn.innerHTML = '❯';

  wrapper.append(prevBtn, track, nextBtn);
  block.replaceChildren(wrapper);

  let index = 0;
  const totalSlides = track.children.length;

  function updateCarousel() {
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  nextBtn.addEventListener('click', () => {
    index = (index + 1) % totalSlides;
    updateCarousel();
  });

  prevBtn.addEventListener('click', () => {
    index = (index - 1 + totalSlides) % totalSlides;
    updateCarousel();
  });
}