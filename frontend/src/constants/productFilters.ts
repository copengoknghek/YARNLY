import type { ProductCategory, ProductSort, StockStatus } from '@/types/product'
import { CATEGORY_TABS } from './categories'

export interface FilterOption<T extends string> {
  value: T
  labelKey: string
}

export const STATUS_OPTIONS: FilterOption<StockStatus | ''>[] = [
  { value: '', labelKey: 'filters.all' },
  { value: 'in-stock', labelKey: 'filters.inStock' },
  { value: 'out-of-stock', labelKey: 'filters.outOfStock' },
]

export const PRICE_SORT_OPTIONS: FilterOption<ProductSort | ''>[] = [
  { value: '', labelKey: 'filters.default' },
  { value: 'price-asc', labelKey: 'filters.priceAsc' },
  { value: 'price-desc', labelKey: 'filters.priceDesc' },
  { value: 'newest', labelKey: 'filters.newest' },
]

export const CATEGORY_OPTIONS: FilterOption<ProductCategory | ''>[] = CATEGORY_TABS.map((tab) => ({
  value: tab.value,
  labelKey: tab.labelKey,
}))
