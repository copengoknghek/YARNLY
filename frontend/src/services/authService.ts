import type { AuthResponse, LoginPayload, RegisterPayload } from '@/types/user'
import api, { type ApiResponse } from './api'

export const login = async (payload: LoginPayload) => {
  const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', payload)
  return res.data.data
}

export const register = async (payload: RegisterPayload) => {
  const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', payload)
  return res.data.data
}

export const logout = async () => {
  await api.post('/auth/logout')
}
