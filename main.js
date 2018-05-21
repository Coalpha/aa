// If you want to read this code, this file is NOT where you want to start.
// I'm using a few custom "libaries"
const dswidth = 256;
const dsheight = 192;
const sizeMultiplier = 2;
const adjustedWidth = dswidth * sizeMultiplier;
const adjustedHeight = dsheight * sizeMultiplier;
const container = document.getElementById('container');
const audioContainer = document.getElementById('audio');
const canven = {
  background: document.getElementById('background'),
  midground: document.getElementById('midground'),
  foreground: document.getElementById('foreground'),
  fiveground: document.getElementById('fiveground'),
};
const ctx = canven.map(_.getContext`2d`);
let currentFillStyle = '#000000';
const setFillStyle = (context, color) => {
  if (color !== currentFillStyle) {
    context.fillStyle = color;
    currentFillStyle = color;
  }
};
const canvasSize = (width, height) => {
  const px = `${width}px`;
  const py = `${height}px`;
  container.style.width = px;
  container.style.height = py;
  canven.forEach((v, k) => {
    v.width = width;
    v.height = height;
    v.style.width = px;
    v.style.height = py;
  });
};
// Loaders
function imageLoader(src) {
  const i = new Image();
  i.src = src;
  return new Promise((res, rej) => {
    i.onload = () => res(i);
    i.onerror = () => rej(new Error(`Image: loading ${src} failed!`));
  });
}
function spriteLoader(src, count) {
  return Promise.all(count.times(i => imageLoader(`assets/${src}${`${i + 1}`.prefix(0, 4)}.png`)));
}
function audioLoader(src) {
  const e = new Audio();
  e.src = src;
  return new Promise((res, rej) => {
    e.onload = () => res(e);
    e.onerror = () => rej(new Error(`Audio: loading ${src} failed!`));
  });
}
async function main() {
  const a = spriteLoader('characters/phoenix/phoenix-ohshit', 14);
  const b = spriteLoader('characters/phoenix/phoenix-document(b)', 21);
  const [sprites, sprites2] = await Promise.all([a, b]);
  sprites.concat(sprites2).map(v => document.body.appendChild(v));
}
// Action
ctx.forEach(v => v.imageSmoothingEnabled = false);
// No Anti Aliasing
canvasSize(adjustedWidth, adjustedHeight);
const loc = Object.create(null);
const sound = Object.create(null);
