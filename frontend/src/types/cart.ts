import type { CustomDesign } from './customDesign'
import type { Product, ProductCategory } from './product'

/** Minimal product snapshot stored in the cart and in orders. */
export type CartProduct = Pick<Product, 'id' | 'name' | 'price' | 'images'> & {
  category: ProductCategory | 'custom'
}

export interface SelectedOptions {
  color?: string
  size?: string
  leadTime?: string
}

export interface CartItem {
  /** Unique per line: the same product with different options becomes separate lines. */
  key: string
  product: CartProduct
  quantity: number
  selectedOptions?: SelectedOptions
  customDesign?: CustomDesign
}

export interface CartItemExtras {
  selectedOptions?: SelectedOptions
  customDesign?: CustomDesign
}
