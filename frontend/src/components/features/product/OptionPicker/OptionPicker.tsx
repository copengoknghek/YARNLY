import { useTranslation } from 'react-i18next'
import Icon from '@/components/common/Icon'
import '@/styles/components/OptionPicker.css'

interface OptionPickerProps {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
}

function OptionPicker({ label, options, value, onChange }: OptionPickerProps) {
  const { t } = useTranslation()
  const index = options.indexOf(value)
  const step = (delta: number) => onChange(options[(index + delta + options.length) % options.length])

  return (
    <fieldset className="option-picker">
      <legend className="option-picker__label">{label}</legend>
      <div className="option-picker__row">
        <button
          type="button"
          className="option-picker__arrow"
          aria-label={t('productDetail.optionPrev', { label })}
          onClick={() => step(-1)}
        >
          <Icon name="chevron-left" size={16} />
        </button>
        <div className="option-picker__options">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={`option-picker__option ${option === value ? 'option-picker__option--selected' : ''}`}
              aria-pressed={option === value}
              onClick={() => onChange(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="option-picker__arrow"
          aria-label={t('productDetail.optionNext', { label })}
          onClick={() => step(1)}
        >
          <Icon name="chevron-right" size={16} />
        </button>
      </div>
    </fieldset>
  )
}

export default OptionPicker
