import { keyFacts } from '../data/content'
import { Picture } from './ui/Picture'
import { IconArrowDown, IconArrowRight } from './ui/icons'
import { btnPrimary, btnSecondary } from '../lib/styles'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-16 md:pt-32 lg:pt-36 lg:pb-24">
      {/* Техническая сетка — сдержанный фирменный фон первого экрана */}
      <div
        aria-hidden="true"
        className="blueprint-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
      />

      <div className="shell relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-wood/40 bg-card/70 px-4 py-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-wood-ink">
              Производство · оптовые поставки
            </p>

            <h1 className="mt-6 text-[clamp(2rem,5.4vw,3.6rem)]">
              Клеёная имитация бруса и планкен оптом от производителя
            </h1>

            <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-ink-soft md:text-[1.15rem]">
              Стабильная геометрия, удобный монтаж и комплектация партии под требования вашего
              объекта.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#order" className={btnPrimary}>
                Рассчитать оптовый заказ
                <IconArrowRight className="h-5 w-5" />
              </a>
              <a href="#products" className={btnSecondary}>
                Посмотреть продукцию
                <IconArrowDown className="h-5 w-5" />
              </a>
            </div>

          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-line bg-sand shadow-[0_24px_60px_-32px_rgba(23,35,29,0.45)]">
              <Picture
                name="hero-stack"
                alt="Ровные пачки сухой строганой продукции в светлом производственном помещении"
                sizes="(max-width: 1023px) 100vw, 46vw"
                priority
                className="block h-full w-full object-cover"
              />
            </div>

            <p className="mt-3 text-[0.78rem] text-ink-soft/80">Изображение для демонстрации</p>
          </div>
        </div>

        {/* Ключевые условия — на всю ширину, чтобы значения не переносились */}
        <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-line pt-8 md:grid-cols-4 lg:mt-16">
          {keyFacts.map((fact) => (
            <div key={fact.label}>
              <dt className="font-display text-[1.15rem] font-extrabold leading-tight text-forest lg:text-[1.35rem]">
                {fact.value}
              </dt>
              <dd className="mt-2 text-[0.88rem] leading-snug text-ink-soft">{fact.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
