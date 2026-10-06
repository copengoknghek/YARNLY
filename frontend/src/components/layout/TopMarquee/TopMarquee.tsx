import { useTranslation } from 'react-i18next'
import '@/styles/components/TopMarquee.css'

const REPEAT = 8

function TopMarquee() {
  const { t } = useTranslation()
  const message = t('topMarquee.message')

  const items = Array.from({ length: REPEAT }, (_, i) => (
    <span key={i} className="top-marquee__item">
      {message}
    </span>
  ))

  return (
    <div className="top-marquee" role="marquee" aria-label={message}>
      <div className="top-marquee__track" aria-hidden="true">
        {items}
        {items}
      </div>
    </div>
  )
}

export default TopMarquee
