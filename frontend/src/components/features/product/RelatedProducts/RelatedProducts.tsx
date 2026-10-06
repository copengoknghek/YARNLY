import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import ProductGrid from '@/components/features/product/ProductGrid'
import { useFetch } from '@/hooks/useFetch'
import { getProducts } from '@/services/productService'
import '@/styles/components/RelatedProducts.css'

const COUNT = 4

function RelatedProducts({ excludeId }: { excludeId?: string }) {
  const { t } = useTranslation()
  const fetchProducts = useCallback(() => getProducts({ pageSize: COUNT + 1 }), [])
  const { data } = useFetch(fetchProducts)

  const products = data?.items.filter((product) => product.id !== excludeId).slice(0, COUNT) ?? []
  if (products.length === 0) return null

  return (
    <section className="container related-products">
      <h2 className="display-title related-products__title">{t('products.relatedTitle')}</h2>
      <ProductGrid products={products} />
    </section>
  )
}

export default RelatedProducts
