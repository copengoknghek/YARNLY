import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Icon from '@/components/common/Icon'
import { ROUTES } from '@/constants/routes'
import '@/styles/components/IdeaBanner.css'

function IdeaBanner() {
  const { t } = useTranslation()

  return (
    <section className="container idea-banner-wrap">
      <div className="idea-banner">
        <p className="eyebrow idea-banner__eyebrow">{t('marketing.ideaBanner.eyebrow')}</p>
        <h2 className="display-title idea-banner__title">{t('marketing.ideaBanner.title')}</h2>
        <Link to={ROUTES.CUSTOM_DESIGN} className="idea-banner__cta" aria-label={t('marketing.ideaBanner.cta')}>
          <Icon name="arrow-right" size={28} strokeWidth={1.2} />
        </Link>
      </div>
    </section>
  )
}

export default IdeaBanner
