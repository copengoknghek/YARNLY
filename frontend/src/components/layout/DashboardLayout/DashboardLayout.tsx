import { Link, NavLink, Outlet } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import '@/styles/components/DashboardLayout.css'

export interface DashboardNavItem {
  to: string
  label: string
}

interface DashboardLayoutProps {
  title: string
  navItems: DashboardNavItem[]
}

function DashboardLayout({ title, navItems }: DashboardLayoutProps) {
  const { user, logout } = useAuth()

  return (
    <div className="dashboard">
      <aside className="dashboard__sidebar">
        <Link to={ROUTES.HOME} className="dashboard__logo">
          <img src="/images/brand/logo.png" alt="YARNLY" />
        </Link>
        <p className="dashboard__title">{title}</p>
        <nav className="dashboard__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `dashboard__link ${isActive ? 'dashboard__link--active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="dashboard__account">
          <span>{user?.name}</span>
          <button className="dashboard__logout" onClick={logout}>
            Đăng xuất
          </button>
        </div>
      </aside>
      <main className="dashboard__main">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout
