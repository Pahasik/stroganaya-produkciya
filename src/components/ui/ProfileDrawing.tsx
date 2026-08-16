import type { ProfileKind } from '../../data/content'

type ProfileDrawingProps = {
  kind: ProfileKind
  /** Показывать размерные линии 135 × 20 мм. Для продукции «по запросу» — выключено. */
  showDimensions?: boolean
  className?: string
}

/*
  Фирменный приём сайта: технический чертёж сечения доски.
  Все размеры соответствуют заявленному сечению 20 × 135 мм
  (масштаб 2 px на 1 мм, поэтому 260 × 40 px в системе координат SVG).
*/

/** Имитация бруса: паз слева, шип справа, фаска по лицевой кромке. */
const IMITATION_PATH = [
  'M 40 24',
  'L 294 24',
  'L 294 38',
  'L 308 38',
  'L 308 50',
  'L 294 50',
  'L 294 64',
  'L 34 64',
  'L 34 50',
  'L 48 50',
  'L 48 38',
  'L 34 38',
  'L 34 30',
  'Z',
].join(' ')

export function ProfileDrawing({
  kind,
  showDimensions = true,
  className = '',
}: ProfileDrawingProps) {
  return (
    <svg
      viewBox="0 0 330 104"
      className={className}
      role="img"
      aria-label={
        kind === 'imitation'
          ? 'Схема сечения имитации бруса: паз, шип и фаска по лицевой кромке, 20 на 135 мм'
          : kind === 'planken'
            ? 'Схема сечения планкена: плоская доска со скруглёнными кромками, 20 на 135 мм'
            : 'Схема сечения строганой доски'
      }
    >
      {/* Сечение доски */}
      {kind === 'imitation' ? (
        <path
          d={IMITATION_PATH}
          fill="var(--color-wood)"
          fillOpacity="0.16"
          stroke="var(--color-forest)"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      ) : (
        <rect
          x="34"
          y="24"
          width="260"
          height="40"
          rx={kind === 'planken' ? 9 : 2}
          fill="var(--color-wood)"
          fillOpacity="0.16"
          stroke="var(--color-forest)"
          strokeWidth="1.6"
        />
      )}

      {/* Лицевая поверхность — акцентная линия */}
      <line
        x1={kind === 'planken' ? 44 : 40}
        y1="24"
        x2={kind === 'imitation' ? 294 : 284}
        y2="24"
        stroke="var(--color-wood-ink)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {showDimensions && (
        <g
          stroke="var(--color-wood-ink)"
          strokeWidth="1"
          fill="none"
          opacity="0.75"
          aria-hidden="true"
        >
          {/* Размер по толщине (слева) */}
          <line x1="20" y1="24" x2="20" y2="64" />
          <line x1="16" y1="24" x2="24" y2="24" />
          <line x1="16" y1="64" x2="24" y2="64" />
          {/* Размер по ширине (снизу) */}
          <line x1="34" y1="86" x2="294" y2="86" />
          <line x1="34" y1="82" x2="34" y2="90" />
          <line x1="294" y1="82" x2="294" y2="90" />
        </g>
      )}

      {showDimensions && (
        <g
          fill="var(--color-wood-ink)"
          fontSize="11"
          fontWeight="600"
          fontFamily="var(--font-sans)"
          aria-hidden="true"
        >
          <text x="0" y="0" transform="translate(11 44) rotate(-90)" textAnchor="middle">
            20 мм
          </text>
          <text x="164" y="78" textAnchor="middle">
            135 мм
          </text>
        </g>
      )}
    </svg>
  )
}
