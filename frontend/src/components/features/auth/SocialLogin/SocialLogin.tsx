import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import '@/styles/components/SocialLogin.css'

const PROVIDERS = [
  { id: 'google', label: 'Google', icon: '/images/social/google.svg' },
  { id: 'facebook', label: 'Facebook', icon: '/images/social/facebook.svg' },
] as const

function SocialLogin() {
  const { t } = useTranslation()
  const [message, setMessage] = useState('')

  return (
    <div className="social-login">
      <p className="social-login__divider">
        <span>{t('auth.socialDivider')}</span>
      </p>
      <div className="social-login__buttons">
        {PROVIDERS.map((provider) => (
          <button
            key={provider.id}
            type="button"
            className="social-login__button"
            onClick={() => setMessage(t('auth.socialSoon', { provider: provider.label }))}
          >
            <img src={provider.icon} alt="" width={16} height={16} />
            {provider.label}
          </button>
        ))}
      </div>
      {message && (
        <p className="social-login__message" role="status">
          {message}
        </p>
      )}
    </div>
  )
}

export default SocialLogin
