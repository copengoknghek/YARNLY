import type { CustomDesignOptions } from '@/types/customDesign'
import api, { type ApiResponse } from './api'

export const getCustomDesignOptions = async () => {
  const res = await api.get<ApiResponse<CustomDesignOptions>>('/custom-designs/options')
  return res.data.data
}
