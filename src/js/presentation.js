(async () => {
  CSS.paintWorklet.addModule('./js/worklets/paint/delaunay.js');
  CSS.paintWorklet.addModule('./js/worklets/paint/crossed.js');
})();
