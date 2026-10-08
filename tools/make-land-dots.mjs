import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { feature } from 'topojson-client';
import { geoContains } from 'd3-geo';

const topology = JSON.parse(readFileSync('node_modules/world-atlas/land-110m.json', 'utf8'));
const land = feature(topology, topology.objects.land);

const STEP = 1.8; // degrees between dots. Smaller = more dots, denser look.
const dots = [];

for (let lat = -88; lat <= 88; lat += STEP) {
    // Rings near the poles are shorter, so they get fewer dots. This keeps spacing even.
    const dotsInRing = Math.max(1, Math.round((360 * Math.cos((lat * Math.PI) / 180)) / STEP));
    for (let i = 0; i < dotsInRing; i++) {
        const lon = -180 + (i + 0.5) * (360 / dotsInRing);
        if (geoContains(land, [lon, lat])) {
            dots.push(Number(lon.toFixed(2)), Number(lat.toFixed(2)));
        }
    }
}

mkdirSync('src/data', { recursive: true });
writeFileSync('src/data/land-dots.json', JSON.stringify(dots));
console.log(`Wrote ${dots.length / 2} land dots`);