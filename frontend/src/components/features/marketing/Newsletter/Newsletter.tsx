import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import Icon from '@/components/common/Icon'
import { isValidEmail } from '@/utils/validators'
import '@/styles/components/Newsletter.css'

function Newsletter() {
  const { t } = useTranslation()
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
      <h2 className="newsletter__title">{t('marketing.newsletter.title')}</h2>
      <form className="newsletter__form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="newsletter-email" className="visually-hidden">
          {t('marketing.newsletter.emailLabel')}
        </label>
        <input
          id="newsletter-email"
          type="email"
          className="newsletter__input"
          placeholder={t('marketing.newsletter.emailPlaceholder')}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            setStatus('idle')
          }}
        />
        <button type="submit" className="newsletter__submit" aria-label={t('marketing.newsletter.submit')}>
          <Icon name="arrow-right" size={32} strokeWidth={1.2} />
        </button>
      </form>
      {status === 'error' && <p className="newsletter__message text-error">{t('marketing.newsletter.invalidEmail')}</p>}
      {status === 'done' && <p className="newsletter__message">{t('marketing.newsletter.success')}</p>}
    </section>
  )
}

export default Newsletter
