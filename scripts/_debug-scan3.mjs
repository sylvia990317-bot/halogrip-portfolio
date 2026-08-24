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
const candidates = [];
for (let i = 0; i < objs.count; i++) {
  const obj = objs.get(i);
  const geom = obj.geometry();
  if (!geom.constructor || geom.constructor.name !== "Mesh") continue;
  const attr = obj.attributes();
  const lname = layerNames[attr.layerIndex] || "";
  if (lname !== "默认" && lname !== "图层 01") continue;

  const vlist = geom.vertices();
  const flist = geom.faces();
  if (vlist.count < 20) continue; // skip tiny slivers/degenerate

  const b = geom.getBoundingBox();
  const sx = b.max[0] - b.min[0], sy = b.max[1] - b.min[1], sz = b.max[2] - b.min[2];
  const dims = [sx, sy, sz].sort((a, b) => a - b);
  const [smallest, mid, largest] = dims;
  // "tube-like" heuristic: one long axis, two comparatively small axes (roughly circular cross-section),
  // with a moderate (not huge) longest dimension - a grip tube should be a few hundred units long at most
  // given the console/detail cluster's own ~130-unit scale, not thousands.
  if (largest > 50 && largest < 1200 && smallest < largest * 0.35 && mid < largest * 0.6) {
    candidates.push({
      idx: i,
      layer: lname,
      verts: vlist.count,
      faces: flist.count,
      size: [sx.toFixed(1), sy.toFixed(1), sz.toFixed(1)],
      center: [((b.min[0] + b.max[0]) / 2).toFixed(1), ((b.min[1] + b.max[1]) / 2).toFixed(1), ((b.min[2] + b.max[2]) / 2).toFixed(1)],
    });
  }
}

console.log("Tube-like candidates:", candidates.length);
for (const c of candidates) console.log(c);
