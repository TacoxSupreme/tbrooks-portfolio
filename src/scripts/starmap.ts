import * as THREE from 'three';
import { HOLO, makeGlobeBody, makeGrid, makeDotMaterial } from './earth';
import type { Planet } from '../data/planets';

const CAMERA_HEIGHT = 13;  // higher = more top-down view
const CAMERA_DISTANCE = 9; // how far back from the center

// ---------- Procedural noise: smooth random hills used to decide land vs. ocean ----------
function hash3(x: number, y: number, z: number): number {
    const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
    return s - Math.floor(s);
}

function valueNoise(x: number, y: number, z: number): number {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    const xf = x - xi, yf = y - yi, zf = z - zi;
    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);
    const w = zf * zf * (3 - 2 * zf);
    const lerp = THREE.MathUtils.lerp;
    return lerp(
        lerp(
            lerp(hash3(xi, yi, zi), hash3(xi + 1, yi, zi), u),
            lerp(hash3(xi, yi + 1, zi), hash3(xi + 1, yi + 1, zi), u),
            v,
        ),
        lerp(
            lerp(hash3(xi, yi, zi + 1), hash3(xi + 1, yi, zi + 1), u),
            lerp(hash3(xi, yi + 1, zi + 1), hash3(xi + 1, yi + 1, zi + 1), u),
            v,
        ),
        w,
    );
}

// Four layers of noise stacked: big shapes plus finer detail.
function fbm(x: number, y: number, z: number): number {
    let sum = 0;
    let amp = 0.5;
    let freq = 1;
    for (let i = 0; i < 4; i++) {
        sum += amp * valueNoise(x * freq, y * freq, z * freq);
        freq *= 2;
        amp *= 0.5;
    }
    return sum;
}

// ---------- Building blocks ----------
function circleLine(radius: number, material: THREE.Material, segments = 128): THREE.LineLoop {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), material);
}

function makePlanetDots(planet: Planet): THREE.Points {
    const total = 4200;
    const golden = Math.PI * (3 - Math.sqrt(5)); // spreads points evenly over a sphere
    const kept: number[] = [];

    for (let i = 0; i < total; i++) {
        const y = 1 - ((i + 0.5) / total) * 2;
        const ring = Math.sqrt(1 - y * y);
        const theta = i * golden;
        const x = Math.cos(theta) * ring;
        const z = Math.sin(theta) * ring;
        const n = fbm(
            x * planet.noiseScale + planet.seed,
            y * planet.noiseScale + planet.seed * 1.7,
            z * planet.noiseScale + planet.seed * 2.3,
        );
        if (n > planet.threshold) kept.push(x * 1.006, y * 1.006, z * 1.006);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(kept, 3));
    const seeds = new Float32Array(kept.length / 3);
    for (let i = 0; i < seeds.length; i++) seeds[i] = Math.random();
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

    return new THREE.Points(geometry, makeDotMaterial({ size: 0.14 * planet.radius }));
}

function makeRing(planet: Planet): THREE.Group {
    const group = new THREE.Group();
    const material = new THREE.LineBasicMaterial({ color: HOLO, transparent: true, opacity: 0.45 });
    group.add(circleLine(planet.radius * 1.55, material));
    group.add(circleLine(planet.radius * 1.8, material));
    group.rotation.z = THREE.MathUtils.degToRad(planet.tiltDeg);
    return group;
}

interface PlanetEntry {
    planet: Planet;
    group: THREE.Group;                // sits at the planet's spot on the map
    spin: THREE.Group;                 // turns
    dotMaterial: THREE.ShaderMaterial; // the glowing land dots
    hit: THREE.Mesh;                   // invisible bubble used for hovering and tapping
    glow: number;                      // 0 = calm, 1 = highlighted (eases between the two)
}

function buildPlanet(planet: Planet): PlanetEntry {
    const angle = THREE.MathUtils.degToRad(planet.angleDeg);
    const group = new THREE.Group();
    group.position.set(planet.orbit * Math.sin(angle), 0, -planet.orbit * Math.cos(angle));

    const dots = makePlanetDots(planet);
    const tilt = new THREE.Group();
    tilt.rotation.z = THREE.MathUtils.degToRad(planet.tiltDeg);
    const spin = new THREE.Group();
    spin.scale.setScalar(planet.radius);
    spin.add(makeGlobeBody(1), makeGrid(1.003, 30), dots);
    tilt.add(spin);
    group.add(tilt);

    if (planet.ring) group.add(makeRing(planet));

    // An invisible, slightly larger sphere makes planets easier to point at.
    const hit = new THREE.Mesh(
        new THREE.SphereGeometry(planet.radius * 1.35, 16, 16),
        new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false }),
    );
    hit.userData.planetId = planet.id;
    group.add(hit);

    return { planet, group, spin, dotMaterial: dots.material as THREE.ShaderMaterial, hit, glow: 0 };
}

function buildHub(): { group: THREE.Group; rings: THREE.LineLoop[] } {
    const group = new THREE.Group();
    group.add(
        new THREE.Mesh(
            new THREE.SphereGeometry(0.26, 32, 32),
            new THREE.MeshBasicMaterial({
                color: 0xb8ecff,
                transparent: true,
                opacity: 0.95,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            }),
        ),
    );
    group.add(makeGlobeBody(0.75));

    const material = new THREE.LineBasicMaterial({ color: HOLO, transparent: true, opacity: 0.5 });
    const rings: THREE.LineLoop[] = [];
    [0.55, 0.8, 1.05].forEach((r, i) => {
        const ring = circleLine(r, material);
        ring.rotation.x = THREE.MathUtils.degToRad(25 + i * 22);
        ring.rotation.z = THREE.MathUtils.degToRad(i * 35);
        group.add(ring);
        rings.push(ring);
    });
    return { group, rings };
}

function makeStars(count = 1600): THREE.Points {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const r = 40 + Math.random() * 60;
        const u = Math.random() * 2 - 1;
        const t = Math.random() * Math.PI * 2;
        const s = Math.sqrt(1 - u * u);
        positions.set([r * s * Math.cos(t), r * u, r * s * Math.sin(t)], i * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return new THREE.Points(
        geometry,
        new THREE.PointsMaterial({
            color: 0x9fdcff,
            size: 0.12,
            transparent: true,
            opacity: 0.7,
            depthWrite: false,
        }),
    );
}

// ---------- The scene ----------
// ---------- The scene ----------
export interface StarMapOptions {
    labels?: Map<string, HTMLElement>;          // one label element per planet id
    onSelect?: (planet: Planet | null) => void; // called when a planet is picked or cleared
}

export interface StarMapApi {
    select: (id: string | null) => void;
}

export function createStarMap(
    container: HTMLElement,
    planets: Planet[],
    options: StarMapOptions = {},
): StarMapApi | undefined {
    let renderer: THREE.WebGLRenderer;
    try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
        return undefined; // No WebGL available.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 300);
    const lookTarget = new THREE.Vector3(0, 0, 0);

    const stars = makeStars();
    scene.add(stars);

    const hub = buildHub();
    scene.add(hub.group);

    const entries = planets.map(buildPlanet);
    const dotMaterials = entries.map((e) => e.dotMaterial);
    const orbitMaterials = new Map<string, THREE.LineBasicMaterial>();
    const spokeMaterial = new THREE.LineBasicMaterial({ color: HOLO, transparent: true, opacity: 0.14 });

    for (const entry of entries) {
        // Each planet's orbit ring has its own material so it can brighten on hover.
        const orbitMaterial = new THREE.LineBasicMaterial({ color: HOLO, transparent: true, opacity: 0.16 });
        orbitMaterials.set(entry.planet.id, orbitMaterial);
        scene.add(circleLine(entry.planet.orbit, orbitMaterial));
        scene.add(entry.group);

        // A thin line from the hub toward each planet.
        const from = entry.group.position.clone().multiplyScalar(0.2);
        const to = entry.group.position.clone().multiplyScalar(0.75);
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([from, to]), spokeMaterial));
    }

    // ----- Hover and selection -----
    const labels = options.labels ?? new Map<string, HTMLElement>();
    let hoveredId: string | null = null;
    let selectedId: string | null = null;

    function setHover(id: string | null) {
        if (id === hoveredId) return;
        hoveredId = id;
        renderer.domElement.style.cursor = id ? 'pointer' : 'default';
        labels.forEach((el, key) => el.classList.toggle('is-hover', key === id));
    }

    function select(id: string | null) {
        selectedId = id;
        labels.forEach((el, key) => el.classList.toggle('is-selected', key === id));
        options.onSelect?.(id ? (planets.find((p) => p.id === id) ?? null) : null);
    }

    // Shoot a line from the mouse into the scene and see which planet bubble it hits first.
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const hitMeshes = entries.map((e) => e.hit);

    function pick(event: MouseEvent): string | null {
        const rect = renderer.domElement.getBoundingClientRect();
        ndc.set(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            -((event.clientY - rect.top) / rect.height) * 2 + 1,
        );
        raycaster.setFromCamera(ndc, camera);
        const hits = raycaster.intersectObjects(hitMeshes, false);
        return hits.length ? (hits[0].object.userData.planetId as string) : null;
    }

    const canvas = renderer.domElement;
    canvas.addEventListener('pointermove', (e) => setHover(pick(e)));
    canvas.addEventListener('pointerleave', () => setHover(null));
    canvas.addEventListener('click', (e) => select(pick(e))); // clicking empty space clears the selection

    labels.forEach((el, id) => {
        el.addEventListener('pointerenter', () => setHover(id));
        el.addEventListener('pointerleave', () => setHover(null));
        el.addEventListener('focus', () => setHover(id));
        el.addEventListener('blur', () => setHover(null));
        el.addEventListener('click', () => select(id));
    });

    // ----- Sizing -----
    // Keep all three planets in view on narrow screens by pulling the camera back.
    let fit = 1;
    function resize() {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        fit = Math.max(1, 1.3 / camera.aspect);

        const scale =
            (h * renderer.getPixelRatio()) / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
        for (const m of dotMaterials) m.uniforms.uScale.value = scale;
    }
    new ResizeObserver(resize).observe(container);
    resize();
    camera.position.set(0, CAMERA_HEIGHT * fit, CAMERA_DISTANCE * fit);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: 0, y: 0 };
    if (!reduced) {
        window.addEventListener('pointermove', (e) => {
            pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
            pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
        });
    }

    // ----- Labels follow their planets on screen -----
    const worldPos = new THREE.Vector3();
    const edgePos = new THREE.Vector3();
    const camUp = new THREE.Vector3();

    function placeLabels() {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camUp.setFromMatrixColumn(camera.matrixWorld, 1);

        for (const entry of entries) {
            const label = labels.get(entry.planet.id);
            if (!label) continue;

            worldPos.copy(entry.group.position);
            // A point on the planet's top edge tells us how big it looks on screen.
            edgePos.copy(worldPos).addScaledVector(camUp, entry.planet.radius * entry.group.scale.x);
            worldPos.project(camera);
            edgePos.project(camera);

            const x = (worldPos.x * 0.5 + 0.5) * w;
            const y = (-worldPos.y * 0.5 + 0.5) * h;
            const radiusPx = Math.abs(edgePos.y - worldPos.y) * 0.5 * h;
            label.style.transform = `translate(${x}px, ${y + radiusPx + 12}px) translate(-50%, 0)`;
        }
    }

    // ----- Animation loop -----
    const clock = new THREE.Clock();
    const cameraGoal = new THREE.Vector3();

    function frame() {
        const dt = Math.min(clock.getDelta(), 0.05);
        const t = clock.elapsedTime;

        for (const m of dotMaterials) m.uniforms.uTime.value = t;

        entries.forEach((entry, i) => {
            const id = entry.planet.id;
            const target = id === hoveredId || id === selectedId ? 1 : 0;
            entry.glow += (target - entry.glow) * Math.min(1, dt * 8);

            entry.spin.rotation.y += dt * (reduced ? 0.02 : 0.12 + i * 0.03);
            entry.group.position.y = reduced ? 0 : Math.sin(t * 0.5 + i * 2.1) * 0.08;
            entry.group.scale.setScalar(1 + 0.1 * entry.glow);
            entry.dotMaterial.uniforms.uGlow.value = 0.7 + 0.8 * entry.glow;
            entry.dotMaterial.uniforms.uOpacity.value = 0.9 + 0.1 * entry.glow;
            const orbitMaterial = orbitMaterials.get(id);
            if (orbitMaterial) orbitMaterial.opacity = 0.16 + 0.45 * entry.glow;
        });

        hub.rings.forEach((ring, i) => {
            ring.rotation.y += dt * (reduced ? 0 : 0.3 + i * 0.2);
        });
        if (!reduced) stars.rotation.y += dt * 0.004;

        // The camera drifts a little toward the mouse for depth.
        cameraGoal.set(pointer.x * 0.9, CAMERA_HEIGHT * fit - pointer.y * 0.4, CAMERA_DISTANCE * fit);
        camera.position.lerp(cameraGoal, 0.05);
        camera.lookAt(lookTarget);
        camera.updateMatrixWorld();

        placeLabels();
        renderer.render(scene, camera);
        requestAnimationFrame(frame);
    }
    frame();

    return { select };
}