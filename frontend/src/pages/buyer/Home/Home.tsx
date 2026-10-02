import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { LinkButton } from '@/components/common/Button'
import Icon from '@/components/common/Icon'
import Loading from '@/components/common/Loading'
import FaqAccordion from '@/components/features/home/FaqAccordion'
import IdeaBanner from '@/components/features/marketing/IdeaBanner'
import CategoryTabs from '@/components/features/product/CategoryTabs'
import ProductCarousel from '@/components/features/product/ProductCarousel'
import ProductGrid from '@/components/features/product/ProductGrid'
import { FAQ_ITEMS } from '@/constants/faq'
import { ROUTES } from '@/constants/routes'
import { useFetch } from '@/hooks/useFetch'
import { getProducts } from '@/services/productService'
import type { ProductCategory } from '@/types/product'
import '@/styles/pages/buyer/Home.css'

const HOME_PAGE_SIZE = 8

function Home() {
  const [category, setCategory] = useState<ProductCategory | ''>('')

  const fetchProducts = useCallback(
    () => getProducts({ category: category || undefined, pageSize: HOME_PAGE_SIZE }),
    [category],
  )
  const fetchBestSellers = useCallback(() => getProducts({ bestSeller: true }), [])
  const products = useFetch(fetchProducts)
  const bestSellers = useFetch(fetchBestSellers)

  return (
    <div className="home">
      <section className="home-hero">
        <h1 className="visually-hidden">Yarnly - Đồ len handmade</h1>
      </section>

      <section className="container home-products">
        <div className="section-heading">
          <p className="eyebrow">Gian hàng Yarnly</p>
          <h2 className="display-title">Sản phẩm handmade</h2>
        </div>

        <CategoryTabs value={category} onChange={setCategory} />

        {products.loading && <Loading />}
        {products.error && <p className="text-error home-products__status">{products.error}</p>}
        {products.data && (
          <>
            <p className="home-products__count">
              <strong>{products.data.total}</strong> sản phẩm
            </p>
            <ProductGrid products={products.data.items} />
            {products.data.total > products.data.items.length && (
              <div className="home-products__more">
                <LinkButton to={ROUTES.PRODUCTS} variant="outline">
                  Xem tất cả sản phẩm
                </LinkButton>
              </div>
            )}
          </>
        )}
      </section>

      <IdeaBanner />

      <section className="home-best">
        <div className="container">
          <div className="home-best__header">
            <Link to={ROUTES.PRODUCTS} className="home-best__all">
              Xem tất cả sản phẩm <Icon name="arrow-right" size={20} strokeWidth={1.2} />
            </Link>
            <div className="home-best__heading">
              <p className="eyebrow">Được khách hàng yêu thích</p>
              <h2 className="display-title">Hàng bán chạy</h2>
            </div>
          </div>
          {bestSellers.loading && <Loading />}
          {bestSellers.data && <ProductCarousel products={bestSellers.data.items} />}
        </div>
      </section>

      <section className="container home-faq">
        <div className="section-heading">
          <p className="eyebrow">Hỏi đáp và thắc mắc</p>
          <h2 className="display-title">Một số câu hỏi thường gặp</h2>
        </div>
        <FaqAccordion items={FAQ_ITEMS} />
      </section>
    </div>
  )
}

export default Home
