import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import '@/styles/components/CouponInput.css'

function CouponInput() {
  const { t } = useTranslation()
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(code.trim() ? t('order.coupon.invalid') : '')
  }

  return (
    <form className="coupon" onSubmit={handleSubmit}>
      <div className="coupon__row">
        <label htmlFor="coupon-code" className="visually-hidden">
          {t('order.coupon.label')}
        </label>
        <input
          id="coupon-code"
          className="coupon__input"
          placeholder={t('order.coupon.placeholder')}
          value={code}
          onChange={(event) => {
            setCode(event.target.value)
            setMessage('')
          }}
        />
        <button type="submit" className="coupon__apply" disabled={!code.trim()}>
          {t('order.coupon.apply')}
        </button>
      </div>
      {message && <p className="coupon__message">{message}</p>}
    </form>
  )
}

export default CouponInput
