import type { AccessRole, User } from '@/types/user'

export const getAccessRole = (user: User): AccessRole =>
  user.role === 'admin' ? 'admin' : (user.userType ?? 'buyer')
