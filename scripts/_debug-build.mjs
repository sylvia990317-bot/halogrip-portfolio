// Quick, unstyled debug GLB of the whole product (all mesh objects, one gray material,
// no simplify/draco) so we can actually look at the geometry before deciding how to
// split handle vs console in convert-halogrip-model.mjs.
import rhino3dmInit from "rhino3dm";
import fs from "node:fs";
import path from "node:path";
import { Document, NodeIO } from "@gltf-transform/core";

const ROOT = process.cwd();
const SOURCE_3DM = path.join(ROOT, "public", "3D model", "11.11 (1).3dm");
const OUT_GLB = path.join(ROOT, "public", "models", "_debug.glb");

const rhino = await rhino3dmInit();
const bytes = new Uint8Array(fs.readFileSync(SOURCE_3DM));
const doc3dm = rhino.File3dm.fromByteArray(bytes);

const layers = doc3dm.layers();
const layerNames = [];
for (let i = 0; i < layers.count; i++) layerNames.push(layers.get(i).name);

const colorByLayer = {
  "默认": [0.6, 0.6, 0.65, 1],
  "图层 01": [0.9, 0.3, 0.3, 1],
  "图层01": [0.9, 0.3, 0.3, 1],
  "按钮1": [1, 0, 0, 1],
  "按钮2": [0, 0, 1, 1],
  "TAG": [0, 1, 0, 1],
  "SOS": [1, 1, 0, 1],
  "P": [1, 0, 1, 1],
  "中心1": [1, 0.5, 0, 1],
  "中心2": [0.5, 0, 1, 1],
  "中心3": [0, 1, 1, 1],
};

const document = new Document();
const buffer = document.createBuffer();
const scene = document.createScene("debug");
const materialCache = new Map();

function getMaterial(lname) {
  if (materialCache.has(lname)) return materialCache.get(lname);
  const color = colorByLayer[lname] || [0.7, 0.7, 0.7, 1];
  const mat = document.createMaterial(lname || "unknown").setBaseColorFactor(color).setRoughnessFactor(0.6).setMetallicFactor(0);
  materialCache.set(lname, mat);
  return mat;
}

const objs = doc3dm.objects();
let added = 0;
for (let i = 0; i < objs.count; i++) {
  const obj = objs.get(i);
  const geom = obj.geometry();
  if (!geom.constructor || geom.constructor.name !== "Mesh") continue;
  const attr = obj.attributes();
  const lname = layerNames[attr.layerIndex] || "";
  if (lname === "线") continue;

  const vlist = geom.vertices();
  const flist = geom.faces();
  if (vlist.count === 0 || flist.count === 0) continue;

  const positions = new Float32Array(vlist.count * 3);
  for (let vi = 0; vi < vlist.count; vi++) {
    const p = vlist.get(vi);
    positions[vi * 3] = p[0];
    positions[vi * 3 + 1] = p[1];
    positions[vi * 3 + 2] = p[2];
  }
  const indices = [];
  for (let fi = 0; fi < flist.count; fi++) {
    const f = flist.get(fi);
    indices.push(f[0], f[1], f[2]);
    if (f[3] !== f[2]) indices.push(f[0], f[2], f[3]);
  }

  const posAccessor = document.createAccessor().setType("VEC3").setArray(positions).setBuffer(buffer);
  const idxAccessor = document.createAccessor().setType("SCALAR").setArray(Uint32Array.from(indices)).setBuffer(buffer);
  const prim = document.createPrimitive().setMaterial(getMaterial(lname)).setAttribute("POSITION", posAccessor).setIndices(idxAccessor);
  const mesh = document.createMesh().addPrimitive(prim);
  const node = document.createNode(`obj_${i}_${lname}`).setMesh(mesh);
  scene.addChild(node);
  added++;
}
document.getRoot().setDefaultScene(scene);
console.log("Added", added, "objects");

fs.mkdirSync(path.dirname(OUT_GLB), { recursive: true });
const io = new NodeIO();
await io.write(OUT_GLB, document);
console.log("Wrote", OUT_GLB, (fs.statSync(OUT_GLB).size / 1024 / 1024).toFixed(2), "MB");
