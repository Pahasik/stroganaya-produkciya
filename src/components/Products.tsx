import { products, type Product } from '../data/content'
import { Picture } from './ui/Picture'
import { ProfileDrawing } from './ui/ProfileDrawing'
import { Reveal } from './ui/Reveal'
import { IconArrowRight } from './ui/icons'
import { btnPrimary, btnSecondary, eyebrow, sectionTitle } from '../lib/styles'

type ProductsProps = {
  onRequest: (product: string) => void
}

function Specs({ product }: { product: Product }) {
  return (
    <dl className="grid grid-cols-2 gap-x-5 gap-y-3 border-t border-line pt-5">
      {product.specs.map((spec) => (
        <div key={spec.label}>
          <dt className="text-[0.78rem] uppercase tracking-wide text-ink-soft">{spec.label}</dt>
          <dd className="mt-0.5 font-display text-[0.98rem] font-bold text-ink">{spec.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function Price({ product }: { product: Product }) {
  return (
    <div>
      <p className="font-display text-[1.4rem] font-extrabold text-forest">{product.price}</p>
      <p className="mt-1 text-[0.85rem] text-ink-soft">{product.priceNote}</p>
    </div>
  )
}

export function Products({ onRequest }: ProductsProps) {
  const featured = products.filter((p) => p.featured)
  const extra = products.filter((p) => !p.featured)

  return (
    <section id="products" className="scroll-mt-24 border-t border-line bg-sand py-18 md:py-24">
      <div className="shell">
        <Reveal>
          <p className={eyebrow}>Каталог</p>
          <h2 className={`${sectionTitle} mt-4 max-w-2xl`}>
            Что мы производим и отгружаем оптом
          </h2>
          <p className="mt-4 max-w-2xl text-[1.02rem] text-ink-soft">
            Основное направление — клеёная имитация бруса и клеёный планкен в сечении 20 × 135 мм.
            Дополнительно изготавливаем калиброванную и другую строганую продукцию.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {featured.map((product, i) => (
            <Reveal key={product.id} delay={i * 90}>
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card">
                <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                  <Picture
                    name={product.image as 'imitation-brusa'}
                    alt={product.imageAlt}
                    sizes="(max-width: 767px) 100vw, 46vw"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-forest px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white">
                    {product.tagline}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-5 p-6 md:p-7">
                  <div>
                    <h3 className="text-[1.35rem]">{product.name}</h3>
                    <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-soft">
                      {product.purpose}
                    </p>
                  </div>

                  {/* Чертёж сечения — тот же приём, что и на всём сайте */}
                  <div className="rounded-xl border border-line-soft bg-cream px-4 py-3">
                    <ProfileDrawing kind={product.profile} className="h-auto w-full" />
                  </div>

                  <Specs product={product} />

                  <div className="mt-auto flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-end sm:justify-between">
                    <Price product={product} />
                    <a
                      href="#order"
                      onClick={() => onRequest(product.formValue)}
                      className={btnPrimary}
                    >
                      Запросить расчёт
                      <IconArrowRight className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {extra.map((product) => (
          <Reveal key={product.id} delay={120}>
            <article className="mt-6 grid overflow-hidden rounded-2xl border border-line bg-card md:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
              <div className="relative aspect-[4/3] bg-sand md:aspect-auto md:min-h-full">
                <Picture
                  name={product.image as 'production'}
                  alt={product.imageAlt}
                  sizes="(max-width: 767px) 100vw, 40vw"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-5 p-6 md:p-8">
                <div>
                  <p className={eyebrow}>{product.tagline}</p>
                  <h3 className="mt-3 text-[1.35rem]">{product.name}</h3>
                  <p className="mt-3 max-w-2xl text-[0.98rem] leading-relaxed text-ink-soft">
                    {product.purpose}
                  </p>
                </div>

                <Specs product={product} />

                <div className="mt-auto flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-end sm:justify-between">
                  <Price product={product} />
                  <a
                    href="#order"
                    onClick={() => onRequest(product.formValue)}
                    className={btnSecondary}
                  >
                    Запросить цену
                    <IconArrowRight className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
