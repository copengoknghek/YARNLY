import { useTranslation } from 'react-i18next'
import ProductCard from '@/components/features/product/ProductCard'
import type { Product } from '@/types/product'
import '@/styles/components/ProductGrid.css'

function ProductGrid({ products }: { products: Product[] }) {
  const { t } = useTranslation()

  if (products.length === 0) {
    return <p className="product-grid__empty">{t('products.empty')}</p>
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid
