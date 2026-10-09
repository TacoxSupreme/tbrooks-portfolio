---
name: Portfolio project context
alwaysApply: true
---

I am building a personal portfolio site. Stack: Astro 7, Three.js, TypeScript (strict), no UI framework. Windows, Node 24, VSCodium.

Site flow:
- / is the landing page: a rotating holographic Earth and a button, Activate Information System, that goes to /map.
- /map is a top-down star map: a hub in the middle and three planets, each on its own orbit ring. Hover glows a planet, click opens an info card, Enter Sector flies the camera down to the planet, where glowing base markers (one per career entry) sit on the surface. Clicking a marker opens a detail panel.

Files:
- src/pages/index.astro: landing page (HTML, CSS, client script)
- src/pages/map.astro: star map page (label buttons, cards, client script)
- src/layouts/Base.astro: shared HTML shell, fonts, global CSS
- src/styles/global.css: colors and effects
- src/scripts/earth.ts: Earth scene. Exports HOLO, makeGlobeBody, makeGrid, latLonToVector3, makeDotMaterial, createEarth
- src/scripts/starmap.ts: star map scene, camera fly-in, base markers, labels. Exports createStarMap
- src/data/planets.ts: planet list (type Planet)
- src/data/bases.ts: base list (type Base)
- src/data/land-dots.json: flat list of [lon, lat, lon, lat, ...] for Earth land
- tools/: Node scripts I run by hand

Look: blue hologram (#4fd1ff), additive blending, glowing points from a custom shader with uniforms uSize, uGlow, uOpacity, uTwinkle, uTime, uScale.

Rules:
1. Make the smallest change that does the job. Do not rewrite files I did not ask about.
2. Show only changed or new code, with the file name and exactly where it goes.
3. Do not add npm packages unless the chunk says so.
4. Keep prefers-reduced-motion support and keyboard access (labels are real buttons).
5. Keep existing export names. Other files import them.
6. TypeScript strict. No any.
7. If you are unsure about my code, ask me to paste it. Do not guess.