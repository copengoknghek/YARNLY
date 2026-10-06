import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import Loading from '@/components/common/Loading'
import PageBanner from '@/components/common/PageBanner'
import Pagination from '@/components/common/Pagination'
import IdeaBanner from '@/components/features/marketing/IdeaBanner'
import ProductGrid from '@/components/features/product/ProductGrid'
import ProductSortBar, { type ProductListFilters } from '@/components/features/product/ProductSortBar'
import { CATEGORY_OPTIONS, PRICE_SORT_OPTIONS, STATUS_OPTIONS } from '@/constants/productFilters'
import { useFetch } from '@/hooks/useFetch'
import { getProducts } from '@/services/productService'
import '@/styles/pages/buyer/Products.css'

const PAGE_SIZE = 12

const pickOption = <T extends string>(options: { value: T }[], raw: string | null): T | '' =>
  options.find((option) => option.value === raw)?.value ?? ''

function Products() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') ?? ''
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const filters: ProductListFilters = {
    status: pickOption(STATUS_OPTIONS, searchParams.get('status')),
    sort: pickOption(PRICE_SORT_OPTIONS, searchParams.get('sort')),
    category: pickOption(CATEGORY_OPTIONS, searchParams.get('category')),
  }
  const { status, sort, category } = filters

  const fetchProducts = useCallback(
    () =>
      getProducts({
        search: search || undefined,
        status: status || undefined,
        sort: sort || undefined,
        category: category || undefined,
        page,
        pageSize: PAGE_SIZE,
      }),
    [search, status, sort, category, page],
  )
  const { data, loading, error } = useFetch(fetchProducts)

  const updateParams = (patch: Record<string, string | number>) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(patch).forEach(([key, value]) => {
      if (value === '' || value === 1) next.delete(key)
      else next.set(key, String(value))
    })
    setSearchParams(next)
  }

  const goToPage = (nextPage: number) => {
    updateParams({ page: nextPage })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="products-page">
      <PageBanner title={t('products.pageTitle')} />

      <section className="container page">
        {search && (
          <p className="products-page__search">
            {t('products.searchResults', { query: search })}
            <button type="button" className="products-page__clear" onClick={() => updateParams({ search: '' })}>
              {t('products.clearSearch')}
            </button>
          </p>
        )}

        <ProductSortBar
          filters={filters}
          onFilterChange={(patch) => updateParams({ ...patch, page: 1 })}
          page={data?.page ?? page}
          totalPages={data?.totalPages ?? 1}
          onPageChange={goToPage}
        />

        {loading && <Loading />}
        {error && <p className="text-error">{error}</p>}
        {data && (
          <>
            <ProductGrid products={data.items} />
            <Pagination page={data.page} totalPages={data.totalPages} onChange={goToPage} />
          </>
        )}
      </section>

      <IdeaBanner />
    </div>
  )
}

export default Products
