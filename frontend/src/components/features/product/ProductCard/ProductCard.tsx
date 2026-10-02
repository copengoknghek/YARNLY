import { Link } from 'react-router-dom'
import Icon from '@/components/common/Icon'
import { CATEGORY_LABELS } from '@/constants/categories'
import { productDetailPath } from '@/constants/routes'
import type { Product } from '@/types/product'
import { formatPrice } from '@/utils/formatPrice'
import '@/styles/components/ProductCard.css'

function ProductCard({ product }: { product: Product }) {
  const detailPath = productDetailPath(product.id)

  return (
    <article className="product-card">
      <Link to={detailPath} className="product-card__media" tabIndex={-1} aria-hidden="true">
        <img src={product.images[0]} alt="" loading="lazy" />
        {product.stock === 0 && <span className="product-card__badge">Hết hàng</span>}
      </Link>
      <div className="product-card__body">
        <p className="product-card__category">{CATEGORY_LABELS[product.category]}</p>
        <h3 className="product-card__name">
          <Link to={detailPath}>{product.name}</Link>
        </h3>
        <div className="product-card__footer">
          <span className="product-card__price">{formatPrice(product.price)}</span>
          <Link to={detailPath} className="product-card__more">
            Xem chi tiết <Icon name="arrow-right" size={14} />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
