import { useMemo, useState, type ReactNode } from 'react'
import * as authService from '@/services/authService'
import { TOKEN_STORAGE_KEY } from '@/services/api'
import type { AuthResponse, User } from '@/types/user'
import { AuthContext, type AuthContextValue } from './AuthContext'

const USER_STORAGE_KEY = 'yarnly_user'

const loadUser = (): User | null => {
  try {
    return JSON.parse(localStorage.getItem(USER_STORAGE_KEY) ?? 'null')
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUser)

  const value = useMemo<AuthContextValue>(() => {
    const saveSession = ({ user, token }: AuthResponse) => {
      localStorage.setItem(TOKEN_STORAGE_KEY, token)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
      setUser(user)
    }

    return {
      user,
      isAuthenticated: user !== null,
      login: async (payload) => saveSession(await authService.login(payload)),
      register: async (payload) => saveSession(await authService.register(payload)),
      logout: async () => {
        try {
          await authService.logout()
        } finally {
          localStorage.removeItem(TOKEN_STORAGE_KEY)
          localStorage.removeItem(USER_STORAGE_KEY)
          setUser(null)
        }
      },
    }
  }, [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
