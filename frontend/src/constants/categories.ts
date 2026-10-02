import type { CartProduct } from '@/types/cart'
import type { ProductCategory } from '@/types/product'

export const CATEGORY_LABELS: Record<CartProduct['category'], string> = {
  decoration: 'Trang trí & lưu niệm',
  fashion: 'Phụ kiện & thời trang',
  combo: 'Combo quà tặng',
  blindbox: 'Blind box',
  custom: 'Thiết kế riêng',
}

export const CATEGORY_TABS: { value: ProductCategory | ''; label: string }[] = [
  { value: '', label: 'Tất cả' },
  { value: 'decoration', label: CATEGORY_LABELS.decoration },
  { value: 'fashion', label: CATEGORY_LABELS.fashion },
  { value: 'combo', label: CATEGORY_LABELS.combo },
  { value: 'blindbox', label: CATEGORY_LABELS.blindbox },
]
