import { useTranslation } from 'react-i18next'
import type { CustomDesign } from '@/types/customDesign'

const INK = '#5f1d1d'
const SKIN = '#f6d7c3'
const LEAF = '#73a141'

function Base({ type, main, accent }: { type: string; main: string; accent: string }) {
  switch (type) {
    case 'doll':
      return (
        <g>
          <path d="M60 190 L75 120 H125 L140 190 Z" fill={accent} />
          <circle cx="100" cy="85" r="42" fill={main} />
          <circle cx="100" cy="95" r="32" fill={SKIN} />
          <path d="M68 82 Q100 45 132 82 Q118 66 100 70 Q82 66 68 82 Z" fill={main} />
          <circle cx="88" cy="96" r="4" fill={INK} />
          <circle cx="112" cy="96" r="4" fill={INK} />
          <circle cx="82" cy="106" r="5" fill="#f48aa0" opacity="0.6" />
          <circle cx="118" cy="106" r="5" fill="#f48aa0" opacity="0.6" />
        </g>
      )
    case 'bag':
      return (
        <g>
          <path d="M70 80 Q70 35 100 35 Q130 35 130 80" fill="none" stroke={accent} strokeWidth="10" strokeLinecap="round" />
          <rect x="40" y="75" width="120" height="105" rx="22" fill={main} />
          <rect x="40" y="105" width="120" height="14" fill={accent} />
          <circle cx="100" cy="112" r="10" fill="#fffae7" />
        </g>
      )
    case 'bouquet':
      return (
        <g>
          <path d="M100 185 L60 110 H140 Z" fill="#fffae7" stroke={accent} strokeWidth="4" />
          {[
            [70, 85],
            [100, 65],
            [130, 85],
            [100, 100],
          ].map(([cx, cy]) => (
            <g key={`${cx}-${cy}`}>
              {[0, 72, 144, 216, 288].map((angle) => (
                <circle
                  key={angle}
                  cx={cx + 12 * Math.cos((angle * Math.PI) / 180)}
                  cy={cy + 12 * Math.sin((angle * Math.PI) / 180)}
                  r="10"
                  fill={main}
                />
              ))}
              <circle cx={cx} cy={cy} r="7" fill={accent} />
            </g>
          ))}
          <path d="M60 120 Q50 100 62 98 M140 120 Q150 100 138 98" stroke={LEAF} strokeWidth="6" fill="none" />
        </g>
      )
    default:
      return (
        <g>
          <circle cx="58" cy="62" r="22" fill={main} />
          <circle cx="142" cy="62" r="22" fill={main} />
          <circle cx="58" cy="62" r="11" fill={accent} />
          <circle cx="142" cy="62" r="11" fill={accent} />
          <circle cx="100" cy="110" r="64" fill={main} />
          <ellipse cx="100" cy="128" rx="26" ry="20" fill="#fffae7" />
          <circle cx="78" cy="102" r="6" fill={INK} />
          <circle cx="122" cy="102" r="6" fill={INK} />
          <ellipse cx="100" cy="122" rx="7" ry="5" fill={INK} />
          <circle cx="68" cy="124" r="7" fill="#f48aa0" opacity="0.55" />
          <circle cx="132" cy="124" r="7" fill="#f48aa0" opacity="0.55" />
        </g>
      )
  }
}

function Accessory({ type, accent }: { type: string; accent: string }) {
  switch (type) {
    case 'bow':
      return (
        <g transform="translate(140 40)">
          <path d="M0 0 L-22 -14 L-22 14 Z M0 0 L22 -14 L22 14 Z" fill={accent} stroke={INK} strokeWidth="1.5" />
          <circle r="6" fill={accent} stroke={INK} strokeWidth="1.5" />
        </g>
      )
    case 'hat':
      return (
        <g>
          <path d="M70 52 L100 8 L130 52 Z" fill={accent} stroke={INK} strokeWidth="1.5" />
          <circle cx="100" cy="8" r="7" fill="#fffae7" stroke={INK} strokeWidth="1.5" />
        </g>
      )
    case 'scarf':
      return (
        <g>
          <rect x="48" y="150" width="104" height="18" rx="9" fill={accent} stroke={INK} strokeWidth="1.5" />
          <rect x="120" y="160" width="16" height="32" rx="6" fill={accent} stroke={INK} strokeWidth="1.5" />
        </g>
      )
    case 'flower':
      return (
        <g transform="translate(58 150)">
          {[0, 72, 144, 216, 288].map((angle) => (
            <circle
              key={angle}
              cx={9 * Math.cos((angle * Math.PI) / 180)}
              cy={9 * Math.sin((angle * Math.PI) / 180)}
              r="7"
              fill={accent}
            />
          ))}
          <circle r="5" fill="#ffe373" />
        </g>
      )
    default:
      return null
  }
}

const STYLE_SCALE: Record<string, number> = { chibi: 1, realistic: 0.95, mini: 0.78 }

function DesignIllustration({ design }: { design: CustomDesign }) {
  const { t } = useTranslation()
  const scale = STYLE_SCALE[design.style] ?? 1
  const text = design.text?.trim()

  return (
    <svg viewBox="0 0 200 220" role="img" aria-label={t('customDesign.previewIllustration')}>
      <g transform={`translate(${100 - 100 * scale} ${100 - 100 * scale}) scale(${scale})`}>
        <Base type={design.baseProduct} main={design.mainColor} accent={design.accentColor} />
        <Accessory type={design.accessory} accent={design.accentColor} />
      </g>
      {text && (
        <text x="100" y="212" textAnchor="middle" fontSize="15" fontFamily="Montserrat, sans-serif" fontWeight="600" fill={INK}>
          {text}
        </text>
      )}
    </svg>
  )
}

export default DesignIllustration
