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
const shellObjs = []; // { idx, layer, verts, faces, bbox, hasNormalsFn }

for (let i = 0; i < objs.count; i++) {
  const obj = objs.get(i);
  const geom = obj.geometry();
  if (!geom.vertices) continue;
  const attr = obj.attributes();
  const lname = layerNames[attr.layerIndex] || "";
  if (lname !== "默认" && lname !== "图层 01" && lname !== "图层01") continue;

  const vlist = geom.vertices();
  const flist = geom.faces();
  const b = geom.getBoundingBox();
  shellObjs.push({
    idx: i,
    layer: lname,
    verts: vlist.count,
    faces: flist.count,
    center: [((b.min[0] + b.max[0]) / 2).toFixed(1), ((b.min[1] + b.max[1]) / 2).toFixed(1), ((b.min[2] + b.max[2]) / 2).toFixed(1)],
    size: [(b.max[0] - b.min[0]).toFixed(1), (b.max[1] - b.min[1]).toFixed(1), (b.max[2] - b.min[2]).toFixed(1)],
    hasNormalsFn: typeof geom.normals === "function",
  });
}

shellObjs.sort((a, b) => b.verts - a.verts);
console.log("Top 20 largest shell objects by vertex count:");
for (const o of shellObjs.slice(0, 20)) {
  console.log(o.idx, o.layer, "verts:", o.verts, "faces:", o.faces, "center:", o.center, "size:", o.size, "hasNormalsFn:", o.hasNormalsFn);
}

const withoutNormalsFn = shellObjs.filter((o) => !o.hasNormalsFn);
console.log("\nObjects missing .normals() as function:", withoutNormalsFn.length, "/", shellObjs.length);
if (withoutNormalsFn.length) console.log(withoutNormalsFn.slice(0, 5));
