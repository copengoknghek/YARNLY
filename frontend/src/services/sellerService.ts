import type { SellerProduct, SellerProductInput } from '@/types/portal'
import api, { type ApiResponse } from './api'

export interface SellerStats {
  pending: number
  approved: number
  rejected: number
  lowStock: number
}

export const getSellerProducts = async () => {
  const res = await api.get<ApiResponse<SellerProduct[]>>('/seller/products')
  return res.data.data
}

export const createSellerProduct = async (input: SellerProductInput) => {
  const res = await api.post<ApiResponse<SellerProduct>>('/seller/products', input)
  return res.data.data
}

export const updateSellerProduct = async (id: string, input: SellerProductInput) => {
  const res = await api.patch<ApiResponse<SellerProduct>>(`/seller/products/${id}`, input)
  return res.data.data
}

export const updateSellerStock = async (id: string, stock: number) => {
  const res = await api.patch<ApiResponse<SellerProduct>>(`/seller/products/${id}/stock`, { stock })
  return res.data.data
}

export const getSellerStats = async () => {
  const res = await api.get<ApiResponse<SellerStats>>('/seller/stats')
  return res.data.data
}

export interface SellerYarnColor {
  id: string
  sellerId: string
  name: string
  hex: string
  stock: number
  createdAt: string
}

export interface YarnColorInput {
  name: string
  hex: string
  stock: number
}

export const MAX_YARN_COLORS = 10

export const getSellerYarnColors = async () => {
  const res = await api.get<ApiResponse<SellerYarnColor[]>>('/seller/colors')
  return res.data.data
}

export const createSellerYarnColor = async (input: YarnColorInput) => {
  const res = await api.post<ApiResponse<SellerYarnColor>>('/seller/colors', input)
  return res.data.data
}

export const updateSellerYarnColor = async (id: string, input: Partial<YarnColorInput>) => {
  const res = await api.patch<ApiResponse<SellerYarnColor>>(`/seller/colors/${id}`, input)
  return res.data.data
}

export const deleteSellerYarnColor = async (id: string) => {
  await api.delete(`/seller/colors/${id}`)
}
