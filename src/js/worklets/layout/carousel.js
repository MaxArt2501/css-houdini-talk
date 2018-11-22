class CarouselLayout {
  static inputProperties = [ '--carousel-index' ];

  *intrinsicSizes() {}
  *layout(children, edges, constraints, styleMap) {
    let index = styleMap.get('--carousel-index').value % children.length;
    if (index < 0) index += children.length;
    const intIndex = Math.floor(index);

    const childFragments = yield children.map(child => child.layoutNextFragment());

    const autoBlockSize = Math.max(...childFragments.map(({ blockSize }) => blockSize));

    const currentFragment = childFragments[intIndex];
    const nextFragment = childFragments[(intIndex + 1) % children.length];
    let inlineSizeSum = 0;
    const inlineStarts = childFragments.map(({ inlineSize }) => {
      const start = inlineSizeSum;
      inlineSizeSum += inlineSize;
      return start;
    });
    const inlinePosition = childFragments.slice(0, intIndex).reduce((sum, { inlineSize }) => sum + inlineSize, 0)
      + currentFragment.inlineSize / 2
      + (currentFragment.inlineSize + nextFragment.inlineSize) * (index - intIndex) / 2;

    const differences = childFragments.map(({ inlineSize }, i) => {
      let offset = 0;
      if (i < intIndex) {
        offset = -inlineStarts[i] - inlineSize;
      } else if (i > intIndex) {
        offset = inlineSizeSum - inlineStarts[i];
      }
      return Math.abs(inlineSizeSum - (inlinePosition + offset) * 2);
    });
    const bestDifference = Math.min(...differences);
    const bestIndex = differences.indexOf(bestDifference);

    childFragments.forEach((fragment, i) => {
      fragment.blockOffset = (autoBlockSize - fragment.blockSize) / 2;
      let shift = 0;
      if (bestIndex < intIndex && i <= bestIndex) {
        shift = inlineSizeSum;
      } else if (bestIndex > intIndex && i >= bestIndex) {
        shift = -inlineSizeSum;
      }
      fragment.inlineOffset = constraints.fixedInlineSize / 2 + inlineStarts[i] - inlinePosition + shift;
    });

    return { childFragments, autoBlockSize };
  }
}

registerLayout('carousel', CarouselLayout);
