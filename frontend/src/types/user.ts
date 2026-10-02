export type UserRole = 'admin' | 'user'

export type UserType = 'buyer' | 'seller'

/** Effective role used for route access: admins, or users split into buyers and sellers. */
export type AccessRole = 'admin' | UserType

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  userType?: UserType
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload extends LoginPayload {
  name: string
  phone: string
}

export interface AuthResponse {
  user: User
  token: string
}
