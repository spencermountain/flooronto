# flooronto
toronto GIS data in parquet

```
brew install osmium-tool
pnpm install

pnpm download   # fetch ontario-latest.osm.pbf + extract toronto bbox
pnpm convert    # toronto-extract.osm.pbf → toronto.parquet (duckdb st_readosm)
pnpm queries    # run example duckdb queries in src/
```