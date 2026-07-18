import { spawn } from 'node:child_process'

const url = 'https://download.geofabrik.de/north-america/canada/ontario-latest.osm.pbf'
const input = 'ontario-latest.osm.pbf'
const output = 'toronto-extract.osm.pbf'
const boundary = '-79.639,43.581,-79.115,43.855'

const run = (cmd, args) => new Promise((resolve, reject) => {
  const child = spawn(cmd, args, { stdio: 'inherit' })
  child.on('error', reject)
  child.on('exit', code => code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`)))
})

await run('wget', ['-c', '-O', input, url])
await run('osmium', ['extract', '-b', boundary, input, '-o', output])
