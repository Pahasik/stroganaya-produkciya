import { steps } from '../data/content'
import { Reveal } from './ui/Reveal'
import { eyebrow, sectionTitle } from '../lib/styles'

export function Process() {
  return (
    <section id="process" className="scroll-mt-24 py-18 md:py-24">
      <div className="shell">
        <Reveal>
          <p className={eyebrow}>Как оформить заказ</p>
          <h2 className={`${sectionTitle} mt-4 max-w-2xl`}>Четыре шага от заявки до отгрузки</h2>
        </Reveal>

        <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 80} as="li">
              <div className="flex h-full flex-col border-t-2 border-forest pt-5">
                <span className="font-display text-[0.85rem] font-extrabold tracking-[0.14em] text-wood-ink">
                  ШАГ {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 text-[1.1rem]">{step.title}</h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
