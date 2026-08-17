import { heroConditions } from '../data/content'
import { Picture } from './ui/Picture'
import { IconArrowDown, IconArrowRight, IconCheck } from './ui/icons'
import { btnPrimary, btnSecondary } from '../lib/styles'

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-28 pb-16 md:pt-32 lg:pt-40 lg:pb-24"
    >
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

            <h1 className="mt-6 text-[clamp(1.9rem,4.4vw,3rem)]">
              Имитация бруса и планкен оптом — стабильная геометрия в каждой партии
            </h1>

            <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-ink-soft md:text-[1.15rem]">
              Ровная плоскость, точная кромка и комплектация партии под требования вашего объекта.
            </p>

            {/* Ключевые условия сразу под подзаголовком — цена видна без прокрутки */}
            <ul className="mt-6 flex flex-wrap gap-x-2.5 gap-y-2">
              {heroConditions.map((item, i) => (
                <li
                  key={item}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[0.88rem] font-semibold ${
                    i === 0
                      ? 'border-forest bg-forest text-white'
                      : 'border-line bg-card text-ink'
                  }`}
                >
                  {i !== 0 && <IconCheck className="h-4 w-4 shrink-0 text-wood-ink" />}
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-3 text-[0.82rem] text-ink-soft">
              Цена 2026 года. Калиброванная и другая строганая продукция — по запросу.
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
          </div>
        </div>
      </div>
    </section>
  )
}
