import type { PaginatedResult, Product, ProductFilters } from '@/types/product'
import api, { type ApiResponse } from './api'

export const getProducts = async (filters: ProductFilters = {}) => {
  const res = await api.get<ApiResponse<PaginatedResult<Product>>>('/products', { params: filters })
  return res.data.data
}

export const getProductById = async (id: string) => {
  const res = await api.get<ApiResponse<Product>>(`/products/${id}`)
  return res.data.data
}
