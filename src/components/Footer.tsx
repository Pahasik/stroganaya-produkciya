import { company, contacts, mapUrl, navItems } from '../data/content'
import { IconMail, IconMapPin, IconPhone } from './ui/icons'

type FooterProps = {
  onOpenPrivacy: () => void
}

export function Footer({ onOpenPrivacy }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="on-dark border-t border-forest-deep bg-forest-deep text-white/75">
      <div className="shell py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <p className="font-display text-[1.15rem] font-extrabold text-white">
              {company.wordmark}
            </p>
            <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed">{company.activity}</p>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-wood-light">
              Клеёная имитация бруса и клеёный планкен 20 × 135 мм — от 34 000 ₽/м³, партия от 10 м³.
            </p>
          </div>

          <nav aria-label="Навигация в подвале">
            <h2 className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-white">
              Разделы
            </h2>
            <ul className="mt-4 space-y-1">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="inline-flex min-h-11 items-center text-[0.95rem] transition-colors duration-200 hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#order"
                  className="inline-flex min-h-11 items-center text-[0.95rem] transition-colors duration-200 hover:text-white"
                >
                  Оставить заявку
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-white">
              Контакты
            </h2>
            <ul className="mt-4 space-y-4 text-[0.95rem]">
              <li className="flex items-start gap-3">
                <IconMapPin className="mt-0.5 h-5 w-5 shrink-0 text-wood-light" />
                <address className="not-italic leading-relaxed">
                  {company.addressFull}
                  <br />
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex min-h-11 items-center text-wood-light underline underline-offset-4 hover:text-white"
                  >
                    Открыть на карте
                  </a>
                </address>
              </li>
              {/* TODO(владелец сайта): заменить телефон и почту на реальные и сделать их ссылками tel:/mailto:. */}
              <li className="flex items-center gap-3">
                <IconPhone className="h-5 w-5 shrink-0 text-wood-light" />
                <span>{contacts.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <IconMail className="h-5 w-5 shrink-0 text-wood-light" />
                <span>{contacts.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-7 text-[0.85rem] md:flex-row md:items-center md:justify-between">
          <p>
            © {year} · {company.activity}
          </p>
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="inline-flex min-h-11 cursor-pointer items-center self-start underline underline-offset-4 transition-colors duration-200 hover:text-white md:self-auto"
          >
            Политика конфиденциальности
          </button>
        </div>
      </div>
    </footer>
  )
}
