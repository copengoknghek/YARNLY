import { type CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import type { YarnColorOption } from '@/types/customDesign'

interface ColorSwatchesProps {
  label: string
  colors: YarnColorOption[]
  value: string
  onChange: (color: YarnColorOption) => void
}

function ColorSwatches({ label, colors, value, onChange }: ColorSwatchesProps) {
  const { t } = useTranslation()

  return (
    <div className="design-form__field">
      <span className="design-form__label">{label}</span>
      <div className="design-form__swatches" role="radiogroup" aria-label={label}>
        {colors.map((color) => {
          const active = value === color.id
          return (
            <button
              key={color.id}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={color.name}
              title={color.inStock ? color.name : t('customDesign.outOfStock')}
              disabled={!color.inStock}
              className={`design-form__swatch ${active ? 'design-form__swatch--active' : ''} ${!color.inStock ? 'design-form__swatch--disabled' : ''}`}
              style={{ '--swatch-color': color.hex } as CSSProperties}
              onClick={() => onChange(color)}
            />
          )
        })}
      </div>
    </div>
  )
}

export default ColorSwatches
