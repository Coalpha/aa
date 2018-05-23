// If you want to read this code, this file is NOT where you want to start.
A._annotateFnDefaults.showDescriptors = false;
// remove annoying descriptors
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
const ctx = canven.map(A._.getContext`2d`);
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
// loaders
const load = {};
load.image = (src) => {
  console.log(`Loading image @ ${src}`);
  const i = new Image();
  return new Promise((res, rej) => {
    i.onload = () => {
      console.log(`Loaded image @ ${src}!`);
      res(i);
    };
    i.onerror = () => { throw new Error(`Loading ${src} failed!`); };
    i.src = src;
  });
};
load.audio = (src) => {
  console.log(`Loading audio @ ${src}`);
  const a = new Audio();
  return new Promise((res, rej) => {
    a.onloadeddata = () => {
      console.log(`Loaded audio @ ${src}!`);
      res(a);
    };
    a.onerror = () => { throw new Error(`Loading ${src} failed!`); };
    a.src = src;
    audioContainer.appendChild(a);
  });
};
load.sprite = A.curry((src, count) => Promise.all(count.times(i => load.image(`assets/${src}${`${i + 1}`.prefix(0, 4)}.png`))), 'load.sprite');
load.music = A.pipe(A.add('assets/music/'), load.audio);
load.sfx = src => load.audio(`assets/sfx/${src}.wav`);
load.blip = gender => load.sfx(`sfx-blip${gender}`);
// collections
async function chara(name, sprites, gender) {
  console.log('loading');
  const obj = {
    name,
  };
  console.log(obj);
  const spritePromises = sprites.map((count, src) => load.sprite(`characters/${name}/${src}`, count));
  [obj.sprites, obj.blip] = await Promise.all([spritePromises, load.blip((gender))]);
  return obj;
}
async function main() {
  const phoenix = await chara('phoenix', {
    'phoenix-ohshit': 14,
    'phoenix-document(b)': 21,
  }, 'male');
  console.log(phoenix);
}
// Action
ctx.forEach(v => v.imageSmoothingEnabled = false);
// No Anti Aliasing
canvasSize(adjustedWidth, adjustedHeight);
const loc = Object.create(null);
const sound = Object.create(null);
