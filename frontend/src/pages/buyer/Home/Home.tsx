import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { LinkButton } from '@/components/common/Button'
import Icon from '@/components/common/Icon'
import Loading from '@/components/common/Loading'
import FaqAccordion from '@/components/features/home/FaqAccordion'
import IdeaBanner from '@/components/features/marketing/IdeaBanner'
import CategoryTabs from '@/components/features/product/CategoryTabs'
import ProductCarousel from '@/components/features/product/ProductCarousel'
import ProductGrid from '@/components/features/product/ProductGrid'
import { FAQ_ITEM_KEYS } from '@/constants/faq'
import { ROUTES } from '@/constants/routes'
import { useFetch } from '@/hooks/useFetch'
import { getProducts } from '@/services/productService'
import type { ProductCategory } from '@/types/product'
import '@/styles/pages/buyer/Home.css'

const HOME_PAGE_SIZE = 8

function Home() {
  const { t } = useTranslation()
  const [category, setCategory] = useState<ProductCategory | ''>('')

  const fetchProducts = useCallback(
    () => getProducts({ category: category || undefined, pageSize: HOME_PAGE_SIZE }),
    [category],
  )
  const fetchBestSellers = useCallback(() => getProducts({ bestSeller: true }), [])
  const products = useFetch(fetchProducts)
  const bestSellers = useFetch(fetchBestSellers)

  const faqItems = FAQ_ITEM_KEYS.map((item) => ({
    questionKey: item.questionKey,
    answerKey: item.answerKey,
  }))

  return (
    <div className="home">
      <section className="home-hero">
        <h1 className="visually-hidden">{t('home.heroTitle')}</h1>
      </section>

      <section className="container home-products">
        <div className="section-heading">
          <p className="eyebrow">{t('home.productsEyebrow')}</p>
          <h2 className="display-title">{t('home.productsTitle')}</h2>
        </div>

        <CategoryTabs value={category} onChange={setCategory} />

        {products.loading && <Loading />}
        {products.error && <p className="text-error home-products__status">{products.error}</p>}
        {products.data && (
          <>
            <p className="home-products__count">
              <strong>{products.data.total}</strong> {t('home.productsCountUnit')}
            </p>
            <ProductGrid products={products.data.items} />
            {products.data.total > products.data.items.length && (
              <div className="home-products__more">
                <LinkButton to={ROUTES.PRODUCTS} variant="outline">
                  {t('home.viewAllProducts')}
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
              {t('home.viewAllProducts')} <Icon name="arrow-right" size={20} strokeWidth={1.2} />
            </Link>
            <div className="home-best__heading">
              <p className="eyebrow">{t('home.bestSellersEyebrow')}</p>
              <h2 className="display-title">{t('home.bestSellersTitle')}</h2>
            </div>
          </div>
          {bestSellers.loading && <Loading />}
          {bestSellers.data && <ProductCarousel products={bestSellers.data.items} />}
        </div>
      </section>

      <section className="container home-faq">
        <div className="section-heading">
          <p className="eyebrow">{t('home.faqEyebrow')}</p>
          <h2 className="display-title">{t('home.faqTitle')}</h2>
        </div>
        <FaqAccordion items={faqItems} />
      </section>
    </div>
  )
}

export default Home
