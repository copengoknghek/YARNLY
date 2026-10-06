import type { AdminOrder, SellerProduct } from '@/types/portal'
import api, { type ApiResponse } from './api'

export interface AdminStats {
  totalOrders: number
  pendingProducts: number
  byStatus: Record<string, number>
}

export const getPendingProducts = async () => {
  const res = await api.get<ApiResponse<SellerProduct[]>>('/admin/products/pending')
  return res.data.data
}

export const approveProduct = async (id: string) => {
  const res = await api.post<ApiResponse<SellerProduct>>(`/admin/products/${id}/approve`)
  return res.data.data
}

export const rejectProduct = async (id: string, note?: string) => {
  const res = await api.post<ApiResponse<SellerProduct>>(`/admin/products/${id}/reject`, { note })
  return res.data.data
}

export const getAdminOrders = async () => {
  const res = await api.get<ApiResponse<AdminOrder[]>>('/admin/orders')
  return res.data.data
}

export const getAdminStats = async () => {
  const res = await api.get<ApiResponse<AdminStats>>('/admin/stats')
  return res.data.data
}
