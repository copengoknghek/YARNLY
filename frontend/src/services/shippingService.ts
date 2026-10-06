import type { ShippingQuotesResult } from '@/types/order'
import api, { type ApiResponse } from './api'

export const getShippingQuotes = async (province: string) => {
  const res = await api.get<ApiResponse<ShippingQuotesResult>>('/shipping/quotes', {
    params: { province },
  })
  return res.data.data
}
