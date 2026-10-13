import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const RAW = 'raw-images';
const OUT = 'public/images/bases';
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

if (!existsSync(RAW)) {
    console.log('No raw-images folder yet. Create raw-images/<base-id>/ and put your photos in it.');
    process.exit(0);
}

for (const baseId of readdirSync(RAW)) {
    const dir = path.join(RAW, baseId);
    if (!statSync(dir).isDirectory()) continue;

    const files = readdirSync(dir)
        .filter((file) => EXTENSIONS.has(path.extname(file).toLowerCase()))
        .sort();
    if (files.length === 0) continue;

    const outDir = path.join(OUT, baseId);
    mkdirSync(outDir, { recursive: true });

    let n = 1;
    for (const file of files) {
        const name = String(n++).padStart(2, '0') + '.webp';
        // sharp drops metadata (including GPS) unless told to keep it.
        await sharp(path.join(dir, file))
            .rotate()
            .resize({ width: 1600, withoutEnlargement: true })
            .webp({ quality: 78 })
            .toFile(path.join(outDir, name));
        console.log(`${baseId}/${file} -> ${name}`);
    }
}