import type { CreateOrderPayload, Order, OrderLookupQuery } from '@/types/order'
import api, { type ApiResponse } from './api'

export const createOrder = async (payload: CreateOrderPayload) => {
  const res = await api.post<ApiResponse<Order>>('/orders', payload)
  return res.data.data
}

export const getMyOrders = async () => {
  const res = await api.get<ApiResponse<Order[]>>('/orders')
  return res.data.data
}

export const getOrderById = async (id: string) => {
  const res = await api.get<ApiResponse<Order>>(`/orders/${id}`)
  return res.data.data
}

export const lookupOrders = async (query: OrderLookupQuery) => {
  const res = await api.get<ApiResponse<Order[]>>('/orders/lookup', { params: query })
  return res.data.data
}
