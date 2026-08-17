import { useEffect, useRef, useState, type FormEvent } from 'react'
import { contacts, productOptions } from '../data/content'
import {
  formatPhone,
  isValidPhone,
  NOSCRIPT_ENDPOINT,
  submitLead,
  type Lead,
} from '../lib/submitLead'
import { Reveal } from './ui/Reveal'
import { IconArrowRight, IconCheck, IconPhone, IconSpinner, IconWarning } from './ui/icons'
import { eyebrow, sectionTitle } from '../lib/styles'

type FieldName = keyof Lead | 'consent'
type Errors = Partial<Record<FieldName, string>>
type Status = 'idle' | 'submitting' | 'sent' | 'demo' | 'error'

const emptyLead: Lead = {
  name: '',
  phone: '',
  company: '',
  product: productOptions[0],
  volume: '',
  comment: '',
}

/** Человекочитаемые названия полей — используются в сводке ошибок. */
const fieldLabels: Record<FieldName, string> = {
  name: 'Имя',
  phone: 'Телефон',
  company: 'Компания',
  product: 'Интересующая продукция',
  volume: 'Объём, м³',
  comment: 'Комментарий',
  consent: 'Согласие на обработку персональных данных',
}

/** Обязательны только имя и телефон — остальное менеджер уточнит при звонке. */
function validate(lead: Lead, consent: boolean): Errors {
  const errors: Errors = {}

  if (lead.name.trim().length < 2) {
    errors.name = 'Укажите имя — не короче двух символов.'
  }

  if (!lead.phone.trim()) {
    errors.phone = 'Укажите телефон для связи.'
  } else if (!isValidPhone(lead.phone)) {
    errors.phone = 'Телефон должен содержать 11 цифр, например +7 (999) 123-45-67.'
  }

  // Объём необязателен, но если заполнен — должен быть числом
  if (lead.volume.trim()) {
    const volume = Number(lead.volume.replace(',', '.'))
    if (!Number.isFinite(volume) || volume <= 0) {
      errors.volume = 'Объём должен быть положительным числом.'
    }
  }

  if (!consent) {
    errors.consent = 'Без согласия на обработку данных мы не сможем принять заявку.'
  }

  return errors
}

type LeadFormProps = {
  preselectedProduct: string
  onOpenPrivacy: () => void
}

export function LeadForm({ preselectedProduct, onOpenPrivacy }: LeadFormProps) {
  const [lead, setLead] = useState<Lead>(emptyLead)
  // Галка проставлена заранее — посетитель может её снять.
  const [consent, setConsent] = useState(true)
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [failure, setFailure] = useState('')

  const summaryRef = useRef<HTMLDivElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  /** Защита от повторной отправки: держит состояние между рендерами. */
  const inFlight = useRef(false)
  /** Момент показа формы — ловушка для ботов, заполняющих форму мгновенно. */
  const mountedAt = useRef(Date.now())
  /** Honeypot: настоящий человек это поле не увидит и не заполнит. */
  const [honeypot, setHoneypot] = useState('')

  useEffect(() => {
    if (preselectedProduct) {
      setLead((prev) => ({ ...prev, product: preselectedProduct }))
    }
  }, [preselectedProduct])

  const set = <K extends keyof Lead>(key: K, value: Lead[K]) => {
    setLead((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  const blur = (key: FieldName) => {
    setTouched((prev) => ({ ...prev, [key]: true }))
    const current = validate(lead, consent)
    setErrors((prev) => (current[key] ? { ...prev, [key]: current[key] } : prev))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Уже отправляем — второй клик игнорируем
    if (inFlight.current) return

    // Ботовые отсечки: скрытое поле заполнено или форма отправлена мгновенно.
    // Показываем обычный успех, чтобы не подсказывать спамеру логику проверки.
    if (honeypot || Date.now() - mountedAt.current < 2500) {
      setStatus('sent')
      return
    }

    setFailure('')
    const found = validate(lead, consent)
    setErrors(found)
    setTouched({ name: true, phone: true, volume: true, consent: true })

    if (Object.keys(found).length > 0) {
      setStatus('idle')
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }

    inFlight.current = true
    setStatus('submitting')
    try {
      const result = await submitLead(lead)
      setStatus(result.status === 'sent' ? 'sent' : 'demo')
      requestAnimationFrame(() => resultRef.current?.focus())
    } catch (error) {
      setStatus('error')
      setFailure(
        error instanceof Error ? error.message : 'Не удалось отправить заявку.',
      )
      requestAnimationFrame(() => resultRef.current?.focus())
    } finally {
      inFlight.current = false
    }
  }

  function reset() {
    setLead(emptyLead)
    setConsent(true)
    setErrors({})
    setTouched({})
    setStatus('idle')
    setFailure('')
    mountedAt.current = Date.now()
  }

  const visibleErrors = (Object.keys(errors) as FieldName[]).filter((key) => touched[key])
  const submitting = status === 'submitting'

  const fieldClass = (key: FieldName) =>
    `w-full min-h-12 rounded-lg border bg-card px-4 py-3 text-[1rem] text-ink transition-colors duration-200 placeholder:text-ink-soft/60 ${
      errors[key] && touched[key] ? 'border-danger' : 'border-line hover:border-forest/40'
    }`

  const labelClass = 'block text-[0.9rem] font-semibold text-ink'
  const optional = <span className="font-normal text-ink-soft">— необязательно</span>
  const errorClass = 'mt-1.5 flex items-start gap-1.5 text-[0.85rem] text-danger'

  /* --------------------------- Успешный результат --------------------------- */
  if (status === 'sent' || status === 'demo') {
    return (
      <section id="order" className="scroll-mt-24 border-t border-line py-18 md:py-24">
        <div className="shell">
          <div
            ref={resultRef}
            tabIndex={-1}
            role="status"
            className="mx-auto max-w-2xl rounded-2xl border border-line bg-card p-8 text-center md:p-12"
          >
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest text-white">
              <IconCheck className="h-7 w-7" />
            </span>

            {status === 'sent' ? (
              <>
                <h2 className="mt-6 text-[1.6rem]">Заявка отправлена</h2>
                <p className="mt-4 text-[1rem] leading-relaxed text-ink-soft">
                  Мы получили ваши контакты. Менеджер свяжется с вами, чтобы уточнить объём и
                  комплектацию партии.
                </p>
                <p className="mt-4 text-[0.95rem] text-ink-soft">
                  Нужно быстрее? Позвоните:{' '}
                  <a
                    href={contacts.phoneHref}
                    className="font-semibold text-forest underline underline-offset-4"
                  >
                    {contacts.phone}
                  </a>
                </p>
              </>
            ) : (
              <>
                <h2 className="mt-6 text-[1.6rem]">Форма заполнена корректно</h2>
                <p className="mt-4 text-[1rem] leading-relaxed text-ink-soft">
                  Обработчик заявок не настроен, поэтому данные никуда не отправлены. Укажите адрес
                  обработчика, чтобы заявки уходили менеджеру.
                </p>
              </>
            )}

            <button
              type="button"
              onClick={reset}
              className="mt-8 cursor-pointer text-[0.95rem] font-semibold text-forest underline underline-offset-4 hover:text-forest-hover"
            >
              Отправить ещё одну заявку
            </button>
          </div>
        </div>
      </section>
    )
  }

  /* ------------------------------- Форма ------------------------------- */
  return (
    <section id="order" className="scroll-mt-24 border-t border-line py-18 md:py-24">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
          <Reveal>
            <p className={eyebrow}>Заявка</p>
            <h2 className={`${sectionTitle} mt-4`}>Получить расчёт оптовой партии</h2>
            <p className="mt-4 max-w-md text-[1.02rem] leading-relaxed text-ink-soft">
              Достаточно имени и телефона — остальное уточним при звонке. Менеджер подготовит
              расчёт под ваш объём и комплектацию.
            </p>

            <ul className="mt-8 space-y-3 text-[0.95rem] text-ink-soft">
              {[
                'Имитация бруса и планкен, сорт АБ — 34 000 ₽/м³',
                'Минимальная партия — от 10 м³',
                'Возможна отгрузка без сорта C и комплектация только 6 м',
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-wood-ink" />
                  {item}
                </li>
              ))}
            </ul>

            {/* Быстрая связь — не всем удобно заполнять форму */}
            <div className="mt-8 rounded-xl border border-line bg-sand p-5">
              <p className="text-[0.85rem] font-semibold uppercase tracking-[0.12em] text-wood-ink">
                Быстрая связь
              </p>
              <a
                href={contacts.phoneHref}
                className="mt-3 inline-flex items-center gap-2.5 font-display text-[1.3rem] font-extrabold text-ink hover:text-forest"
              >
                <IconPhone className="h-5 w-5 text-wood-ink" />
                {contacts.phone}
              </a>
              <p className="mt-2 text-[0.9rem] text-ink-soft">
                На этот же номер можно написать в{' '}
                <a
                  href={contacts.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-forest underline underline-offset-2"
                >
                  Telegram
                </a>{' '}
                и MAX.
              </p>
            </div>
          </Reveal>

          <Reveal delay={90}>
            {/*
              method="POST" и action заданы в разметке намеренно: если JavaScript
              не выполнится, форма всё равно уйдёт обработчику обычным POST,
              а не GET-перезагрузкой страницы с данными в адресной строке.
            */}
            <form
              onSubmit={handleSubmit}
              method="POST"
              action={NOSCRIPT_ENDPOINT}
              noValidate
              className="rounded-2xl border border-line bg-sand p-6 md:p-8"
            >
              {/* Ловушка для ботов: скрыта от людей, но видна автозаполнению спамеров */}
              <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
                <label htmlFor="field-website">Не заполняйте это поле</label>
                <input
                  id="field-website"
                  type="text"
                  name="_honey"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {visibleErrors.length > 0 && (
                <div
                  ref={summaryRef}
                  tabIndex={-1}
                  role="alert"
                  aria-labelledby="form-error-title"
                  className="mb-6 rounded-xl border border-danger/40 bg-danger-soft p-4"
                >
                  <h3
                    id="form-error-title"
                    className="flex items-center gap-2 text-[0.95rem] text-danger"
                  >
                    <IconWarning className="h-5 w-5 shrink-0" />
                    Проверьте заполнение формы
                  </h3>
                  <ul className="mt-2.5 space-y-1.5">
                    {visibleErrors.map((key) => (
                      <li key={key}>
                        <a
                          href={`#field-${key}`}
                          className="text-[0.88rem] text-danger underline underline-offset-2"
                        >
                          {fieldLabels[key]}: {errors[key]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {status === 'error' && (
                <div
                  ref={resultRef}
                  tabIndex={-1}
                  role="alert"
                  className="mb-6 rounded-xl border border-danger/40 bg-danger-soft p-4"
                >
                  <h3 className="flex items-center gap-2 text-[0.95rem] text-danger">
                    <IconWarning className="h-5 w-5 shrink-0" />
                    Заявка не отправлена
                  </h3>
                  <p className="mt-2 text-[0.88rem] text-danger">
                    {failure} Попробуйте ещё раз или позвоните нам: {contacts.phone}
                  </p>
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="field-name" className={labelClass}>
                    Имя <span className="text-danger">*</span>
                  </label>
                  <input
                    id="field-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={lead.name}
                    onChange={(e) => set('name', e.target.value)}
                    onBlur={() => blur('name')}
                    aria-invalid={Boolean(errors.name && touched.name)}
                    aria-describedby={errors.name && touched.name ? 'error-name' : undefined}
                    className={`mt-2 ${fieldClass('name')}`}
                    placeholder="Как к вам обращаться"
                  />
                  {errors.name && touched.name && (
                    <p id="error-name" className={errorClass}>
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="field-phone" className={labelClass}>
                    Телефон <span className="text-danger">*</span>
                  </label>
                  <input
                    id="field-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    value={lead.phone}
                    onChange={(e) => set('phone', formatPhone(e.target.value))}
                    onBlur={() => blur('phone')}
                    aria-invalid={Boolean(errors.phone && touched.phone)}
                    aria-describedby={errors.phone && touched.phone ? 'error-phone' : 'hint-phone'}
                    className={`mt-2 ${fieldClass('phone')}`}
                    placeholder="+7 (___) ___-__-__"
                  />
                  {errors.phone && touched.phone ? (
                    <p id="error-phone" className={errorClass}>
                      {errors.phone}
                    </p>
                  ) : (
                    <p id="hint-phone" className="mt-1.5 text-[0.82rem] text-ink-soft">
                      Можно написать в Telegram или MAX на этот же номер.
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="field-company" className={labelClass}>
                    Компания {optional}
                  </label>
                  <input
                    id="field-company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    value={lead.company}
                    onChange={(e) => set('company', e.target.value)}
                    className={`mt-2 ${fieldClass('company')}`}
                    placeholder="Название организации"
                  />
                </div>

                <div>
                  <label htmlFor="field-product" className={labelClass}>
                    Интересующая продукция {optional}
                  </label>
                  <select
                    id="field-product"
                    name="product"
                    value={lead.product}
                    onChange={(e) => set('product', e.target.value)}
                    className={`mt-2 cursor-pointer ${fieldClass('product')}`}
                  >
                    {productOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="field-volume" className={labelClass}>
                    Объём, м³ {optional}
                  </label>
                  <input
                    id="field-volume"
                    name="volume"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.1"
                    value={lead.volume}
                    onChange={(e) => set('volume', e.target.value)}
                    onBlur={() => blur('volume')}
                    aria-invalid={Boolean(errors.volume && touched.volume)}
                    aria-describedby={
                      errors.volume && touched.volume ? 'error-volume' : 'hint-volume'
                    }
                    className={`mt-2 ${fieldClass('volume')}`}
                    placeholder="например, 25"
                  />
                  {errors.volume && touched.volume ? (
                    <p id="error-volume" className={errorClass}>
                      {errors.volume}
                    </p>
                  ) : (
                    <p id="hint-volume" className="mt-1.5 text-[0.82rem] text-ink-soft">
                      Минимальная партия — от 10 м³.
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="field-comment" className={labelClass}>
                    Комментарий {optional}
                  </label>
                  <textarea
                    id="field-comment"
                    name="comment"
                    rows={3}
                    value={lead.comment}
                    onChange={(e) => set('comment', e.target.value)}
                    className={`mt-2 resize-y ${fieldClass('comment')}`}
                    placeholder="Объект, сроки, требования к комплектации: без сорта C, только 6 м и т. п."
                  />
                </div>
              </div>

              <div className="mt-6">
                {/*
                  Чекбокс и подпись разделены намеренно: интерактивная ссылка на политику
                  не должна находиться внутри <label>, иначе ломается доступное имя поля.
                */}
                <div className="flex items-start gap-3 text-[0.88rem] leading-relaxed text-ink-soft">
                  <input
                    id="field-consent"
                    name="consent"
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked)
                      if (e.target.checked) {
                        setErrors((prev) => {
                          const next = { ...prev }
                          delete next.consent
                          return next
                        })
                      }
                    }}
                    onBlur={() => blur('consent')}
                    aria-invalid={Boolean(errors.consent && touched.consent)}
                    aria-describedby={errors.consent && touched.consent ? 'error-consent' : undefined}
                    className="mt-0.5 h-6 w-6 shrink-0 cursor-pointer accent-[var(--color-forest)]"
                  />
                  <span>
                    <label htmlFor="field-consent" className="cursor-pointer">
                      Я согласен на обработку персональных данных и принимаю
                    </label>{' '}
                    <button
                      type="button"
                      onClick={onOpenPrivacy}
                      className="cursor-pointer font-semibold text-forest underline underline-offset-2"
                    >
                      политику конфиденциальности
                    </button>
                    .
                  </span>
                </div>
                {errors.consent && touched.consent && (
                  <p id="error-consent" className={errorClass}>
                    {errors.consent}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-7 inline-flex min-h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-forest px-6 py-3 font-display text-[1rem] font-bold text-white transition-colors duration-200 hover:bg-forest-hover disabled:cursor-progress disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <IconSpinner className="h-5 w-5 animate-spin" />
                    Отправляем…
                  </>
                ) : (
                  <>
                    Получить расчёт
                    <IconArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              <p className="mt-4 text-[0.8rem] leading-relaxed text-ink-soft">
                Поля со звёздочкой обязательны. Заявка — это запрос расчёта, а не оформление
                заказа.
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
