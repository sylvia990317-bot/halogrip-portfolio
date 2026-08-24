import rhino3dmInit from "rhino3dm";
import fs from "node:fs";
import path from "node:path";

const rhino = await rhino3dmInit();
const SOURCE_3DM = path.join(process.cwd(), "public", "3D model", "11.11 (1).3dm");
const bytes = new Uint8Array(fs.readFileSync(SOURCE_3DM));
const doc3dm = rhino.File3dm.fromByteArray(bytes);

const layers = doc3dm.layers();
const layerNames = [];
for (let i = 0; i < layers.count; i++) layerNames.push(layers.get(i).name);

const objs = doc3dm.objects();

// sanity check the actual return shape of vlist.get()
{
  const sampleObj = objs.get(0);
  const sampleGeom = sampleObj.geometry();
  const sampleV = sampleGeom.vertices().get(0);
  console.log("sample vertex value:", sampleV, "typeof:", typeof sampleV, "isArray:", Array.isArray(sampleV));
}

let badObjects = [];
let maxAbs = 0;

for (let i = 0; i < objs.count; i++) {
  const obj = objs.get(i);
  const geom = obj.geometry();
  if (!geom.vertices) continue;
  const attr = obj.attributes();
  const lname = layerNames[attr.layerIndex] || "";
  if (lname === "线") continue;

  const vlist = geom.vertices();
  const flist = geom.faces();
  let bad = false;
  let localMax = 0;
  for (let vi = 0; vi < vlist.count; vi++) {
    const p = vlist.get(vi);
    if (!Array.isArray(p)) {
      console.log("NON-ARRAY VERTEX", { objIdx: i, layer: lname, vi, p });
      bad = true;
      continue;
    }
    for (const c of p) {
      if (!Number.isFinite(c)) { bad = true; }
      localMax = Math.max(localMax, Math.abs(c));
    }
  }
  // check face indices in range
  let badIndex = false;
  for (let fi = 0; fi < flist.count; fi++) {
    const f = flist.get(fi);
    for (const idx of f) {
      if (idx < 0 || idx >= vlist.count) badIndex = true;
    }
  }
  maxAbs = Math.max(maxAbs, localMax);
  if (bad || badIndex || localMax > 5000) {
    badObjects.push({ idx: i, layer: lname, verts: vlist.count, faces: flist.count, localMax, bad, badIndex });
  }
}

console.log("Global max abs coordinate:", maxAbs);
console.log("Suspicious objects:", badObjects.length);
console.log(badObjects.slice(0, 30));
