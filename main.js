// If you want to read this code, this file is NOT where you want to start.
// This file does it's best to separate data and code
// Mixing data and code leads to bad stuff
// Centralizing functions that operate with data is the best way to do it
A._annotateFnDefaults.showDescriptors = false;
// remove annoying descriptors
const dswidth = 256;
const dsheight = 192;
const sizeMultiplier = 2;
const adjustedWidth = dswidth * sizeMultiplier;
const adjustedHeight = dsheight * sizeMultiplier;
const container = document.getElementById('container');
const audioContainer = document.getElementById('audio');
const canvenIds = {
  footground: 0,
  background: 0,
  midground: 0,
  foreground: 0,
  fiveground: 0,
};
const canven = canvenIds.map((v, k) => document.getElementById(k));
const ctx = canven.map(A._.getContext`2d`);
ctx.forEach(v => v.imageSmoothingEnabled = false);
// No Blurry Pictures. Just pixelated ones.
const ctxAnimations = ctx.map((v, k) => ({
  ctx: v,
  element: v.canvas,
  name: k,
  maxAnimations: 1,
  frameBuffer: [],
  running: 0,
}));

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
  canven.forEach((v) => {
    v.width = width;
    v.height = height;
    v.style.width = px;
    v.style.height = py;
  });
};
canvasSize(adjustedWidth, adjustedHeight);
// Set the size

// loaders
const load = {};
load.image = (src) => {
  // console.log(`Loading image @ ${src}`);
  const i = new Image();
  return new Promise((res, rej) => {
    i.onload = () => {
      // console.log(`Loaded image @ ${src}!`);
      res(i);
    };
    i.onerror = () => { throw new Error(`Loading ${src} failed!`); };
    i.src = src;
  });
};
load.audio = (src) => {
  // console.log(`Loading audio @ ${src}`);
  const a = new Audio();
  return new Promise((res, rej) => {
    a.onloadeddata = () => {
      // console.log(`Loaded audio @ ${src}!`);
      res(a);
    };
    a.onerror = () => { throw new Error(`Loading ${src} failed!`); };
    a.src = src;
    audioContainer.appendChild(a);
  });
};
load.sprite = async (dir, src, count) => {
  const frames = await Promise.all(count.times(i => load.image(`assets/${dir}/${src}${`${i + 1}`.prefix(0, 4)}.png`)));
  return { src, frames };
};
load.music = A.pipe(A.add('assets/music/'), load.audio);
load.sfx = src => load.audio(`assets/sfx/${src}.wav`);
load.blip = gender => load.sfx(`sfx-blip${gender}`);
// collections
async function chara(name, sprites, gender) {
  const obj = {
    name,
    sprites: {},
  };
  const spritePromises = sprites.mapKeys((k, i) => load.sprite(`characters/${name}/`, k, sprites[k]));
  const blipPromise = load.blip(gender);
  (await Promise.all(spritePromises)).forEach(o => obj.sprites[o.src] = o.frames);
  obj.blip = await blipPromise;
  return obj;
}
async function main() {
  const phoenix = await chara('phoenix', {
    'phoenix-ohshit': 14,
    'phoenix-document(b)': 24,
  }, 'male');
  render.animate('background', phoenix.sprites['phoenix-document(b)'], {
    repeat: false,
    times: 2,
  });
}
// renderers
const render = {};
render.full = (ctx, img) => {
};
render.pauseAnimation = (ctxAnimationObject) => {
  if (ctxAnimationObject.running) {
    clearInterval(ctxAnimationObject.interval);
  }
};
render.clearAnimation = (ctxAnimationObject) => {
  render.pauseAnimation(ctxAnimationObject);
  ctxAnimationObject.frameBuffer = [];
};
render.clearCanvas = (ctxAnimationObject) => {
  const { width, height } = ctxAnimationObject.element;
  ctxAnimationObject.ctx.clearRect(0, 0, width, height);
};
render.animate = (ctxName, frames, options) => {
  const o = Object.assign({}, render.animate.defaults, options);
  const c = {
    frame: 0,
    times: 0,
  };
  // counter
  const ctxAnimationObject = ctxAnimations[ctxName];
  render.clearAnimation(ctxAnimationObject);
  ctxAnimationObject.frameBuffer = frames;
  ctxAnimationObject.interval = setInterval(() => {
    if (c.frame === frames.length) {
      // if it's beyond the amount of frames
      if (o.repeat || ++c.times !== o.times) {
        o.repeatCallback(c.times, o.times, o.repeat);
        c.frame = 0;
      } else {
        o.finalCallback(c.times, o.times, o.repeat);
        render.pauseAnimation(ctxAnimationObject);
        return null;
      }
    }
    // console.log(`${c.times}:${c.frame}`);
    const currentFrame = frames[c.frame];
    render.clearCanvas(ctxAnimationObject);
    ctxAnimationObject.ctx.drawImage(currentFrame, ...o.drawArgs);
    if (!o.frameCallback(c.frame++, c.times, o.times, o.repeat)) {
      render.pauseAnimation(ctxAnimationObject);
    }
  }, 100);
  ctxAnimationObject.running = true;
};
render.animate.defaults = {
  repeat: true,
  times: 1,
  frameCallback: () => 1,
  repeatCallback: () => 1,
  finalCallback: () => 1,
  drawArgs: [0, 0],
};
