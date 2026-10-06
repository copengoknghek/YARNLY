import type { CartProduct } from '@/types/cart'
import type { ProductCategory } from '@/types/product'

export const CATEGORY_LABEL_KEYS: Record<CartProduct['category'], string> = {
  decoration: 'categories.decoration',
  fashion: 'categories.fashion',
  combo: 'categories.combo',
  blindbox: 'categories.blindbox',
  custom: 'categories.custom',
}

export const CATEGORY_LABELS_VI: Record<CartProduct['category'], string> = {
  decoration: 'Trang trí & lưu niệm',
  fashion: 'Phụ kiện & thời trang',
  combo: 'Combo quà tặng',
  blindbox: 'Blind box',
  custom: 'Thiết kế riêng',
}

export const CATEGORY_TABS: { value: ProductCategory | ''; labelKey: string }[] = [
  { value: '', labelKey: 'categories.all' },
  { value: 'decoration', labelKey: CATEGORY_LABEL_KEYS.decoration },
  { value: 'fashion', labelKey: CATEGORY_LABEL_KEYS.fashion },
  { value: 'combo', labelKey: CATEGORY_LABEL_KEYS.combo },
  { value: 'blindbox', labelKey: CATEGORY_LABEL_KEYS.blindbox },
]
