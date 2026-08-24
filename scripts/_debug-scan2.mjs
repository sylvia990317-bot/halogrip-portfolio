import rhino3dmInit from "rhino3dm";
import fs from "node:fs";
import path from "node:path";

const rhino = await rhino3dmInit();
const SOURCE_3DM = path.join(process.cwd(), "public", "3D model", "11.11 (1).3dm");
const bytes = new Uint8Array(fs.readFileSync(SOURCE_3DM));
const doc3dm = rhino.File3dm.fromByteArray(bytes);

const objs = doc3dm.objects();
const typeNames = new Map();
for (let i = 0; i < objs.count; i++) {
  const geom = objs.get(i).geometry();
  const cname = geom.constructor ? geom.constructor.name : typeof geom;
  typeNames.set(cname, (typeNames.get(cname) || 0) + 1);
}
console.log([...typeNames.entries()]);
