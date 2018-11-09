import { getOptionObject } from "../common.js";
import Delaunator from '../../../vendor/delaunator/index.js';

const PROPS = [
  '--delaunay-point-area',
  '--delaunay-max-opacity',
  '--delaunay-line-color',
  '--delaunay-line-width'
];

function generatePoints({ width, height }, { pointArea }) {
  const area = width * height;
  const length = Math.floor(area / pointArea);
  return Array.from({ length }, () => [
    Math.random() * width,
    Math.random() * height
  ]);
}

function generateBorderPoints({ width, height }, { pointArea }) {
  const perimeter = (width + height) * 2;
  const linearWidth = pointArea ** .5 / 2;
  const length = Math.floor(perimeter / linearWidth);
  return [
    [0, 0],
    [width, 0],
    [width, height],
    [0, height],
    ...Array.from({ length }, () => {
      const position = Math.random() * perimeter;
      if (position < width) return [position, 0];
      if (position < width + height) {
        return [width, position - width];
      }
      if (position < width * 2 + height) {
        return [width * 2 + height - position, height];
      }
      return [0, perimeter - position];
    })
  ];
}

function getMedianAngle(a, b, c) {
  const m = [
    (b[0] + c[0]) / 2,
    (b[1] + c[1]) / 2
  ];
  return Math.atan2(a[1] - m[1], a[0] - m[0]);
}

registerPaint('delaunay', class {
  static get inputProperties() {
    return PROPS;
  }

  paint(ctx, geometry, props) {
    this.options = {
      pointArea: 25000,
      maxOpacity: .5,
      lineColor: 'transparent',
      lineWidth: 0,
      ...getOptionObject(props, 'delaunay')
    };
    const points = [
      ...generatePoints(geometry, this.options),
      ...generateBorderPoints(geometry, this.options)
    ];
    const { triangles } = Delaunator.from(points);
    this.drawTriangles(ctx, points, triangles);
  }

  drawTriangles(ctx, points, triangles) {
    ctx.lineJoin = 'round';
    ctx.lineWidth = +this.options.lineWidth;
    ctx.strokeStyle = this.options.lineColor;
    ctx.globalAlpha = this.options.maxOpacity;
    for (let i = 0; i < triangles.length; i += 3) {
      const a = points[triangles[i]];
      const b = points[triangles[i + 1]];
      const c = points[triangles[i + 2]];
      const angle = getMedianAngle(a, b, c);
      const opacity = (angle < 0 ? angle + Math.PI * 2 : angle) / Math.PI / 2;
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.beginPath();
      ctx.moveTo(...a);
      ctx.lineTo(...b);
      ctx.lineTo(...c);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    }
  }
});
