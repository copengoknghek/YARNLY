import Icon from '@/components/common/Icon'
import type { BlindBoxPackage } from '@/constants/blindBox'
import { formatPrice } from '@/utils/formatPrice'
import '@/styles/components/BlindBoxCard.css'

interface BlindBoxCardProps {
  pack: BlindBoxPackage
  onBuy: (pack: BlindBoxPackage) => void
}

function BlindBoxCard({ pack, onBuy }: BlindBoxCardProps) {
  return (
    <article className={`blindbox-card ${pack.featured ? 'blindbox-card--featured' : ''}`}>
      <span className="blindbox-card__icon" aria-hidden="true">
        ?
      </span>
      <h3 className="blindbox-card__name">{pack.name}</h3>
      <p className="blindbox-card__description">{pack.description}</p>
      <p className="blindbox-card__price">{formatPrice(pack.price)}</p>
      <ul className="blindbox-card__features">
        {pack.features.map((feature) => (
          <li key={feature}>
            <Icon name="check" size={12} strokeWidth={2} />
            {feature}
          </li>
        ))}
      </ul>
      <button type="button" className="blindbox-card__buy" onClick={() => onBuy(pack)}>
        Mua hộp bí mật
      </button>
    </article>
  )
}

export default BlindBoxCard
