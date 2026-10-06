import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import type { AccessRole } from '@/types/user'
import { getAccessRole } from '@/utils/roles'

interface RequireRoleProps {
  allow: AccessRole[]
  children?: ReactNode
}

function RequireRole({ allow, children }: RequireRoleProps) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    const asParam = allow.includes('seller')
      ? 'seller'
      : allow.includes('admin')
        ? 'staff'
        : undefined
    const loginPath = asParam ? `${ROUTES.LOGIN}?as=${asParam}` : ROUTES.LOGIN
    return <Navigate to={loginPath} replace state={{ from: location.pathname }} />
  }
  if (!allow.includes(getAccessRole(user))) {
    return <Navigate to={ROUTES.HOME} replace />
  }
  return children ?? <Outlet />
}

export default RequireRole
