import { createContext } from 'react'
import type { CartItem, CartItemExtras, CartProduct } from '@/types/cart'

export interface CartContextValue {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  /** Order note typed on the cart page and prefilled at checkout. */
  note: string
  setNote: (note: string) => void
  addItem: (product: CartProduct, quantity?: number, extras?: CartItemExtras) => void
  updateQuantity: (key: string, quantity: number) => void
  removeItem: (key: string) => void
  clearCart: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)
