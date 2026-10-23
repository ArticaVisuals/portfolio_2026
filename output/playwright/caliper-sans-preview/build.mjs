import esbuild from 'esbuild'
import {fileURLToPath} from 'node:url'
import {readFile, writeFile} from 'node:fs/promises'
import {createHash} from 'node:crypto'
await esbuild.build({ entryPoints: [fileURLToPath(new URL('./main.tsx', import.meta.url))], outfile: fileURLToPath(new URL('./bundle.js', import.meta.url)), bundle:true, jsx:'automatic', alias: {framer:fileURLToPath(new URL('./framer-stub.ts',import.meta.url)), react:fileURLToPath(new URL('./node_modules/react',import.meta.url)),'react-dom':fileURLToPath(new URL('./node_modules/react-dom',import.meta.url))}, define:{'process.env.NODE_ENV':'"development"'} })
const hash = createHash('sha256').update(await readFile(new URL('./bundle.js', import.meta.url))).digest('hex').slice(0,12)
const index = new URL('./index.html', import.meta.url)
await writeFile(index, (await readFile(index, 'utf8')).replace(/src="\.\/bundle\.js(?:\?v=[^"]*)?"/, `src="./bundle.js?v=${hash}"`))
