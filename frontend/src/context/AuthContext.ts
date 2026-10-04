import { createContext } from 'react'
import type { LoginPayload, RegisterPayload, User } from '@/types/user'

export interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  loginSeller: (payload: LoginPayload) => Promise<void>
  registerSeller: (payload: RegisterPayload) => Promise<void>
  loginStaff: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
