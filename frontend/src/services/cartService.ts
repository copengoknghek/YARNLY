import type { CartItem } from '@/types/cart'
import api, { type ApiResponse } from './api'

export const getCart = async () => {
  const res = await api.get<ApiResponse<CartItem[]>>('/cart')
  return res.data.data
}

export const addToCart = async (productId: string, quantity: number) => {
  const res = await api.post<ApiResponse<CartItem[]>>('/cart', { productId, quantity })
  return res.data.data
}

export const updateCartItem = async (productId: string, quantity: number) => {
  const res = await api.patch<ApiResponse<CartItem[]>>(`/cart/${productId}`, { quantity })
  return res.data.data
}

export const removeFromCart = async (productId: string) => {
  const res = await api.delete<ApiResponse<CartItem[]>>(`/cart/${productId}`)
  return res.data.data
}
