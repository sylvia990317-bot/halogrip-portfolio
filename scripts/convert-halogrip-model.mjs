// One-off converter: "public/3D model/11.11 (1).3dm" -> "public/models/halogrip.glb"
//
// The source is a raw CATIA->STL import batched into Rhino (670 untextured mesh objects across
// 12 layers, no UVs). This script groups those objects into three parts by Rhino layer + spatial
// position (there is no clean layer-level split between the handle and the console — see the
// bounding-box heuristic below), builds a glTF document with @gltf-transform, bakes in the real
// leather texture Sylvia confirmed is used on the handle, decimates the two big shell meshes, and
// Draco-compresses the result.
//
// Re-run with: node scripts/convert-halogrip-model.mjs
//
// The leather normal/roughness maps are not committed (11-19MB source JPGs) - they're extracted
// once from "public/3D model/使用.ksp" (a zip) into scripts/_model-source/ (gitignored):
//   Expand-Archive "public/3D model/使用.ksp" -DestinationPath <tmp>
//   copy <tmp>/leather_fine_grain_worn_Normal.jpg     scripts/_model-source/leather_normal.jpg
//   copy <tmp>/leather_fine_grain_worn_Roughness.jpg  scripts/_model-source/leather_roughness.jpg

import rhino3dmInit from "rhino3dm";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { Document, NodeIO } from "@gltf-transform/core";
import { KHRDracoMeshCompression } from "@gltf-transform/extensions";
import { draco, simplify, weld } from "@gltf-transform/functions";
import { MeshoptSimplifier } from "meshoptimizer";
import draco3d from "draco3dgltf";

const ROOT = process.cwd();
const SOURCE_3DM = path.join(ROOT, "public", "3D model", "11.11 (1).3dm");
const LEATHER_NORMAL = path.join(ROOT, "scripts", "_model-source", "leather_normal.jpg");
const LEATHER_ROUGHNESS = path.join(ROOT, "scripts", "_model-source", "leather_roughness.jpg");
const OUT_DIR = path.join(ROOT, "public", "models");
const OUT_GLB = path.join(OUT_DIR, "halogrip.glb");

// Layers holding the small console details (buttons, tag, labels, hub accents).
const DETAIL_LAYERS = new Set(["按钮1", "按钮2", "TAG", "SOS", "P", "中心1", "中心2", "中心3"]);
// Construction geometry, not part of the visible product.
const SKIP_LAYERS = new Set(["线"]);

// The two big shell layers ("默认", "图层 01") each span nearly the model's full width - neither
// maps cleanly to "handle" or "console". Console/detail parts cluster tightly around this region
// (derived from the real detail-layer bounding boxes, padded); anything in the two shell layers
// whose bbox center falls inside it is console, everything else is the handle's arcing arms.
const CONSOLE_REGION = { xmin: -75, xmax: 80, ymin: 30, ymax: 100, zmin: -65, zmax: 15 };

const UV_SCALE = 1 / 60; // triplanar box-projection tiling for the leather normal/roughness maps

function triplanarUV(nx, ny, nz, x, y, z) {
  const ax = Math.abs(nx), ay = Math.abs(ny), az = Math.abs(nz);
  if (ax >= ay && ax >= az) return [y * UV_SCALE, z * UV_SCALE];
  if (ay >= ax && ay >= az) return [x * UV_SCALE, z * UV_SCALE];
  return [x * UV_SCALE, y * UV_SCALE];
}

/** Merge a list of rhino3dm Mesh geometries into one flat vertex/index buffer. */
function mergeMeshes(meshes, { withUV }) {
  const positions = [];
  const normals = [];
  const uvs = withUV ? [] : null;
  const indices = [];
  let vertOffset = 0;

  for (const mesh of meshes) {
    const vlist = mesh.vertices();
    const nlist = mesh.normals();
    const flist = mesh.faces();
    if (nlist.count !== vlist.count) nlist.computeNormals();

    const pts = vlist.toPoint3fArray();
    for (let vi = 0; vi < pts.length; vi++) {
      const [x, y, z] = pts[vi];
      positions.push(x, y, z);
      const n = nlist.count === vlist.count ? nlist.get(vi) : [0, 1, 0];
      normals.push(n[0], n[1], n[2]);
      if (withUV) {
        const [u, v] = triplanarUV(n[0], n[1], n[2], x, y, z);
        uvs.push(u, v);
      }
    }

    for (let fi = 0; fi < flist.count; fi++) {
      const f = flist.get(fi);
      const a = f[0] + vertOffset, b = f[1] + vertOffset, c = f[2] + vertOffset, d = f[3] + vertOffset;
      indices.push(a, b, c);
      if (f[3] !== f[2]) indices.push(a, c, d); // quad -> second triangle
    }
    vertOffset += vlist.count;
  }

  return {
    positions: Float32Array.from(positions),
    normals: Float32Array.from(normals),
    uvs: uvs ? Float32Array.from(uvs) : null,
    indices: Uint32Array.from(indices),
  };
}

function bboxCenter(mesh) {
  const b = mesh.getBoundingBox();
  return [(b.min[0] + b.max[0]) / 2, (b.min[1] + b.max[1]) / 2, (b.min[2] + b.max[2]) / 2];
}

function inConsoleRegion([cx, cy, cz]) {
  return (
    cx >= CONSOLE_REGION.xmin && cx <= CONSOLE_REGION.xmax &&
    cy >= CONSOLE_REGION.ymin && cy <= CONSOLE_REGION.ymax &&
    cz >= CONSOLE_REGION.zmin && cz <= CONSOLE_REGION.zmax
  );
}

async function loadTexture(document, filePath, name, maxSize = 1536) {
  const resized = await sharp(filePath).resize(maxSize, maxSize, { fit: "inside" }).jpeg({ quality: 82 }).toBuffer();
  return document.createTexture(name).setImage(resized).setMimeType("image/jpeg");
}

async function main() {
  console.log("Loading", SOURCE_3DM);
  const rhino = await rhino3dmInit();
  const bytes = new Uint8Array(fs.readFileSync(SOURCE_3DM));
  const doc3dm = rhino.File3dm.fromByteArray(bytes);
  if (!doc3dm) throw new Error("Failed to parse .3dm file");

  const layers = doc3dm.layers();
  const layerNames = [];
  for (let i = 0; i < layers.count; i++) layerNames.push(layers.get(i).name);

  const groupMeshes = { handle: [], console: [], accent: [] };
  const objs = doc3dm.objects();
  for (let i = 0; i < objs.count; i++) {
    const obj = objs.get(i);
    const geom = obj.geometry();
    if (!geom.constructor || geom.constructor.name !== "Mesh") continue; // curve/Brep/annotation/etc.
    const attr = obj.attributes();
    const lname = layerNames[attr.layerIndex] || "";
    if (SKIP_LAYERS.has(lname)) continue;

    if (DETAIL_LAYERS.has(lname)) {
      groupMeshes.accent.push(geom);
      continue;
    }
    if (inConsoleRegion(bboxCenter(geom))) groupMeshes.console.push(geom);
    else groupMeshes.handle.push(geom);
  }

  console.log("Grouped objects -> handle:", groupMeshes.handle.length, "console:", groupMeshes.console.length, "accent:", groupMeshes.accent.length);

  const handleData = mergeMeshes(groupMeshes.handle, { withUV: true });
  const consoleData = mergeMeshes(groupMeshes.console, { withUV: false });
  const accentData = mergeMeshes(groupMeshes.accent, { withUV: false });

  console.log(
    "Triangle counts (pre-simplify) -> handle:", handleData.indices.length / 3,
    "console:", consoleData.indices.length / 3,
    "accent:", accentData.indices.length / 3
  );

  // Center + normalize scale across all three groups combined, so the model is a portable,
  // resolution-agnostic asset (longest overall dimension == 1 unit).
  let min = [Infinity, Infinity, Infinity];
  let max = [-Infinity, -Infinity, -Infinity];
  for (const data of [handleData, consoleData, accentData]) {
    for (let i = 0; i < data.positions.length; i += 3) {
      for (let k = 0; k < 3; k++) {
        const v = data.positions[i + k];
        if (v < min[k]) min[k] = v;
        if (v > max[k]) max[k] = v;
      }
    }
  }
  const center = [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2];
  const size = [max[0] - min[0], max[1] - min[1], max[2] - min[2]];
  const scale = 1 / Math.max(...size);
  console.log("Bounding box size:", size, "-> normalizing with scale", scale);

  for (const data of [handleData, consoleData, accentData]) {
    for (let i = 0; i < data.positions.length; i += 3) {
      data.positions[i] = (data.positions[i] - center[0]) * scale;
      data.positions[i + 1] = (data.positions[i + 1] - center[1]) * scale;
      data.positions[i + 2] = (data.positions[i + 2] - center[2]) * scale;
    }
  }

  const document = new Document();
  const buffer = document.createBuffer();

  const leatherNormalTex = await loadTexture(document, LEATHER_NORMAL, "leatherNormal");
  const leatherRoughnessTex = await loadTexture(document, LEATHER_ROUGHNESS, "leatherRoughness");

  const handleMaterial = document
    .createMaterial("handleLeather")
    .setBaseColorFactor([0.05, 0.05, 0.06, 1])
    .setRoughnessFactor(1)
    .setMetallicFactor(0)
    .setNormalTexture(leatherNormalTex)
    .setNormalScale(0.55)
    .setMetallicRoughnessTexture(leatherRoughnessTex);

  const consoleMaterial = document
    .createMaterial("consolePlastic")
    .setBaseColorFactor([0.025, 0.03, 0.035, 1])
    .setRoughnessFactor(0.25)
    .setMetallicFactor(0.05);

  const accentMaterial = document
    .createMaterial("accentLight")
    .setBaseColorFactor([0.86, 0.86, 0.9, 1])
    .setRoughnessFactor(0.4)
    .setMetallicFactor(0);

  function addMesh(name, data, material) {
    const posAccessor = document.createAccessor(`${name}_position`).setType("VEC3").setArray(data.positions).setBuffer(buffer);
    const normAccessor = document.createAccessor(`${name}_normal`).setType("VEC3").setArray(data.normals).setBuffer(buffer);
    const idxAccessor = document.createAccessor(`${name}_indices`).setType("SCALAR").setArray(data.indices).setBuffer(buffer);

    const prim = document.createPrimitive().setMaterial(material).setAttribute("POSITION", posAccessor).setAttribute("NORMAL", normAccessor).setIndices(idxAccessor);

    if (data.uvs) {
      const uvAccessor = document.createAccessor(`${name}_uv`).setType("VEC2").setArray(data.uvs).setBuffer(buffer);
      prim.setAttribute("TEXCOORD_0", uvAccessor);
    }

    const mesh = document.createMesh(name).addPrimitive(prim);
    return document.createNode(name).setMesh(mesh);
  }

  const scene = document.createScene("halogrip");
  scene.addChild(addMesh("handle", handleData, handleMaterial));
  scene.addChild(addMesh("console", consoleData, consoleMaterial));
  scene.addChild(addMesh("accent", accentData, accentMaterial));
  document.getRoot().setDefaultScene(scene);

  console.log("Simplifying handle + console meshes...");
  await MeshoptSimplifier.ready;
  await document.transform(
    weld({}),
    simplify({ simplifier: MeshoptSimplifier, ratio: 0.25, error: 0.01 })
  );

  const io = new NodeIO().registerExtensions([KHRDracoMeshCompression]).registerDependencies({
    "draco3d.encoder": await draco3d.createEncoderModule(),
    "draco3d.decoder": await draco3d.createDecoderModule(),
  });
  await document.transform(draco({ method: "edgebreaker" }));

  fs.mkdirSync(OUT_DIR, { recursive: true });
  await io.write(OUT_GLB, document);

  const stat = fs.statSync(OUT_GLB);
  console.log(`Wrote ${OUT_GLB} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
