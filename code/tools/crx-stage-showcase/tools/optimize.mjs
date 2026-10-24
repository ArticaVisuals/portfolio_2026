// Run with an explicit original model path. Never modifies the production previs model.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, weld, simplify, meshopt } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
import { resolve } from 'node:path';
await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready, MeshoptSimplifier.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder,'meshopt.encoder':MeshoptEncoder});
if (!process.argv[2]) throw new Error('Usage: npm run optimize -- /path/to/original-stage.glb');
const doc = await io.read(process.argv[2]);
const count = () => doc.getRoot().listMeshes().reduce((n,m)=>n+m.listPrimitives().reduce((s,p)=>s+(p.getIndices()?.getCount()||0)/3,0),0);
const before=count();
await doc.transform(weld(),simplify({simplifier:MeshoptSimplifier,ratio:0.3,error:0.001}),dedup(),prune(),meshopt({encoder:MeshoptEncoder,level:'high'}));
await io.write(resolve(import.meta.dirname,'../../../../assets/by-project/optro-crx/stage-showcase/stage.glb'), doc);
console.log(JSON.stringify({before,after:count()}));
