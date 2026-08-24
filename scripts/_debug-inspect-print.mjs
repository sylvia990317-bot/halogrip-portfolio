import rhino3dmInit from "rhino3dm";
import fs from "node:fs";
import path from "node:path";

const rhino = await rhino3dmInit();
const SOURCE_3DM = path.join(process.cwd(), "public", "3D model", "打印.3dm");
const bytes = new Uint8Array(fs.readFileSync(SOURCE_3DM));
const doc3dm = rhino.File3dm.fromByteArray(bytes);
if (!doc3dm) { console.log("FAILED TO PARSE"); process.exit(1); }

const layers = doc3dm.layers();
const layerNames = [];
for (let i = 0; i < layers.count; i++) layerNames.push(layers.get(i).name);
console.log("Layers:", layerNames);

const objs = doc3dm.objects();
console.log("Object count:", objs.count);
const typeNames = new Map();
let minAll=[Infinity,Infinity,Infinity], maxAll=[-Infinity,-Infinity,-Infinity];
let meshVerts=0, meshFaces=0;
for (let i = 0; i < objs.count; i++) {
  const obj = objs.get(i);
  const geom = obj.geometry();
  const cname = geom.constructor ? geom.constructor.name : typeof geom;
  typeNames.set(cname, (typeNames.get(cname) || 0) + 1);
  if (cname === "Mesh") {
    const vlist = geom.vertices();
    const flist = geom.faces();
    meshVerts += vlist.count;
    meshFaces += flist.count;
    const b = geom.getBoundingBox();
    for (let k=0;k<3;k++){ minAll[k]=Math.min(minAll[k],b.min[k]); maxAll[k]=Math.max(maxAll[k],b.max[k]); }
  }
}
console.log("Type counts:", [...typeNames.entries()]);
console.log("Total mesh verts:", meshVerts, "faces:", meshFaces);
console.log("Mesh bbox size:", maxAll.map((v,k)=>(v-minAll[k]).toFixed(1)));
console.log("Mesh bbox center:", maxAll.map((v,k)=>((v+minAll[k])/2).toFixed(1)));
