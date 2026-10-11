import { getQuality } from './quality'
import * as THREE from 'three';
import landDots from '../data/land-dots.json';
import { startLoop } from './loop';

export const HOLO = 0x4fd1ff;

// Rim glow: bright where the surface turns away from the camera, clear in the middle.
const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float edge = pow(1.0 - max(dot(normalize(vNormal), normalize(vView)), 0.0), 2.5);
    gl_FragColor = vec4(uColor, edge * 0.9 + 0.06);
  }
`;

export function makeGlobeBody(radius: number, segments = 64): THREE.Mesh {
  const material = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(HOLO) } },
    vertexShader,
    fragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  return new THREE.Mesh(new THREE.SphereGeometry(radius, segments, segments), material);
}

// Latitude rings and longitude lines, like a map grid wrapped around the sphere.
export function makeGrid(radius: number, stepDeg = 15): THREE.Group {
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({ color: HOLO, transparent: true, opacity: 0.15 });
  const segments = 96;

  for (let lat = -75; lat <= 75; lat += stepDeg) {
    const phi = THREE.MathUtils.degToRad(lat);
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(
        radius * Math.cos(phi) * Math.cos(theta),
        radius * Math.sin(phi),
        radius * Math.cos(phi) * Math.sin(theta),
      ));
    }
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material));
  }

  for (let lon = 0; lon < 180; lon += stepDeg) {
    const theta = THREE.MathUtils.degToRad(lon);
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const phi = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(
        radius * Math.cos(phi) * Math.cos(theta),
        radius * Math.sin(phi),
        radius * Math.cos(phi) * Math.sin(theta),
      ));
    }
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material));
  }

  return group;
}

export function latLonToVector3(
  latDeg: number,
  lonDeg: number,
  radius: number,
  target = new THREE.Vector3(),
): THREE.Vector3 {
  const lat = THREE.MathUtils.degToRad(latDeg);
  const lon = THREE.MathUtils.degToRad(lonDeg);
  return target.set(
    radius * Math.cos(lat) * Math.sin(lon),
    radius * Math.sin(lat),
    radius * Math.cos(lat) * Math.cos(lon),
  );
}


// Each land dot is a bright core plus a soft halo, drawn per pixel on the GPU.
const dotVertexShader = `
  uniform float uSize;
  uniform float uScale;
  uniform float uTime;
  uniform float uTwinkle;
  attribute float aSeed;
  varying float vFacing;
  varying float vFlicker;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    // How directly this dot faces the camera: 1 = center of the disc, 0 = rim, negative = far side.
    vec3 normal = normalize(normalMatrix * position);
    vFacing = dot(normal, normalize(-mv.xyz));
    // Each dot twinkles on its own rhythm, using its random seed.
    vFlicker = 1.0 - uTwinkle * (0.5 + 0.5 * sin(uTime * 1.6 + aSeed * 6.2831));
    gl_PointSize = uSize * uScale / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const dotFragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uGlow;
  uniform float uCullBack;
  varying float vFacing;
  varying float vFlicker;
  void main() {
    // 0 at the middle of the dot, 1 at the edge of its square.
    float d = length(gl_PointCoord - vec2(0.5)) * 2.0;
    if (uCullBack > 0.5 && vFacing < 0.0) discard;

    float core = smoothstep(0.4, 0.0, d);     // small, bright center
    float halo = pow(1.0 - d, 3.0) * uGlow;   // wide, soft glow around it

    // Dots on the far side stay visible but dimmer, which keeps the see-through hologram look.
    float depthFade = mix(0.25, 1.0, smoothstep(-0.2, 0.5, vFacing));

    float strength = (core + halo) * depthFade * vFlicker;
    gl_FragColor = vec4(uColor, strength * uOpacity);
  }
`;

export function makeDotMaterial(
  options: { size?: number; glow?: number; opacity?: number; color?: number; cullBack?: boolean } = {},
): THREE.ShaderMaterial {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(options.color ?? 0xb8ecff) },
      uSize: { value: options.size ?? 0.075 },
      uGlow: { value: options.glow ?? 0.7 },
      uOpacity: { value: options.opacity ?? 0.9 },
      uTwinkle: { value: reduced ? 0 : 0.25 },
      uTime: { value: 0 },
      uScale: { value: 300 },
      uCullBack: { value: options.cullBack ? 1 : 0 },
    },
    vertexShader: dotVertexShader,
    fragmentShader: dotFragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

function makeLandDots(radius: number, stride: number): THREE.Points {
  const used = Math.ceil(landDots.length / 2 / stride);
  const positions = new Float32Array(used * 3);
  const seeds = new Float32Array(used);
  const point = new THREE.Vector3();

  for (let j = 0; j < used; j++) {
    const i = j * stride;
    latLonToVector3(landDots[i * 2 + 1], landDots[i * 2], radius, point);
    positions.set([point.x, point.y, point.z], j * 3);
    seeds[j] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));


  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const material = makeDotMaterial({ size: 0.075 * Math.sqrt(stride) });
  return new THREE.Points(geometry, material);
}

export function createEarth(container: HTMLElement): void {
  const q = getQuality();
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: q.antialias, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return; // No WebGL: the CSS rings stay as a fallback.
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, q.pixelRatio));
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 5);

  // "tilt" leans the whole planet like Earth's axis; "spin" turns inside it.
  const tilt = new THREE.Group();
  tilt.rotation.z = THREE.MathUtils.degToRad(23.4);
  tilt.rotation.x = THREE.MathUtils.degToRad(15);
  const spin = new THREE.Group();
  tilt.add(spin);
  scene.add(tilt);

  spin.add(makeGlobeBody(1, q.sphereSegments));
  spin.add(makeGrid(1.003));
  const landPoints = makeLandDots(1.006, q.landStride);
  const dotUniforms = (landPoints.material as THREE.ShaderMaterial).uniforms;
  spin.add(landPoints);
  spin.rotation.y = THREE.MathUtils.degToRad(88); // start facing the Americas

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    dotUniforms.uScale.value =
      (h * renderer.getPixelRatio()) / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
  }
  new ResizeObserver(resize).observe(container);
  resize();

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // If the device keeps missing frames, drop the resolution a notch (never below 0.75x).
  let ratio = renderer.getPixelRatio();
  function lowerResolution() {
    if (ratio <= 0.75) return;
    ratio = Math.max(0.75, ratio - 0.25);
    renderer.setPixelRatio(ratio);
    resize();
  }

  startLoop({
    update(dt, t) {
      dotUniforms.uTime.value = t;
      spin.rotation.y += dt * (reduced ? 0.02 : 0.18);
      renderer.render(scene, camera);
    },
    onSlow: lowerResolution,
  });
}