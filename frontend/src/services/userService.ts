import type { UpdateProfilePayload, User } from '@/types/user'
import api, { type ApiResponse } from './api'

export const getProfile = async () => {
  const res = await api.get<ApiResponse<User>>('/users/me')
  return res.data.data
}

export const updateProfile = async (payload: UpdateProfilePayload) => {
  const res = await api.patch<ApiResponse<User>>('/users/me', payload)
  return res.data.data
}
