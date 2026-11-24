export interface BaseImage {
    src: string;        // for example '/images/bases/royal-scam/01.webp'
    alt: string;        // describe the photo for screen readers
    caption?: string;
}

export interface BaseLink {
    label: string;      // for example 'Company website'
    url: string;        // must start with https://
}

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
    story?: string[];   // paragraphs of text
    images?: BaseImage[];
    links?: BaseLink[];
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
        story: [
            'Test paragraph one.',
        ],
        images: [
            { src: '/images/bases/royal-scam/01.webp', alt: 'Describe what the photo shows' },

        ],
        links: [
            { label: 'Test link', url: 'https://example.com' },
        ],
    },
    {
        id: 'heroes', planetId: 'food', name: "Hero's Sports Bar",
        role: TODO_ROLE, period: TODO_DATES,
        summary: 'Replace this with a sentence or two about the job.',
        highlights: [TODO_HIGHLIGHT], tags: ['Kitchen'], lat: 14, lon: 26,
        story: [
            'Test paragraph one.',
        ],
        images: [],
        links: [
            { label: 'Test link', url: 'https://example.com' },
        ],
    },
    {
        id: 'delfina', planetId: 'food', name: 'Pizzeria Delfina',
        role: TODO_ROLE, period: TODO_DATES,
        summary: 'Replace this with a sentence or two about the job.',
        highlights: [TODO_HIGHLIGHT], tags: ['Service'], lat: -4, lon: -36,
        story: [
            'Test paragraph one.',
        ],
        images: [],
        links: [
            { label: 'Test link', url: 'https://example.com' },
        ],
    },
    {
        id: 'floral', planetId: 'food', name: 'Floral Design & Delivery',
        role: TODO_ROLE, period: TODO_DATES,
        summary: 'Replace this with a sentence or two about the job.',
        highlights: [TODO_HIGHLIGHT], tags: ['Design', 'Delivery'], lat: -16, lon: 6,
        story: [
            'Test paragraph one.',
        ],
        images: [],
        links: [
            { label: 'Test link', url: 'https://example.com' },
        ],
    },
    {
        id: 'doordash', planetId: 'food', name: 'DoorDash',
        role: TODO_ROLE, period: TODO_DATES,
        summary: 'Replace this with a sentence or two about the work.',
        highlights: [TODO_HIGHLIGHT], tags: ['Delivery'], lat: -28, lon: 30,
        story: [
            'Test paragraph one.',
        ],
        images: [],
        links: [
            { label: 'Test link', url: 'https://example.com' },
        ],
    },

    // ---------- PIXELON: Game Development ----------
    {
        id: 'exploring-digital', planetId: 'games', name: 'Exploring Digital',
        role: 'Game Developer', period: '2022 - 2024',
        summary: 'Unity VR 4D experiences: C# scripting, motion capture integration, story, music, and 3D art.',
        highlights: [ 'This Role I poured my creativitiy into and wouldnt have traded it for the world.'], tags: ['Unity', 'C#', 'VR', 'Mocap'], lat: 16, lon: -24,
        story: [
            'This is where we poured our blood sweat and tears into to making fun 10min Experiences for a myriad of customers. My team and I worked hard to push out 8 different experiences in short timeframes to meet demands for clients. All around a ton of fun.',
        ],
        images: [
            { src: '/images/bases/exploring-digital/01.webp', alt: 'Describe what the photo shows' },
            { src: '/images/bases/exploring-digital/02.webp', alt: 'Describe what the photo shows' },
            { src: '/images/bases/exploring-digital/03.webp', alt: 'Describe what the photo shows' },
            { src: '/images/bases/exploring-digital/04.webp', alt: 'Describe what the photo shows' },
            { src: '/images/bases/exploring-digital/05.webp', alt: 'Describe what the photo shows' },
        ],
        links: [
            { label: 'Exploring Digital LinkedIn', url: 'https://www.linkedin.com/feed/update/urn:li:activity:7082071074850443264/' },
            { label: 'Art Station', url: 'https://www.artstation.com/redclay3d' },
            { label: 'Customer Advertisement', url: 'https://youtu.be/c-Fn51rVFog?si=E723qoJpRbVnUUYR' },
            { label: 'MegaVerse Website', url: 'https://www.megaversevr.com/website/home/?fbclid=IwY2xjawU8YpZleHRuA2FlbQIxMABwZG9mBXNydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR7zmxj18TH8ccdLy0B-fuAfakynO3UZo7Km6V1JVXyepvjMlJTz-pO0mXzRgA_aem_f-PuRgb9-MbiQdVOqbcU7A' },


        ],
    },
    {
        id: 'third-realm', planetId: 'games', name: '3rd Realm Creations',
        role: 'Virtual Production Technician', period: '2022 - 2024',
        summary: 'Virtual production in Unreal Engine with Rokoko mocap suits, Vive tracking, and LED volume walls.',
        highlights: [ 'Here is where I found my love with messing with tech new and old to make anything possible.'], 
        tags: ['Unreal Engine', 'Rokoko', 'Vive', 'LED volume'], lat: -10, lon: 18,
        story: [
            'Photos and links of fun and shenanigans we would get ourselves into to find our next big project.',
        ],
        images: [
            { src: '/images/bases/third-realm/01.webp', alt: 'Describe what the photo shows' },
            { src: '/images/bases/third-realm/02.webp', alt: 'Describe what the photo shows' },
            { src: '/images/bases/third-realm/03.webp', alt: 'Describe what the photo shows' },
            { src: '/images/bases/third-realm/04.webp', alt: 'Describe what the photo shows' },
            { src: '/images/bases/third-realm/05.webp', alt: 'Describe what the photo shows' },
            { src: '/images/bases/third-realm/06.webp', alt: 'Describe what the photo shows' },
            { src: '/images/bases/third-realm/07.webp', alt: 'Describe what the photo shows' },
        ],
        links: [
            { label: 'News Coverage', url: 'https://www.youtube.com/watch?v=J11-ZrFHg-M' },
            { label: 'Art Station', url: 'https://www.artstation.com/redclay3d' },
        ],
    },

    // ---------- CONDUIT: Technical Installation ----------
    // NDA: keep names generic unless you have cleared them.
    {
        id: 'soundwave', planetId: 'install', name: 'SoundWave Technologies',
        role: TODO_ROLE, period: TODO_DATES,
        summary: 'LED wall installs: panel prep, Cat6 runs and termination, power, and networking.',
        highlights: [TODO_HIGHLIGHT], tags: ['LED', 'Cat6', 'Power', 'Networking'], lat: 22, lon: -22,
        story: [
            'Test paragraph one.',
        ],
        images: [],
        links: [
            { label: 'Test link', url: 'https://example.com' },
        ],
    },
    {
        id: 'scoreboard', planetId: 'install', name: 'Stadium Scoreboard Install',
        role: TODO_ROLE, period: TODO_DATES,
        summary: 'LED scoreboard installation for a stadium.',
        highlights: [TODO_HIGHLIGHT], tags: ['LED', 'Install'], lat: 6, lon: 26,
        story: [
            'Test paragraph one.',
        ],
        images: [],
        links: [
            { label: 'Test link', url: 'https://example.com' },
        ],
    },
    {
        id: 'cabling', planetId: 'install', name: 'Structured Cabling & Networking',
        role: TODO_ROLE, period: TODO_DATES,
        summary: 'Structured cabling, cable termination, and small-network setup.',
        highlights: [TODO_HIGHLIGHT], tags: ['Cat6', 'Termination', 'Networking'], lat: -14, lon: -26,
        story: [
            'Test paragraph one.',
        ],
        images: [],
        links: [
            { label: 'Test link', url: 'https://example.com' },
        ],
    },
    {
        id: 'it-cert', planetId: 'install', name: 'Google IT Support Certificate',
        role: 'CERTIFICATION', period: TODO_DATES,
        summary: 'Replace this with a sentence or two about what you learned.',
        highlights: [TODO_HIGHLIGHT], tags: ['IT Support'], lat: -26, lon: 14,
        story: [
            'Test paragraph one.',
        ],
        images: [],
        links: [
            { label: 'Test link', url: 'https://example.com' },
        ],
    },
];