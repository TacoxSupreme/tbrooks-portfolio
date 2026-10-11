export type Tier = 'low' | 'medium' | 'high';
export interface Quality {
    tier: Tier;
    pixelRatio: number;      // cap on devicePixelRatio
    antialias: boolean;
    sphereSegments: number;  // globe mesh detail
    planetDots: number;      // points sampled per generated planet
    landStride: number;      // use every Nth Earth land dot (1 = all)
    stars: number;
    cullBack: boolean;       // hide dots on the far side of a globe
    fpsCap: number;          // 0 = uncapped
}
const TIERS: Record<Tier, Quality> = {
    low: { tier: 'low', pixelRatio: 1, antialias: false, sphereSegments: 24, planetDots: 1800, landStride: 2, stars: 600, cullBack: true, fpsCap: 30 },
    medium: { tier: 'medium', pixelRatio: 1.5, antialias: false, sphereSegments: 40, planetDots: 3000, landStride: 1, stars: 1000, cullBack: false, fpsCap: 0 },
    high: { tier: 'high', pixelRatio: 2, antialias: true, sphereSegments: 64, planetDots: 4200, landStride: 1, stars: 1600, cullBack: false, fpsCap: 0 },
};
function detectTier(): Tier {
    const forced = new URLSearchParams(window.location.search).get('q');
    if (forced === 'low' || forced === 'medium' || forced === 'high') return forced;
    const phone =
        window.matchMedia('(pointer: coarse)').matches && Math.min(window.screen.width, window.screen.height) < 700;
    if (phone) return 'low';
    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
    return cores <= 4 || memory <= 4 ? 'medium' : 'high';
}
let cached: Quality | null = null;
export function getQuality(): Quality {
    if (!cached) cached = TIERS[detectTier()];
    return cached;
}