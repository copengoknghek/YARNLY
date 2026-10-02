import Icon from '@/components/common/Icon'
import '@/styles/components/QuantityInput.css'

interface QuantityInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  size?: 'md' | 'lg'
  label?: string
}

function QuantityInput({ value, onChange, min = 1, max = 99, size = 'md', label = 'Số lượng' }: QuantityInputProps) {
  const clamp = (next: number) => Math.min(max, Math.max(min, next))

  return (
    <div className={`quantity-input quantity-input--${size}`} role="group" aria-label={label}>
      <button
        type="button"
        className="quantity-input__button"
        aria-label="Giảm số lượng"
        disabled={value <= min}
        onClick={() => onChange(clamp(value - 1))}
      >
        <Icon name="minus" size={16} />
      </button>
      <input
        className="quantity-input__value"
        type="number"
        inputMode="numeric"
        aria-label={label}
        value={value}
        min={min}
        max={max}
        onChange={(event) => {
          const next = Number.parseInt(event.target.value, 10)
          if (!Number.isNaN(next)) onChange(clamp(next))
        }}
      />
      <button
        type="button"
        className="quantity-input__button"
        aria-label="Tăng số lượng"
        disabled={value >= max}
        onClick={() => onChange(clamp(value + 1))}
      >
        <Icon name="plus" size={16} />
      </button>
    </div>
  )
}

export default QuantityInput
