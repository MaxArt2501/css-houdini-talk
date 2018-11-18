export class RippleButtonElement extends HTMLElement {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  connectedCallback() {
    this.addEventListener('click', this.handleClick);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.handleClick);
  }

  handleClick({ clientX, clientY }) {
    const { top, left } = this.getBoundingClientRect();
    const offsetX = clientX - left;
    const offsetY = clientY - top;
    this.attributeStyleMap.set('--ripple-center-x', CSS.number(offsetX));
    this.attributeStyleMap.set('--ripple-center-y', CSS.number(offsetY));
    const duration = this.computedStyleMap().get('--ripple-duration').to('ms').value;
    this.animate([{
      '--ripple-color': 'rgba(255, 255, 255, 0.5)',
      '--ripple-radius': CSS.percent(0)
    }, {
      '--ripple-color': 'rgba(255, 255, 255, 0)',
      '--ripple-radius': CSS.percent(100)
    }],
    { duration });
  }
}
