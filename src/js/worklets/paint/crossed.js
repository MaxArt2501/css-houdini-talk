const PROPS = [
  '--cross-color',
  'font-size'
];

registerPaint('crossed', class {
  static get inputProperties() {
    return PROPS;
  }

  paint(ctx, { width, height }, props) {
    const color = props.get('--cross-color').toString();
    const size = props.get('font-size').value;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = size / 10;
    ctx.moveTo(0, height / 10);
    ctx.lineTo(width, height);
    ctx.moveTo(width, height / 10);
    ctx.lineTo(0, height);
    ctx.stroke();
    ctx.closePath();
  }
});
