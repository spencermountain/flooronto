/* eslint-disable no-console */

import { DuckDBInstance } from '@duckdb/node-api'

const parquet = 'toronto.parquet'

const examples = {
  'element counts by kind': `
    SELECT kind, count(*) AS n
    FROM '${parquet}'
    GROUP BY kind
    ORDER BY n DESC
  `,

  'most common amenities': `
    SELECT tags['amenity'] AS amenity, count(*) AS n
    FROM '${parquet}'
    WHERE tags['amenity'] IS NOT NULL
    GROUP BY amenity
    ORDER BY n DESC
    LIMIT 15
  `,

  'subway stations': `
    SELECT tags['name'] AS name, round(lat, 5) AS lat, round(lon, 5) AS lon
    FROM '${parquet}'
    WHERE kind = 'node'
      AND tags['station'] = 'subway'
      AND tags['name'] IS NOT NULL
    ORDER BY name
    LIMIT 15
  `,

  'streets with the most segments': `
    SELECT tags['name'] AS street, count(*) AS segments
    FROM '${parquet}'
    WHERE kind = 'way'
      AND tags['highway'] IS NOT NULL
      AND tags['name'] IS NOT NULL
    GROUP BY street
    ORDER BY segments DESC
    LIMIT 10
  `,

  'building types': `
    SELECT tags['building'] AS type, count(*) AS n
    FROM '${parquet}'
    WHERE kind = 'way' AND tags['building'] IS NOT NULL
    GROUP BY type
    ORDER BY n DESC
    LIMIT 10
  `,

  'cafes near yonge-dundas square': `
    SELECT tags['name'] AS name, round(lat, 5) AS lat, round(lon, 5) AS lon
    FROM '${parquet}'
    WHERE kind = 'node'
      AND tags['amenity'] = 'cafe'
      AND tags['name'] IS NOT NULL
      AND lat BETWEEN 43.653 AND 43.659
      AND lon BETWEEN -79.384 AND -79.377
    ORDER BY name
  `
}

const instance = await DuckDBInstance.create()
const db = await instance.connect()

for (const [title, sql] of Object.entries(examples)) {
  const reader = await db.runAndReadAll(sql)
  console.log(`\n── ${title}`)
  console.table(reader.getRowObjectsJson())
}
