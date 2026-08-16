import { terms } from '../data/content'
import { Reveal } from './ui/Reveal'
import { IconArrowRight } from './ui/icons'
import { btnOnDark, sectionTitle } from '../lib/styles'

export function Terms() {
  return (
    <section
      id="terms"
      className="on-dark relative scroll-mt-24 overflow-hidden bg-forest py-18 text-white md:py-24"
    >
      <div
        aria-hidden="true"
        className="blueprint-grid pointer-events-none absolute inset-0 opacity-25"
      />

      <div className="shell relative">
        <Reveal>
          <p className="inline-flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-wood-light">
            Оптовые условия
          </p>
          <h2 className={`${sectionTitle} mt-4 max-w-2xl text-white`}>
            Работаем только оптом — условия прозрачны с первой заявки
          </h2>
        </Reveal>

        <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-white/15 sm:grid-cols-2 lg:grid-cols-3">
          {terms.map((term, i) => (
            <Reveal key={term.title} delay={(i % 3) * 80} className="bg-forest" as="li">
              <div className="h-full p-6 md:p-7">
                <p className="font-display text-[1.5rem] font-extrabold leading-tight text-wood-light">
                  {term.title}
                </p>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-white/80">{term.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal>
          <div className="mt-10 flex flex-col items-start gap-5 border-t border-white/15 pt-8 md:flex-row md:items-center md:justify-between">
            <p className="max-w-xl text-[1.02rem] text-white/80">
              Расскажите про объект и объём — подготовим расчёт партии с учётом комплектации.
            </p>
            <a href="#order" className={`${btnOnDark} w-full sm:w-auto`}>
              Запросить расчёт партии
              <IconArrowRight className="h-5 w-5" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
