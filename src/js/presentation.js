(async () => {
  await CSS.paintWorklet.addModule('./js/worklets/paint/delaunay.js');
})();
