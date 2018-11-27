import { RippleButtonElement } from './components/ripple-button.js';
import { ANIMATION_PERIOD } from './worklets/common.js';

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

(async () => {
  CSS.registerProperty({
    name: '--axis-x',
    syntax: '<number>',
    initialValue: 0,
    inherits: false
  });
  CSS.registerProperty({
    name: '--axis-y',
    syntax: '<number>',
    initialValue: 0,
    inherits: false
  });

  function getAxisXEffect(effectName) {
    return new KeyframeEffect(
      document.querySelector(`[effect="${effectName}"] > .ball`),
      [{ '--axis-x': CSS.number(0) }, { '--axis-x': CSS.number(1) }],
      { duration: ANIMATION_PERIOD, iterations: Infinity }
    );
  }
  function getAxisYEffect(effectName) {
    return new KeyframeEffect(
      document.querySelector(`[effect="${effectName}"] > .ball`),
      [{ '--axis-y': CSS.number(0) }, { '--axis-y': CSS.number(1) }],
      { duration: ANIMATION_PERIOD, iterations: Infinity }
    )
  }

  await Promise.all([ 'sine', 'bounce', 'random', 'passthrough' ]
    .map(animatorName => CSS.animationWorklet.addModule(`./js/worklets/animation/${animatorName}.js`))
  )

  const sineAnimation = new WorkletAnimation(
    'sine',
    getAxisYEffect('sine')
  );
  sineAnimation.play();
  new Animation(getAxisXEffect('sine')).play();

  const bounceAnimation = new WorkletAnimation(
    'bounce',
    getAxisYEffect('bounce')
  );
  bounceAnimation.play();
  new Animation(getAxisXEffect('bounce')).play();

  const projectileAnimation = new WorkletAnimation(
    'bounce',
    getAxisYEffect('projectile'),
    document.timeline,
    { bounces: .75 }
  );
  projectileAnimation.play();
  new Animation(getAxisXEffect('projectile')).play();

  const randomAnimation = new WorkletAnimation(
    'random',
    getAxisYEffect('random'),
    document.timeline,
    { seed: 123456 }
  );
  randomAnimation.play();
  new Animation(getAxisXEffect('random')).play();

  const timeline = new ScrollTimeline({
    scrollSource: document.querySelector('.reading-marker-wrapper'),
    orientation: 'vertical',
    timeRange: 1000
  });
  new WorkletAnimation(
    'passthrough',
    new KeyframeEffect(
      document.querySelector('.reading-marker'),
      [
        { width: CSS.percent(0) },
        { width: CSS.percent(100) }
      ],
      { duration: 1000 }
    ),
    timeline
  ).play();
})();
