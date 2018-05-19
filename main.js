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
const Class =
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
// const drawImage =
// Classes
function imageLoader(src) {
  const i = new Image();
  i.src = src;
  return i;
};
function imageLoader(src, count) {
  const obj = {};
  obj.frames = count.times(i => img(`assets/${url}${`${i + 1}`.prefix(0, 4)}.png`));
  obj.frameCount = count;
  obj.i = null;
}
const SpriteLoader = C.class('Sprite', {
  constructor(url, count) {

  },
});
const Location = C.class('Location', {
  constructor(locationName, onDraw = () => undefined) {
    this.image = img(`assets/locations/${locationName}.png`);
    this.onDraw = onDraw;
  },
  draw() {
    ctx.background.clearRect(0, 0, adjustedWidth, adjustedHeight);
    ctx.background.drawImage(this.image, 0, 0, adjustedWidth, adjustedHeight);
    return this.onDraw();
  },
});
const Chara = C.class('Character', {
  constructor(obj) {
    this.foo;
  },
});
const Sound = C.class('Sound Object', {
  constructor(locationName) {
    this.elem = document.createElement('audio');
    this.elem.src = `assets/${locationName}`;
    audioContainer.appendChild(this.elem);
  },
  setTime(n) {
    this.elem.currentTime = n;
  },
  play() {
    return this.elem.play();
  },
  playFromBeginning() {
    this.setTime(0);
    return this.play();
  },
  pause() {
    this.elem.pause();
  },
});
const Music = Sound.extend('Music Object', {
  constructor(locationName) {
    super.constructor(`music/${locationName}`);
  },
});
const SFX = Sound.extend('Sound Effects Object', {
  constructor(locationName) {
    super.constructor(`sfx/sfx-${locationName}.wav`);
  },
});
// Action
ctx.forEach(v => v.imageSmoothingEnabled = false);
// No Anti Aliasing
canvasSize(adjustedWidth, adjustedHeight);
const loc = Object.create(null);
const sound = Object.create(null);
sound.blipFemale = SFX('blipfemale');
loc.courtroomHall = Location('courtroomHall');
const pw = Sprite('characters/phoenix/bird', 21);
