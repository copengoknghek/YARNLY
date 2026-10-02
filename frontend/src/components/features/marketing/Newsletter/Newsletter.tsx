import { useState, type FormEvent } from 'react'
import Icon from '@/components/common/Icon'
import { isValidEmail } from '@/utils/validators'
import '@/styles/components/Newsletter.css'

function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'error' | 'done'>('idle')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isValidEmail(email)) {
      setStatus('error')
      return
    }
    setStatus('done')
    setEmail('')
  }

  return (
    <section className="newsletter">
      <h2 className="newsletter__title">
        Nhập email để nhận các thông tin khuyến mãi mới nhất từ Yarnly
      </h2>
      <form className="newsletter__form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="newsletter-email" className="visually-hidden">
          Email của bạn
        </label>
        <input
          id="newsletter-email"
          type="email"
          className="newsletter__input"
          placeholder="Email của bạn"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            setStatus('idle')
          }}
        />
        <button type="submit" className="newsletter__submit" aria-label="Đăng ký nhận tin">
          <Icon name="arrow-right" size={32} strokeWidth={1.2} />
        </button>
      </form>
      {status === 'error' && <p className="newsletter__message text-error">Email không hợp lệ.</p>}
      {status === 'done' && (
        <p className="newsletter__message">Cảm ơn bạn đã đăng ký nhận tin từ Yarnly!</p>
      )}
    </section>
  )
}

export default Newsletter
