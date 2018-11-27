import { ANIMATION_PERIOD } from '../common.js';

const LIMIT = 2147483647;
const COPRIME = 16807;

registerAnimator('random', class {
  constructor(options = {}) {
    let { seed } = { seed: Math.floor(Math.random() * LIMIT), ...options };
    seed = seed % LIMIT;
    if (seed <= 0) {
      seed += LIMIT - 1;
    }

    // Simple PRNG
    function next() {
      seed = seed * COPRIME % LIMIT;
      return seed / (LIMIT - 1);
    }

    const numPoints = Math.floor(next() * 7) + 1;
    this.points = Array.from({ length: numPoints }, () => next())
      .sort((a, b) => a - b)
      .map(x => [ x, next() ])

    // Ensure the first point is at the start of the period
    const firstPoint = this.points[0];
    if (firstPoint[0] > .025) {
      this.points.unshift([ 0, next() ]);
    } else {
      firstPoint[0] = 0;
    }

    // Ensure the last point is at the end of the period
    const lastPoint = this.points[numPoints - 1];
    if (lastPoint[0] < .975) {
      this.points.push([ 1, next() ]);
    } else {
      lastPoint[0] = 1;
    }
  }

  animate(currentTime, effect) {
    if (!this.startTime && !isNaN(currentTime)) {
      this.startTime = currentTime;
    }
    const periodTime = (currentTime - this.startTime) % ANIMATION_PERIOD;
    const x = periodTime / ANIMATION_PERIOD;
    const intervalIndex = this.points.findIndex(([ xi ]) => xi > x);
    const [ x0, y0 ] = this.points[intervalIndex - 1];
    const [ x1, y1 ] = this.points[intervalIndex];
    const y = y0 + (x - x0) * (y1 - y0) / (x1 - x0);
    effect.localTime = y * ANIMATION_PERIOD;
  }
});
