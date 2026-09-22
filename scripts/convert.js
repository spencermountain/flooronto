/* eslint-disable no-console */
import { DuckDBInstance } from '@duckdb/node-api'

const input = 'toronto-extract.osm.pbf'
const output = 'toronto.parquet'

const instance = await DuckDBInstance.create()
const db = await instance.connect()

await db.run('INSTALL spatial')
await db.run('LOAD spatial')

console.log(`converting ${input} → ${output}`)
await db.run(`
  COPY (SELECT * FROM st_readosm('${input}'))
  TO '${output}' (FORMAT parquet, COMPRESSION zstd)
`)

const reader = await db.runAndReadAll(`SELECT count(*) AS n FROM '${output}'`)
console.log(`wrote ${reader.getRowObjects()[0].n.toLocaleString()} rows`)
