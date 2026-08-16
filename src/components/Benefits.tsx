import { benefits, comparison } from '../data/content'
import { Reveal } from './ui/Reveal'
import { IconCheck, IconMinus } from './ui/icons'
import { eyebrow, sectionTitle } from '../lib/styles'

export function Benefits() {
  return (
    <section id="benefits" className="scroll-mt-24 py-18 md:py-24">
      <div className="shell">
        <Reveal>
          <p className={eyebrow}>Преимущества</p>
          <h2 className={`${sectionTitle} mt-4 max-w-3xl`}>
            Строганая продукция, с которой удобно работать
          </h2>
          <p className="mt-4 max-w-2xl text-[1.02rem] text-ink-soft">
            Клеёная конструкция решает главную проблему объекта — разброс геометрии внутри партии.
            Это одинаково важно для бригады на монтаже, для закупщика и для конечного заказчика.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, i) => (
            <Reveal key={benefit.id} delay={(i % 3) * 80} className="bg-card">
              <div className="flex h-full flex-col p-6 md:p-7">
                <span className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-wood-ink">
                  {benefit.audience}
                </span>
                <h3 className="mt-3 text-[1.15rem]">{benefit.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">{benefit.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Осторожное сравнение без числовых показателей */}
        <Reveal>
          <div className="mt-6 grid gap-6 rounded-2xl border border-line bg-sand p-6 md:grid-cols-2 md:p-8">
            <div>
              <h3 className="flex items-center gap-2.5 text-[1.05rem] text-ink-soft">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-card text-ink-soft">
                  <IconMinus className="h-4.5 w-4.5" />
                </span>
                {comparison.solid.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {comparison.solid.items.map((item) => (
                  <li
                    key={item}
                    className="border-l-2 border-line pl-4 text-[0.95rem] leading-relaxed text-ink-soft"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="flex items-center gap-2.5 text-[1.05rem] text-forest">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest text-white">
                  <IconCheck className="h-4.5 w-4.5" />
                </span>
                {comparison.glued.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {comparison.glued.items.map((item) => (
                  <li
                    key={item}
                    className="border-l-2 border-wood pl-4 text-[0.95rem] leading-relaxed text-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
