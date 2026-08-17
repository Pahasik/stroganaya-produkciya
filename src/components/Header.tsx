import { useEffect, useState } from 'react'
import { company, contacts, navItems } from '../data/content'
import { IconClose, IconMail, IconMenu, IconPhone } from './ui/icons'
import { Wordmark } from './ui/Logo'
import { btnPrimary } from '../lib/styles'

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
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? 'bg-cream/95 backdrop-blur-sm' : 'bg-cream/80'
      }`}
    >
      {/* Верхняя полоса с контактами — телефон и почта видны сразу */}
      <div className="hidden border-b border-line-soft bg-sand/70 lg:block">
        <div className="shell flex h-10 items-center justify-between gap-6 text-[0.85rem]">
          <p className="text-ink-soft">{company.slogan}</p>
          <div className="flex items-center gap-6">
          <a
            href={contacts.phoneHref}
            className="inline-flex items-center gap-2 font-semibold text-ink transition-colors duration-200 hover:text-forest"
          >
            <IconPhone className="h-4 w-4 text-wood-ink" />
            {contacts.phone}
          </a>
          <a
            href={contacts.emailHref}
            className="inline-flex items-center gap-2 text-ink-soft transition-colors duration-200 hover:text-forest"
          >
            <IconMail className="h-4 w-4 text-wood-ink" />
            {contacts.email}
          </a>
          </div>
        </div>
      </div>

      <div
        className={`shell flex h-20 items-center justify-between gap-4 border-b transition-colors duration-300 ${
          scrolled || open ? 'border-line' : 'border-transparent'
        }`}
      >
        <a href="#top" className="rounded-md py-1" aria-label={`${company.name} — на главную`}>
          <Wordmark withSlogan={false} />
        </a>

        <nav aria-label="Основная навигация" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="inline-flex min-h-11 items-center whitespace-nowrap rounded-md px-3 text-[0.95rem] font-medium text-ink-soft transition-colors duration-200 hover:text-forest"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* На узких экранах вместо длинной кнопки — быстрый звонок */}
          <a
            href={contacts.phoneHref}
            aria-label={`Позвонить: ${contacts.phone}`}
            className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-line bg-card text-forest transition-colors duration-200 hover:border-forest/40 md:hidden"
          >
            <IconPhone className="h-5 w-5" />
          </a>

          {/*
            `max-md:hidden`, а не `hidden md:inline-flex`: базовый класс кнопки уже содержит
            `inline-flex`, и в порядке утилит Tailwind он перебивает безусловный `hidden`.
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

          <a href="#order" onClick={() => setOpen(false)} className={`${btnPrimary} mt-5 w-full`}>
            Получить оптовое предложение
          </a>

          <div className="mt-6 flex flex-col gap-1 border-t border-line pt-5">
            <a
              href={contacts.phoneHref}
              className="inline-flex min-h-12 items-center gap-3 font-display text-[1.1rem] font-bold text-ink"
            >
              <IconPhone className="h-5 w-5 text-wood-ink" />
              {contacts.phone}
            </a>
            <a
              href={contacts.emailHref}
              className="inline-flex min-h-12 items-center gap-3 text-[0.98rem] text-ink-soft"
            >
              <IconMail className="h-5 w-5 text-wood-ink" />
              {contacts.email}
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}
