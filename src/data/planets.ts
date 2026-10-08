export interface Planet {
    id: string;
    name: string;
    field: string;
    blurb: string;
    orbit: number;      // distance from the hub: bigger = farther out
    angleDeg: number;   // spot around the hub: 0 = straight back, positive = right, 180 = toward you
    radius: number;     // planet size
    tiltDeg: number;    // how far the planet's axis leans
    seed: number;       // different seed = different surface pattern
    noiseScale: number; // bigger = smaller, busier landmasses
    threshold: number;  // higher = less land
    ring?: boolean;
}

export const planets: Planet[] = [
    {
        id: 'food',
        name: 'HEARTH',
        field: 'FOOD & DELIVERY',
        blurb: 'Line cook to lead cook, floral design, and delivery.',
        orbit: 3.0,
        angleDeg: -160,
        radius: 0.8,
        tiltDeg: 18,
        seed: 3.1,
        noiseScale: 2.0,
        threshold: 0.46,
    },
    {
        id: 'games',
        name: 'PIXELON',
        field: 'GAME DEVELOPMENT',
        blurb: 'Unity VR experiences and Unreal virtual production.',
        orbit: 4.9,
        angleDeg: -50,
        radius: 1.25,
        tiltDeg: 26,
        seed: 7.7,
        noiseScale: 3.2,
        threshold: 0.44,
        ring: true,
    },
    {
        id: 'install',
        name: 'CONDUIT',
        field: 'TECHNICAL INSTALLATION',
        blurb: 'LED walls, structured cabling, power, and networking.',
        orbit: 6.8, 
        angleDeg: 60,
        radius: 1.1,
        tiltDeg: 12,
        seed: 11.3,
        noiseScale: 2.6,
        threshold: 0.5,
    },
];