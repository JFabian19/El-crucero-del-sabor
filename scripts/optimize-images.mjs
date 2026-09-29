import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const imageDirectory = path.resolve('public/images');
const sourceNames = (await fs.readdir(imageDirectory))
  .filter(name => /\.(png|jpe?g)$/i.test(name));

for (const sourceName of sourceNames) {
  const sourcePath = path.join(imageDirectory, sourceName);
  const outputName = sourceName.replace(/\.(png|jpe?g)$/i, '.webp');
  const outputPath = path.join(imageDirectory, outputName);
  let pipeline = sharp(sourcePath).rotate();
  let webpOptions = { quality: 80, effort: 6, smartSubsample: true };

  if (sourceName.startsWith('category-')) {
    pipeline = pipeline.resize({ width: 1400, withoutEnlargement: true });
  } else if (/^(ceviche|cevichocho|chicharron|combos|trucha)\./i.test(sourceName)) {
    pipeline = pipeline.resize({ width: 1400, withoutEnlargement: true });
  } else if (sourceName === 'crucero-logo.png') {
    pipeline = pipeline.resize({ width: 512, withoutEnlargement: true });
    webpOptions = { quality: 92, effort: 6, smartSubsample: true };
  } else if (sourceName === 'cevichazo-logo.png') {
    pipeline = pipeline.resize({ width: 1000, withoutEnlargement: true });
    webpOptions = { lossless: true, effort: 6 };
  } else if (sourceName === 'crucero-giro.png') {
    webpOptions = { quality: 84, effort: 6, smartSubsample: true };
  } else if (sourceName === 'yape-qr.png') {
    webpOptions = { lossless: true, effort: 6 };
  }

  await pipeline.webp(webpOptions).toFile(outputPath);
}
