import { useTranslation } from 'react-i18next'
import Icon from '@/components/common/Icon'
import type { BlindBoxPackage } from '@/constants/blindBox'
import { formatPrice } from '@/utils/formatPrice'
import '@/styles/components/BlindBoxCard.css'

interface BlindBoxCardProps {
  pack: BlindBoxPackage
  onBuy: (pack: BlindBoxPackage) => void
}

function BlindBoxCard({ pack, onBuy }: BlindBoxCardProps) {
  const { t } = useTranslation()
  const features = t(`blindBox.packages.${pack.packageKey}.features`, { returnObjects: true }) as string[]

  return (
    <article className={`blindbox-card ${pack.featured ? 'blindbox-card--featured' : ''}`}>
      <span className="blindbox-card__icon" aria-hidden="true">
        ?
      </span>
      <h3 className="blindbox-card__name">{t(`blindBox.packages.${pack.packageKey}.name`)}</h3>
      <p className="blindbox-card__description">{t(`blindBox.packages.${pack.packageKey}.description`)}</p>
      <p className="blindbox-card__price">{formatPrice(pack.price)}</p>
      <ul className="blindbox-card__features">
        {features.map((feature) => (
          <li key={feature}>
            <Icon name="check" size={12} strokeWidth={2} />
            {feature}
          </li>
        ))}
      </ul>
      <button type="button" className="blindbox-card__buy" onClick={() => onBuy(pack)}>
        {t('blindBox.buyButton')}
      </button>
    </article>
  )
}

export default BlindBoxCard
