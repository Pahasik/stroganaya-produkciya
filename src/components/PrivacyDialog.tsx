import { useEffect, useRef } from 'react'
import { company } from '../data/content'
import { IconClose } from './ui/icons'

type PrivacyDialogProps = {
  open: boolean
  onClose: () => void
}

/**
 * Политика конфиденциальности в модальном окне на нативном <dialog>:
 * фокус-ловушка, закрытие по Esc и подложка обеспечиваются браузером.
 *
 * ВАЖНО: это рабочий шаблон, а не юридически проверенный документ.
 */
export function PrivacyDialog({ open, onClose }: PrivacyDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return

    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        // Клик по подложке (вне содержимого) закрывает окно.
        if (e.target === ref.current) onClose()
      }}
      aria-labelledby="privacy-title"
      className="m-auto w-[min(46rem,calc(100vw-2rem))] rounded-2xl border border-line bg-cream p-0 text-ink backdrop:bg-ink/60"
    >
      <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-line bg-cream px-6 py-5">
        <h2 id="privacy-title" className="text-[1.25rem]">
          Политика конфиденциальности
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть политику конфиденциальности"
          className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-line bg-card text-ink transition-colors duration-200 hover:border-forest/40"
        >
          <IconClose className="h-5 w-5" />
        </button>
      </div>

      <div className="max-h-[70vh] overflow-y-auto px-6 py-6 text-[0.95rem] leading-relaxed text-ink-soft">
        <p className="rounded-lg border border-wood/40 bg-wood/10 p-4 text-ink">
          Ниже приведён рабочий шаблон документа. Перед публикацией сайта его необходимо привести в
          соответствие с деятельностью организации и проверить у юриста.
        </p>

        <h3 className="mt-6 text-[1.02rem] text-ink">1. Общие положения</h3>
        <p className="mt-2">
          Настоящая политика описывает порядок обработки персональных данных, которые пользователь
          добровольно передаёт через форму заявки на этом сайте. Направляя заявку, пользователь
          подтверждает согласие с условиями настоящей политики.
        </p>

        <h3 className="mt-5 text-[1.02rem] text-ink">2. Какие данные обрабатываются</h3>
        <p className="mt-2">
          Обрабатываются данные, которые пользователь указывает в форме: имя, номер телефона,
          название компании (при заполнении), интересующая продукция, требуемый объём и текст
          комментария.
        </p>

        <h3 className="mt-5 text-[1.02rem] text-ink">3. Цель обработки</h3>
        <p className="mt-2">
          Данные обрабатываются исключительно для связи с пользователем по оставленной заявке:
          уточнения параметров партии, подготовки расчёта и согласования условий поставки.
        </p>

        <h3 className="mt-5 text-[1.02rem] text-ink">4. Передача данных третьим лицам</h3>
        <p className="mt-2">
          Данные не передаются третьим лицам, за исключением случаев, прямо предусмотренных
          законодательством Российской Федерации.
        </p>

        <h3 className="mt-5 text-[1.02rem] text-ink">5. Отзыв согласия</h3>
        <p className="mt-2">
          Пользователь вправе отозвать согласие на обработку персональных данных, направив
          соответствующее обращение по контактным данным, указанным на сайте.
        </p>

        <h3 className="mt-5 text-[1.02rem] text-ink">6. Реквизиты</h3>
        <p className="mt-2">
          {company.activity}. Адрес производства: {company.addressFull}.
        </p>
        <p className="mt-2">
          {/* TODO(владелец сайта): добавить наименование организации, ИНН/ОГРН и контакты оператора данных. */}
          Наименование организации, регистрационные данные и контакты оператора персональных данных
          указываются владельцем сайта перед публикацией.
        </p>
      </div>
    </dialog>
  )
}
