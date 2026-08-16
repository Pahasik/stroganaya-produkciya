/** Общие классы кнопок. Минимальная высота 48px — комфортная зона нажатия. */
const base =
  'inline-flex items-center justify-center gap-2 min-h-12 px-6 py-3 rounded-lg font-semibold text-[0.95rem] leading-tight text-center cursor-pointer select-none transition-colors duration-200'

export const btnPrimary = `${base} bg-forest text-white hover:bg-forest-hover`

export const btnSecondary = `${base} bg-transparent text-forest border border-forest/30 hover:border-forest hover:bg-forest/5`

/** Кнопка на тёмно-зелёной поверхности. */
export const btnOnDark = `${base} bg-cream text-forest hover:bg-white`

export const btnOnDarkGhost = `${base} bg-transparent text-white border border-white/30 hover:border-white/70 hover:bg-white/10`

/** Надзаголовок секции: короткая метка над h2. */
export const eyebrow =
  'inline-flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-wood-ink'

export const sectionTitle = 'text-[clamp(1.75rem,4vw,2.75rem)]'
