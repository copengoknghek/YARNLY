import { PAYMENT_METHODS } from '@/constants/payments'
import type { PaymentMethod } from '@/types/order'
import '@/styles/components/PaymentMethods.css'

interface PaymentMethodsProps {
  value: PaymentMethod | ''
  onChange: (value: PaymentMethod) => void
  error?: string
}

function PaymentMethods({ value, onChange, error }: PaymentMethodsProps) {
  return (
    <fieldset className="payment-methods">
      <legend className="payment-methods__title">Phương thức thanh toán</legend>
      <div className="payment-methods__list">
        {PAYMENT_METHODS.map((method) => (
          <label key={method.value} className="payment-methods__option">
            <input
              type="radio"
              name="payment-method"
              value={method.value}
              checked={value === method.value}
              onChange={() => onChange(method.value)}
            />
            <span className="payment-methods__label">{method.label}</span>
            <img src={method.logo} alt="" className="payment-methods__logo" />
          </label>
        ))}
      </div>
      {error && <p className="payment-methods__error">{error}</p>}
    </fieldset>
  )
}

export default PaymentMethods
