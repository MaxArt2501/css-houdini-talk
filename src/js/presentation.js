import { RippleButtonElement } from './components/ripple-button.js';

customElements.define('ripple-button', RippleButtonElement);

const deck = document.querySelector('p-deck');

(() => {
  CSS.paintWorklet.addModule('./js/worklets/paint/delaunay.js');
  CSS.paintWorklet.addModule('./js/worklets/paint/crossed.js');
})();

(() => {
  CSS.paintWorklet.addModule('./js/worklets/paint/ripple.js');

  CSS.registerProperty({
    name: '--ripple-color',
    syntax: '<color>',
    initialValue: 'rgba(255, 255, 255, 0.5)',
    inherits: false
  });
  CSS.registerProperty({
    name: '--ripple-center-x',
    syntax: '<number>',
    initialValue: 0,
    inherits: false
  });
  CSS.registerProperty({
    name: '--ripple-center-y',
    syntax: '<number>',
    initialValue: 0,
    inherits: false
  });
  CSS.registerProperty({
    name: '--ripple-radius',
    syntax: '<percentage>',
    initialValue: '0%',
    inherits: false
  });
  CSS.registerProperty({
    name: '--ripple-duration',
    syntax: '<time>',
    initialValue: '1s',
    inherits: false
  });
})();

(async () => {
  CSS.registerProperty({
    name: '--carousel-index',
    syntax: '<number>',
    initialValue: 0,
    inherits: false
  });
  const images = Array.from({ length: 5 }, (_, i) => {
    const image = new Image();
    image.src = `img/${i + 1}.jpg`;
    return image;
  });
  await Promise.all([
    ...images.map(image => image.decode()),
    CSS.layoutWorklet.addModule('./js/worklets/layout/carousel.js')
  ]);
  const carousel = document.querySelector('.carousel');
  images.forEach(image => carousel.appendChild(image));
  const fontSize = carousel.computedStyleMap().get('font-size').value;
  const scale = fontSize / 48;
  carousel.parentElement.style.transform = `scale(${scale})`;
  carousel.style.display = 'layout(carousel)';
  let currentIndex = carousel.computedStyleMap().get('--carousel-index').value;
  document.querySelector('.carousel-previous').addEventListener('click', () => {
    currentIndex--;
    carousel.attributeStyleMap.set('--carousel-index', CSS.number(currentIndex));
  });
  document.querySelector('.carousel-next').addEventListener('click', () => {
    currentIndex++;
    carousel.attributeStyleMap.set('--carousel-index', CSS.number(currentIndex));
  });
})();
