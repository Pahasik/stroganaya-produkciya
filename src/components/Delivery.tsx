import { company, mapUrl } from '../data/content'
import { Picture } from './ui/Picture'
import { Reveal } from './ui/Reveal'
import { IconArrowRight, IconFactory, IconMapPin, IconTruck } from './ui/icons'
import { btnSecondary, eyebrow, sectionTitle } from '../lib/styles'

export function Delivery() {
  return (
    <section id="delivery" className="scroll-mt-24 border-t border-line bg-sand py-18 md:py-24">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <Reveal>
            <p className={eyebrow}>Доставка и география</p>
            <h2 className={`${sectionTitle} mt-4`}>Отгружаем собственным транспортом</h2>
            <p className="mt-4 max-w-xl text-[1.02rem] leading-relaxed text-ink-soft">
              У производства есть собственная доставка. Условия по конкретной партии — маршрут,
              транспорт и порядок отгрузки — согласовываем при расчёте заказа вместе с объёмом и
              комплектацией.
            </p>

            <ul className="mt-8 space-y-5">
              <li className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line bg-card text-forest">
                  <IconTruck className="h-5.5 w-5.5" />
                </span>
                <div>
                  <h3 className="text-[1.02rem]">Собственная доставка</h3>
                  <p className="mt-1 text-[0.93rem] leading-relaxed text-ink-soft">
                    Доставка организуется силами производства. Возможность и условия отгрузки на ваш
                    объект уточняются при расчёте.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line bg-card text-forest">
                  <IconFactory className="h-5.5 w-5.5" />
                </span>
                <div>
                  <h3 className="text-[1.02rem]">Отгрузка с производства</h3>
                  <p className="mt-1 text-[0.93rem] leading-relaxed text-ink-soft">
                    Партия комплектуется и отгружается напрямую с производственной площадки, без
                    посредников.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line bg-card text-forest">
                  <IconMapPin className="h-5.5 w-5.5" />
                </span>
                <div>
                  <h3 className="text-[1.02rem]">Адрес производства</h3>
                  <address className="mt-1 text-[0.93rem] not-italic leading-relaxed text-ink-soft">
                    {company.addressFull}
                  </address>
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${btnSecondary} mt-4`}
                  >
                    Открыть адрес на карте
                    <IconArrowRight className="h-5 w-5" />
                  </a>
                </div>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={100}>
            <div className="overflow-hidden rounded-2xl border border-line bg-cream">
              <Picture
                name="transport"
                alt="Загруженный тентованный полуприцеп с пачками строганой продукции готов к отправке"
                sizes="(max-width: 1023px) 100vw, 46vw"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
