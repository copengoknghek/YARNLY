import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Breadcrumb from '@/components/common/Breadcrumb'
import PageBanner from '@/components/common/PageBanner'
import BlindBoxCard from '@/components/features/blindbox/BlindBoxCard'
import IdeaBanner from '@/components/features/marketing/IdeaBanner'
import { BLIND_BOX_IMAGE, BLIND_BOX_PACKAGES, BLIND_BOX_STEPS, type BlindBoxPackage } from '@/constants/blindBox'
import { ROUTES } from '@/constants/routes'
import { useCart } from '@/hooks/useCart'
import '@/styles/pages/buyer/BlindBox.css'

function BlindBox() {
  const { t } = useTranslation()
  const { addItem } = useCart()
  const [addedName, setAddedName] = useState<string | null>(null)

  const handleBuy = (pack: BlindBoxPackage) => {
    const name = t(`blindBox.packages.${pack.packageKey}.name`)
    addItem({
      id: pack.productId,
      name,
      price: pack.price,
      category: 'blindbox',
      images: [BLIND_BOX_IMAGE],
    })
    setAddedName(name)
  }

  return (
    <div className="blindbox-page">
      <PageBanner title={t('blindBox.pageTitle')} />

      <div className="container page">
        <Breadcrumb
          items={[
            { label: t('common.breadcrumb.home'), to: ROUTES.HOME },
            { label: t('blindBox.pageTitle') },
          ]}
        />

        <section className="blindbox-page__section">
          <div className="section-heading">
            <p className="eyebrow">{t('blindBox.howEyebrow')}</p>
            <h2 className="display-title">{t('blindBox.howTitle')}</h2>
          </div>
          <ol className="blindbox-steps">
            {BLIND_BOX_STEPS.map((step) => (
              <li key={step.number} className="blindbox-steps__item">
                <span className="blindbox-steps__number">{step.number}</span>
                <h3 className="blindbox-steps__title">{t(step.titleKey)}</h3>
                <p className="blindbox-steps__description">{t(step.descriptionKey)}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="blindbox-page__section">
          <div className="section-heading">
            <p className="eyebrow">{t('blindBox.packagesEyebrow')}</p>
            <h2 className="display-title">{t('blindBox.packagesTitle')}</h2>
          </div>
          <div className="blindbox-packages">
            {BLIND_BOX_PACKAGES.map((pack) => (
              <BlindBoxCard key={pack.productId} pack={pack} onBuy={handleBuy} />
            ))}
          </div>
          {addedName && (
            <p className="blindbox-page__added" role="status">
              {t('blindBox.addedToCart', { name: addedName })}{' '}
              <Link to={ROUTES.CART}>{t('common.viewCart')}</Link>
            </p>
          )}
        </section>
      </div>

      <IdeaBanner />
    </div>
  )
}

export default BlindBox
