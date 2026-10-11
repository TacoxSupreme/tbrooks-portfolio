export interface Base {
    id: string;
    planetId: string;   // must match a planet id in planets.ts
    name: string;
    role: string;
    period: string;
    summary: string;
    highlights: string[];
    tags: string[];
    lat: number;        // up/down on the planet's face
    lon: number;        // left/right on the planet's face
}

const TODO_ROLE = 'ADD YOUR TITLE';
const TODO_DATES = 'ADD DATES';
const TODO_HIGHLIGHT = 'Add something you are proud of here.';

export const bases: Base[] = [
    // ---------- HEARTH: Food & Delivery ----------
    {
        id: 'royal-scam', planetId: 'food', name: 'The Royal Scam',
        role: TODO_ROLE, period: TODO_DATES,
        summary: 'Replace this with a sentence or two about the job.',
        highlights: [TODO_HIGHLIGHT], tags: ['Kitchen'], lat: 24, lon: -26,
    },
    {
        id: 'heroes', planetId: 'food', name: "Hero's Sports Bar",
        role: TODO_ROLE, period: TODO_DATES,
        summary: 'Replace this with a sentence or two about the job.',
        highlights: [TODO_HIGHLIGHT], tags: ['Kitchen'], lat: 14, lon: 26,
    },
    {
        id: 'delfina', planetId: 'food', name: 'Pizzeria Delfina',
        role: TODO_ROLE, period: TODO_DATES,
        summary: 'Replace this with a sentence or two about the job.',
        highlights: [TODO_HIGHLIGHT], tags: ['Service'], lat: -4, lon: -36,
    },
    {
        id: 'floral', planetId: 'food', name: 'Floral Design & Delivery',
        role: TODO_ROLE, period: TODO_DATES,
        summary: 'Replace this with a sentence or two about the job.',
        highlights: [TODO_HIGHLIGHT], tags: ['Design', 'Delivery'], lat: -16, lon: 6,
    },
    {
        id: 'doordash', planetId: 'food', name: 'DoorDash',
        role: TODO_ROLE, period: TODO_DATES,
        summary: 'Replace this with a sentence or two about the work.',
        highlights: [TODO_HIGHLIGHT], tags: ['Delivery'], lat: -28, lon: 30,
    },

    // ---------- PIXELON: Game Development ----------
    {
        id: 'exploring-digital', planetId: 'games', name: 'Exploring Digital',
        role: TODO_ROLE, period: TODO_DATES,
        summary: 'Unity VR 4D experiences: C# scripting, motion capture integration, story, music, and 3D art.',
        highlights: [TODO_HIGHLIGHT], tags: ['Unity', 'C#', 'VR', 'Mocap'], lat: 16, lon: -24,
    },
    {
        id: 'third-realm', planetId: 'games', name: '3rd Realm Creations',
        role: TODO_ROLE, period: TODO_DATES,
        summary: 'Virtual production in Unreal Engine with Rokoko mocap suits, Vive tracking, and LED volume walls.',
        highlights: [TODO_HIGHLIGHT], tags: ['Unreal Engine', 'Rokoko', 'Vive', 'LED volume'], lat: -10, lon: 18,
    },

    // ---------- CONDUIT: Technical Installation ----------
    // NDA: keep names generic unless you have cleared them.
    {
        id: 'soundwave', planetId: 'install', name: 'SoundWave Technologies',
        role: TODO_ROLE, period: TODO_DATES,
        summary: 'LED wall installs: panel prep, Cat6 runs and termination, power, and networking.',
        highlights: [TODO_HIGHLIGHT], tags: ['LED', 'Cat6', 'Power', 'Networking'], lat: 22, lon: -22,
    },
    {
        id: 'scoreboard', planetId: 'install', name: 'Stadium Scoreboard Install',
        role: TODO_ROLE, period: TODO_DATES,
        summary: 'LED scoreboard installation for a stadium.',
        highlights: [TODO_HIGHLIGHT], tags: ['LED', 'Install'], lat: 6, lon: 26,
    },
    {
        id: 'cabling', planetId: 'install', name: 'Structured Cabling & Networking',
        role: TODO_ROLE, period: TODO_DATES,
        summary: 'Structured cabling, cable termination, and small-network setup.',
        highlights: [TODO_HIGHLIGHT], tags: ['Cat6', 'Termination', 'Networking'], lat: -14, lon: -26,
    },
    {
        id: 'it-cert', planetId: 'install', name: 'Google IT Support Certificate',
        role: 'CERTIFICATION', period: TODO_DATES,
        summary: 'Replace this with a sentence or two about what you learned.',
        highlights: [TODO_HIGHLIGHT], tags: ['IT Support'], lat: -26, lon: 14,
    },
];