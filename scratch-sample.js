const sharp = require('sharp');

const files = [
  'public/media/halogrip图片/other/untitled.226.png',
  'public/media/halogrip图片/05/concept-1-screen-pedal.jpg',
  'public/media/halogrip图片/05/concept-2-pullout-wheel.jpg',
  'public/media/halogrip图片/05/concept-3-modular-device.jpg',
  'public/media/halogrip图片/05/concept-4a-touchscreen.jpg',
  'public/media/halogrip图片/05/concept-4b-hud-joystick.jpg',
  'public/media/halogrip图片/other/sketches.webp',
  'public/media/halogrip图片/other/id-one.webp',
  'public/media/halogrip图片/other/id-two.webp',
  'public/media/halogrip图片/other/hud.webp',
  'public/media/halogrip图片/other/product-front.webp',
  'public/media/halogrip图片/other/product-detail.webp',
];

async function sampleCorner(file) {
  try {
    const meta = await sharp(file).metadata();
    const w = meta.width, h = meta.height;
    const corners = {
      TL: {left:0, top:0},
      TR: {left: w-10, top:0},
      BL: {left:0, top:h-10},
      BR: {left: w-10, top: h-10},
      CENTER: {left: Math.floor(w/2)-5, top: Math.floor(h/2)-5},
    };
    const results = {};
    for (const [name, pos] of Object.entries(corners)) {
      const { data, info } = await sharp(file)
        .extract({left: Math.max(0,pos.left), top: Math.max(0,pos.top), width: 10, height: 10})
        .raw().toBuffer({resolveWithObject:true});
      let r=0,g=0,b=0,n=0;
      for (let i=0;i<data.length;i+=info.channels){ r+=data[i]; g+=data[i+1]; b+=data[i+2]; n++; }
      r=Math.round(r/n); g=Math.round(g/n); b=Math.round(b/n);
      results[name] = `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
    }
    console.log(file, meta.width+'x'+meta.height, JSON.stringify(results));
  } catch(e) {
    console.log(file, 'ERROR', e.message);
  }
}

(async () => {
  for (const f of files) await sampleCorner(f);
})();
