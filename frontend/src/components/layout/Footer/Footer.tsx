import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Newsletter from '@/components/features/marketing/Newsletter'
import { FOOTER_CONTACT_KEYS, FOOTER_EXPLORE, FOOTER_SUPPORT_KEYS } from '@/constants/navigation'
import { ROUTES } from '@/constants/routes'
import '@/styles/components/Footer.css'

const CURRENT_YEAR = new Date().getFullYear()

function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="footer">
      <div className="footer__main">
        <div className="container">
          <Newsletter />

          <div className="footer__columns">
            <div className="footer__brand">
              <Link to={ROUTES.HOME} aria-label={t('footer.brandHome')}>
                <img src="/images/brand/logo.png" alt="YARNLY" className="footer__logo" />
              </Link>
              <p className="footer__tagline">{t('footer.tagline')}</p>
            </div>

            <div className="footer__column">
              <h3 className="footer__heading">{t('footer.exploreHeading')}</h3>
              <ul className="footer__list">
                {FOOTER_EXPLORE.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="footer__link">
                      {t(item.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__column">
              <h3 className="footer__heading">{t('footer.contactHeading')}</h3>
              <ul className="footer__list">
                {FOOTER_CONTACT_KEYS.map((labelKey) => (
                  <li key={labelKey}>{t(labelKey)}</li>
                ))}
              </ul>
            </div>

            <div className="footer__column">
              <h3 className="footer__heading">{t('footer.supportHeading')}</h3>
              <ul className="footer__list">
                {FOOTER_SUPPORT_KEYS.map((labelKey) => (
                  <li key={labelKey}>
                    <a href="#" className="footer__link">
                      {t(labelKey)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <p className="footer__copyright">{t('footer.copyright', { year: CURRENT_YEAR })}</p>
    </footer>
  )
}

export default Footer
