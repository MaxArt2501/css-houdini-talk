import { RippleButtonElement } from './components/ripple-button.js';

customElements.define('ripple-button', RippleButtonElement);

(async () => {
  CSS.paintWorklet.addModule('./js/worklets/paint/delaunay.js');
  CSS.paintWorklet.addModule('./js/worklets/paint/crossed.js');
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
