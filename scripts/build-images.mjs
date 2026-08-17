/**
 * Готовит оптимизированные изображения для сайта.
 *
 * Источник: raw-images/*.png (исходники, сгенерированные для демонстрации).
 * Результат: public/images/<name>-<width>.webp + LQIP-заглушки.
 *
 * Запуск: npm run images
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(root, 'raw-images')
const OUT = path.join(root, 'public', 'images')

/** Ширины, под которые режем каждое изображение. */
const SOURCES = [
  { file: '01-hero.png', name: 'hero-stack', widths: [640, 960, 1280] },
  { file: '02-imitation.png', name: 'imitation-brusa', widths: [640, 960, 1280] },
  { file: '20-planken-a.png', name: 'planken', widths: [640, 960, 1280] },
  { file: '12-equipment.png', name: 'equipment', widths: [640, 960, 1280] },
  { file: '13-packs-branded.png', name: 'packs', widths: [640, 960] },
  { file: '11-workshop.png', name: 'workshop', widths: [640, 960] },
  { file: '15-measuring.png', name: 'measuring', widths: [640, 960] },
  { file: '16-packaging.png', name: 'packaging', widths: [640, 960] },
  { file: '18-warehouse.png', name: 'warehouse', widths: [640, 960] },
  { file: '17-loading.png', name: 'loading', widths: [640, 960] },
  { file: '19-transport.png', name: 'transport', widths: [640, 960] },
  { file: '07-texture.png', name: 'texture', widths: [640, 1280] },
]

/** Отдельно — картинка для Open Graph (1200x630). */
const OG = { file: '01-hero.png', name: 'og-cover' }

async function run() {
  await mkdir(OUT, { recursive: true })
  const manifest = {}

  for (const { file, name, widths } of SOURCES) {
    const buf = await readFile(path.join(SRC, file))
    const meta = await sharp(buf).metadata()

    for (const w of widths) {
      const out = path.join(OUT, `${name}-${w}.webp`)
      await sharp(buf).resize({ width: w }).webp({ quality: 76, effort: 6 }).toFile(out)
    }

    // Крошечная размытая заглушка, чтобы не было мигания фона при загрузке.
    const lqip = await sharp(buf).resize({ width: 20 }).webp({ quality: 40 }).toBuffer()

    manifest[name] = {
      widths,
      aspectRatio: +(meta.width / meta.height).toFixed(4),
      lqip: `data:image/webp;base64,${lqip.toString('base64')}`,
    }
    console.log(`✓ ${name} (${widths.join(', ')})`)
  }

  const ogBuf = await readFile(path.join(SRC, OG.file))
  await sharp(ogBuf)
    .resize({ width: 1200, height: 630, fit: 'cover', position: 'centre' })
    .webp({ quality: 82 })
    .toFile(path.join(OUT, `${OG.name}.webp`))
  console.log('✓ og-cover')

  await writeFile(
    path.join(root, 'src', 'data', 'image-manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n',
  )
  console.log('✓ src/data/image-manifest.json')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
