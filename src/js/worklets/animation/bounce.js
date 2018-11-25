import { ANIMATION_PERIOD } from '../common.js';

const defaults = {
  factor: .5,
  bounces: 5
};

registerAnimator('bounce', class {
  constructor(options = {}) {
    const { factor, bounces } = { ...defaults, ...options };
    Object.assign(this, { factor, bounces });
  }

  animate(currentTime, effect) {
    if (!this.startTime && !isNaN(currentTime)) {
      this.startTime = currentTime;
    }
    const periodTime = (currentTime - this.startTime) % ANIMATION_PERIOD;
    const bounceIndex = Math.floor(periodTime * this.bounces / ANIMATION_PERIOD);
    const bounceFactor = this.factor ** bounceIndex;
    const bouncePeriod = ANIMATION_PERIOD / this.bounces;
    const x = (periodTime % bouncePeriod) / bouncePeriod;
    const y = 4 * (x - x * x);
    effect.localTime = y * bounceFactor * ANIMATION_PERIOD;
  }
});
