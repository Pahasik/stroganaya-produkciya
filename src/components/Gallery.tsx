import { gallery } from '../data/content'
import { Picture } from './ui/Picture'
import { Reveal } from './ui/Reveal'
import { eyebrow, sectionTitle } from '../lib/styles'

export function Gallery() {
  return (
    <section id="gallery" className="scroll-mt-24 border-t border-line bg-sand py-18 md:py-24">
      <div className="shell">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className={eyebrow}>Галерея</p>
              <h2 className={`${sectionTitle} mt-4 max-w-xl`}>Продукция и производство</h2>
            </div>
            <p className="max-w-sm text-[0.9rem] leading-relaxed text-ink-soft">
              От строгальной линии и замера сечения до упаковки, склада и отгрузки партии.
            </p>
          </div>
        </Reveal>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((item, i) => (
            <Reveal key={item.caption} delay={(i % 3) * 80} as="li">
              <figure className="h-full">
                <div className="overflow-hidden rounded-xl border border-line bg-cream">
                  <Picture
                    name={item.image as 'texture'}
                    alt={item.alt}
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 48vw, 31vw"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
                <figcaption className="mt-3 text-[0.95rem] font-medium text-ink">
                  {item.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
