import axios, { isAxiosError } from 'axios'

export const TOKEN_STORAGE_KEY = 'yarnly_token'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface ApiResponse<T> {
  data: T
}

export const getErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    return error.response?.data?.message ?? error.message
  }
  return 'Đã có lỗi xảy ra, vui lòng thử lại.'
}

export default api
