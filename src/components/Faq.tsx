import { useState } from 'react'
import { faq } from '../data/content'
import { Reveal } from './ui/Reveal'
import { IconChevron } from './ui/icons'
import { eyebrow, sectionTitle } from '../lib/styles'

export function Faq() {
  // Первый вопрос открыт — сразу видно, что блок раскрывается.
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="scroll-mt-24 py-18 md:py-24">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
          <Reveal>
            <p className={eyebrow}>Вопросы и ответы</p>
            <h2 className={`${sectionTitle} mt-4`}>Частые вопросы оптовых покупателей</h2>
            <p className="mt-4 max-w-md text-[1.02rem] leading-relaxed text-ink-soft">
              Если нужного ответа нет — опишите задачу в заявке, менеджер уточнит детали при
              расчёте.
            </p>
          </Reveal>

          <Reveal delay={90}>
            <ul className="divide-y divide-line border-y border-line">
              {faq.map((item, i) => {
                const isOpen = openIndex === i
                const panelId = `faq-panel-${i}`
                const buttonId = `faq-button-${i}`

                return (
                  <li key={item.q}>
                    <h3>
                      <button
                        type="button"
                        id={buttonId}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenIndex(isOpen ? null : i)}
                        className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left font-display text-[1.02rem] font-bold text-ink transition-colors duration-200 hover:text-forest md:text-[1.08rem]"
                      >
                        {item.q}
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-forest transition-transform duration-300 ${
                            isOpen ? 'rotate-180 bg-forest/8' : ''
                          }`}
                        >
                          <IconChevron className="h-5 w-5" />
                        </span>
                      </button>
                    </h3>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      hidden={!isOpen}
                      className="pb-6 pr-12"
                    >
                      <p className="text-[0.97rem] leading-relaxed text-ink-soft">{item.a}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
