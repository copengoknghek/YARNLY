import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CartItem, CartItemExtras, CartProduct } from '@/types/cart'
import { CartContext, type CartContextValue } from './CartContext'

const CART_STORAGE_KEY = 'yarnly_cart'
const NOTE_STORAGE_KEY = 'yarnly_order_note'

const loadCart = (): CartItem[] => {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? '[]')
    return Array.isArray(stored) ? stored.filter((item) => typeof item?.key === 'string') : []
  } catch {
    return []
  }
}

const buildKey = (product: CartProduct, extras: CartItemExtras) =>
  extras.customDesign
    ? `${product.id}:${JSON.stringify(extras.customDesign)}`
    : `${product.id}:${JSON.stringify(extras.selectedOptions ?? {})}`

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart)
  const [note, setNote] = useState(() => localStorage.getItem(NOTE_STORAGE_KEY) ?? '')

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  useEffect(() => {
    localStorage.setItem(NOTE_STORAGE_KEY, note)
  }, [note])

  const value = useMemo<CartContextValue>(() => {
    const addItem = (product: CartProduct, quantity = 1, extras: CartItemExtras = {}) => {
      const key = buildKey(product, extras)
      setItems((prev) => {
        if (prev.some((item) => item.key === key)) {
          return prev.map((item) =>
            item.key === key ? { ...item, quantity: item.quantity + quantity } : item,
          )
        }
        return [...prev, { key, product, quantity, ...extras }]
      })
    }

    const removeItem = (key: string) => {
      setItems((prev) => prev.filter((item) => item.key !== key))
    }

    const updateQuantity = (key: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(key)
        return
      }
      setItems((prev) => prev.map((item) => (item.key === key ? { ...item, quantity } : item)))
    }

    return {
      items,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      note,
      setNote,
      addItem,
      updateQuantity,
      removeItem,
      clearCart: () => {
        setItems([])
        setNote('')
      },
    }
  }, [items, note])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
