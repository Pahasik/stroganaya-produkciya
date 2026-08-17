import { useEffect, useState } from 'react'
import { contacts } from '../data/content'
import { IconPhone } from './ui/icons'

/**
 * Закреплённая панель внизу экрана на мобильных.
 * Появляется после первого экрана и прячется, когда посетитель уже
 * дошёл до формы заявки — там кнопка и так перед глазами.
 */
export function MobileCta() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const order = document.getElementById('order')

    const update = () => {
      const pastHero = window.scrollY > 520
      const orderTop = order?.getBoundingClientRect().top ?? Infinity
      const atForm = orderTop < window.innerHeight * 0.9
      setVisible(pastHero && !atForm)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 backdrop-blur-sm transition-transform duration-300 md:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      // Скрытую панель убираем из порядка табуляции
      inert={!visible || undefined}
    >
      <div className="flex gap-3 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <a
          href={contacts.phoneHref}
          className="inline-flex min-h-13 flex-1 items-center justify-center gap-2 rounded-lg border border-forest/30 bg-card px-4 font-semibold text-forest"
        >
          <IconPhone className="h-5 w-5" />
          Позвонить
        </a>
        <a
          href="#order"
          className="inline-flex min-h-13 flex-[1.3] items-center justify-center rounded-lg bg-forest px-4 font-display font-bold text-white"
        >
          Получить расчёт
        </a>
      </div>
    </div>
  )
}
