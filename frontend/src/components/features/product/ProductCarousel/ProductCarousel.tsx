import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Icon from '@/components/common/Icon'
import { CATEGORY_LABEL_KEYS } from '@/constants/categories'
import { productDetailPath } from '@/constants/routes'
import type { Product } from '@/types/product'
import { formatPrice } from '@/utils/formatPrice'
import '@/styles/components/ProductCarousel.css'

const VISIBLE = 3

function ProductCarousel({ products }: { products: Product[] }) {
  const { t } = useTranslation()
  const [offset, setOffset] = useState(0)
  const count = products.length
  if (count === 0) return null

  const visible = Array.from({ length: Math.min(VISIBLE, count) }, (_, i) => products[(offset + i) % count])
  const move = (step: number) => setOffset((value) => (value + step + count) % count)

  return (
    <div className="product-carousel">
      <button
        type="button"
        className="product-carousel__arrow"
        aria-label={t('products.carouselPrev')}
        onClick={() => move(-1)}
        disabled={count <= 1}
      >
        <Icon name="chevron-left" size={16} />
      </button>

      <div className="product-carousel__track">
        {visible.map((product, index) => (
          <Link
            key={`${product.id}-${index}`}
            to={productDetailPath(product.id)}
            className="product-carousel__card"
          >
            <span className="product-carousel__price">{formatPrice(product.price)}</span>
            <span className="product-carousel__media">
              <img src={product.images[0]} alt={product.name} loading="lazy" />
            </span>
            <span className="product-carousel__category">{t(CATEGORY_LABEL_KEYS[product.category])}</span>
            <span className="product-carousel__name">{product.name}</span>
          </Link>
        ))}
      </div>

      <button
        type="button"
        className="product-carousel__arrow"
        aria-label={t('products.carouselNext')}
        onClick={() => move(1)}
        disabled={count <= 1}
      >
        <Icon name="chevron-right" size={16} />
      </button>
    </div>
  )
}

export default ProductCarousel
