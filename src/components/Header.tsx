import { useEffect, useState } from 'react'
import { company, navItems } from '../data/content'
import { IconClose, IconMenu } from './ui/icons'
import { btnPrimary } from '../lib/styles'

/** Небольшой знак — сечение доски, тот же приём, что и в чертежах продукции. */
function Wordmark() {
  return (
    <a
      href="#top"
      className="flex items-center gap-3 rounded-md py-1 pr-2 text-left"
      aria-label={`${company.wordmark} — на главную`}
    >
      <svg viewBox="0 0 28 28" className="h-8 w-8 shrink-0" aria-hidden="true" focusable="false">
        <rect x="1" y="1" width="26" height="26" rx="5" fill="var(--color-forest)" />
        <g stroke="var(--color-wood-light)" strokeWidth="1.7" strokeLinecap="round">
          <path d="M6 10h16M6 14h16M6 18h16" />
        </g>
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.05rem] font-extrabold tracking-tight text-ink">
          {company.wordmark}
        </span>
        <span className="mt-1 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-ink-soft">
          {company.wordmarkNote}
        </span>
      </span>
    </a>
  )
}

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Пока открыто мобильное меню — блокируем прокрутку страницы и слушаем Esc.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open
          ? 'border-line bg-cream/95 backdrop-blur-sm'
          : 'border-transparent bg-cream/80'
      }`}
    >
      <div className="shell flex h-20 items-center justify-between gap-4">
        <Wordmark />

        <nav aria-label="Основная навигация" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="inline-flex min-h-11 items-center rounded-md px-3 text-[0.95rem] font-medium text-ink-soft transition-colors duration-200 hover:text-forest"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/*
            `max-md:hidden`, а не `hidden md:inline-flex`: базовый класс кнопки уже содержит
            `inline-flex`, и в порядке утилит Tailwind он перебивает безусловный `hidden`.
            Вариант с медиазапросом выигрывает гарантированно.
          */}
          <a href="#order" className={`${btnPrimary} max-md:hidden`}>
            Получить оптовое предложение
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-line bg-card text-ink transition-colors duration-200 hover:border-forest/40 lg:hidden"
          >
            {open ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Мобильная навигация */}
      {/* Панель занимает оставшуюся высоту экрана, чтобы содержимое страницы не просвечивало. */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="h-[calc(100dvh-5rem)] overflow-y-auto border-t border-line bg-cream lg:hidden"
      >
        <nav aria-label="Мобильная навигация" className="shell py-4">
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.id} className="border-b border-line-soft last:border-b-0">
                <a
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="flex min-h-14 items-center text-[1.05rem] font-medium text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#order"
            onClick={() => setOpen(false)}
            className={`${btnPrimary} mt-5 w-full`}
          >
            Получить оптовое предложение
          </a>
        </nav>
      </div>
    </header>
  )
}
