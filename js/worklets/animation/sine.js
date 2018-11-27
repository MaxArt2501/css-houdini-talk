import { ANIMATION_PERIOD } from '../common.js';

registerAnimator('sine', class {
  animate(currentTime, effect) {
    if (!this.startTime && !isNaN(currentTime)) {
      this.startTime = currentTime;
    }
    effect.localTime = Math.sin(((currentTime - this.startTime) % ANIMATION_PERIOD) * Math.PI / ANIMATION_PERIOD) * ANIMATION_PERIOD;
  }
});
