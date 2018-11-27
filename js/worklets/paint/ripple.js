registerPaint('ripple', class {
  static get inputProperties() {
    return [
      '--ripple-color',
      '--ripple-radius',
      '--ripple-center-x',
      '--ripple-center-y'
    ];
  }
  paint(ctx, { width, height }, props) {
    const color = props.get('--ripple-color');
    const radius = props.get('--ripple-radius');
    const centerX = props.get('--ripple-center-x');
    const centerY = props.get('--ripple-center-y');
    const farthest = (Math.max(centerX, width - centerX) ** 2
      + Math.max(centerY, height - centerY) ** 2) ** .5;
    ctx.fillStyle = color;
    ctx.arc(centerX.value, centerY.value, radius.value * farthest / 100, 0, Math.PI * 2);
    ctx.fill();
  }
});
