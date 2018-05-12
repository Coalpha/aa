// If you want to read this code, this file is NOT where you want to start.
// I'm using a few custom "libaries"
const dswidth = 256;
const dsheight = 192;
const sizeMultiplier = 2;
const canven = {
  background: document.getElementById('background'),
  midground: document.getElementById('midground'),
  foreground: document.getElementById('foreground'),
  fiveground: document.getElementById('fiveground'),
};
const ctx = canven.map(_.getContext`2d`);

// No Anti Aliasing
let currentFillStyle = '#000000';
const setFillStyle = C.curry((to) => {
  if (to !== currentFillStyle) {
    ctx.fillStyle = to;
    currentFillStyle = to;
  }
});
const canvasSize = C.curry((width, height) => {
  canven.forEach((v, k) => {
    v.style.width = ctx[k].width = `${width}px`;
    v.style.height = ctx[k].height = `${height}px`;
  });
});

// Classes
const Sprite = C.class('Sprite', {
  constructor(imageArray) {
    this.v = v;
  },
});

// Action
ctx.forEach(v => v.imageSmoothingEnabled = false);
canvasSize.width(dswidth * sizeMultiplier).height(dsheight * sizeMultiplier);
