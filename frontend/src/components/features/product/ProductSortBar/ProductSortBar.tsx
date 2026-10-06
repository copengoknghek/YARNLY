import { useTranslation } from 'react-i18next'
import Dropdown from '@/components/common/Dropdown'
import Icon from '@/components/common/Icon'
import { CATEGORY_OPTIONS, PRICE_SORT_OPTIONS, STATUS_OPTIONS } from '@/constants/productFilters'
import type { ProductCategory, ProductSort, StockStatus } from '@/types/product'
import '@/styles/components/ProductSortBar.css'

export interface ProductListFilters {
  status: StockStatus | ''
  sort: ProductSort | ''
  category: ProductCategory | ''
}

interface ProductSortBarProps {
  filters: ProductListFilters
  onFilterChange: (patch: Partial<ProductListFilters>) => void
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

function ProductSortBar({ filters, onFilterChange, page, totalPages, onPageChange }: ProductSortBarProps) {
  const { t } = useTranslation()

  return (
    <div className="sort-bar">
      <div className="sort-bar__filters">
        <span className="sort-bar__label">{t('products.sortBar.sortBy')}</span>
        <Dropdown
          labelKey="products.sortBar.status"
          value={filters.status}
          options={STATUS_OPTIONS}
          onChange={(status) => onFilterChange({ status })}
        />
        <Dropdown
          labelKey="products.sortBar.price"
          value={filters.sort}
          options={PRICE_SORT_OPTIONS}
          onChange={(sort) => onFilterChange({ sort })}
        />
        <Dropdown
          labelKey="products.sortBar.category"
          value={filters.category}
          options={CATEGORY_OPTIONS}
          onChange={(category) => onFilterChange({ category })}
        />
      </div>

      <div className="sort-bar__pager">
        <span>
          {page}/{totalPages}
        </span>
        <button
          type="button"
          className="sort-bar__page-button"
          aria-label={t('products.sortBar.prevPage')}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <Icon name="arrow-left" size={14} strokeWidth={2} />
        </button>
        <button
          type="button"
          className="sort-bar__page-button"
          aria-label={t('products.sortBar.nextPage')}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <Icon name="arrow-right" size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}

export default ProductSortBar
