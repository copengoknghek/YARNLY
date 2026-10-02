import { useState, type FormEvent } from 'react'
import '@/styles/components/CouponInput.css'

function CouponInput() {
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(code.trim() ? 'Mã giảm giá không hợp lệ hoặc đã hết hạn.' : '')
  }

  return (
    <form className="coupon" onSubmit={handleSubmit}>
      <div className="coupon__row">
        <label htmlFor="coupon-code" className="visually-hidden">
          Mã giảm giá
        </label>
        <input
          id="coupon-code"
          className="coupon__input"
          placeholder="Mã giảm giá"
          value={code}
          onChange={(event) => {
            setCode(event.target.value)
            setMessage('')
          }}
        />
        <button type="submit" className="coupon__apply" disabled={!code.trim()}>
          Áp dụng
        </button>
      </div>
      {message && <p className="coupon__message">{message}</p>}
    </form>
  )
}

export default CouponInput
