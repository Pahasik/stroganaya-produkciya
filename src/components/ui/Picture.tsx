import manifest from '../../data/image-manifest.json'

type ImageName = keyof typeof manifest

type PictureProps = {
  name: ImageName
  alt: string
  /** Значение атрибута sizes — помогает браузеру выбрать нужную ширину. */
  sizes: string
  className?: string
  /** true — изображение первого экрана: грузится сразу и с высоким приоритетом. */
  priority?: boolean
}

/**
 * Адаптивное изображение в WebP с готовым srcset, LQIP-заглушкой
 * и зарезервированным соотношением сторон (без скачков вёрстки).
 */
export function Picture({ name, alt, sizes, className = '', priority = false }: PictureProps) {
  const entry = manifest[name]
  const widths = entry.widths as number[]
  // BASE_URL учитывает подкаталог на GitHub Pages и всегда заканчивается на «/».
  const base = import.meta.env.BASE_URL
  const srcSet = widths.map((w) => `${base}images/${name}-${w}.webp ${w}w`).join(', ')
  const fallback = `${base}images/${name}-${widths[widths.length - 1]}.webp`

  return (
    <img
      src={fallback}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={widths[widths.length - 1]}
      height={Math.round(widths[widths.length - 1] / entry.aspectRatio)}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      className={className}
      style={{
        backgroundImage: `url(${entry.lqip})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  )
}
