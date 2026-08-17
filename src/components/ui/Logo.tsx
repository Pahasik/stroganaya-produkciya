type LogoMarkProps = { className?: string }

/**
 * Знак «Костромского Профиля».
 *
 * Идея: торец клеёной доски. Три ламели, разделённые тонкими линиями склейки,
 * и профиль справа — шип, как на настоящем сечении. Тот же язык, что и в
 * технических чертежах продукции на сайте.
 */
export function LogoMark({ className = '' }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="7" fill="var(--color-forest)" />
      <g fill="var(--color-wood-light)">
        {/* Верхняя ламель со снятой фаской — лицевая сторона */}
        <path d="M9 8.5h11.5v4.6H9a1 1 0 0 1-1-1v-2a1.6 1.6 0 0 1 .5-1.15z" />
        {/* Средняя ламель с шипом */}
        <path d="M8 14.1h12.5v1.35H24v2.1h-3.5v1.35H8z" />
        {/* Нижняя ламель */}
        <rect x="8" y="19.9" width="12.5" height="4.6" rx="1" />
      </g>
    </svg>
  )
}

type WordmarkProps = {
  /** Показывать слоган под названием. */
  withSlogan?: boolean
  className?: string
}

export function Wordmark({ withSlogan = true, className = '' }: WordmarkProps) {
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <LogoMark className="h-9 w-9 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.02rem] font-extrabold tracking-tight text-ink">
          Костромской Профиль
        </span>
        {withSlogan && (
          <span className="mt-1 text-[0.7rem] leading-tight font-medium text-ink-soft">
            Строганая продукция, с которой удобно работать
          </span>
        )}
      </span>
    </span>
  )
}
