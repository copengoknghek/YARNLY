import type { DropdownOption } from '@/components/common/Dropdown'
import type { ProductCategory, ProductSort, StockStatus } from '@/types/product'
import { CATEGORY_TABS } from './categories'

export const STATUS_OPTIONS: DropdownOption<StockStatus | ''>[] = [
  { value: '', label: 'Tất cả' },
  { value: 'in-stock', label: 'Còn hàng' },
  { value: 'out-of-stock', label: 'Hết hàng' },
]

export const PRICE_SORT_OPTIONS: DropdownOption<ProductSort | ''>[] = [
  { value: '', label: 'Mặc định' },
  { value: 'price-asc', label: 'Giá thấp đến cao' },
  { value: 'price-desc', label: 'Giá cao đến thấp' },
  { value: 'newest', label: 'Mới nhất' },
]

export const CATEGORY_OPTIONS: DropdownOption<ProductCategory | ''>[] = CATEGORY_TABS
