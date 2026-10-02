import { useCallback, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Icon from '@/components/common/Icon'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'
import SearchBar from '@/components/layout/SearchBar'
import { MAIN_NAV } from '@/constants/navigation'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { useClickOutside } from '@/hooks/useClickOutside'
import { getAccessRole } from '@/utils/roles'
import '@/styles/components/Header.css'

function Header() {
  const { totalItems } = useCart()
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [lastPath, setLastPath] = useState(pathname)
  const accountRef = useRef<HTMLDivElement>(null)
  const closeAccount = useCallback(() => setAccountOpen(false), [])
  useClickOutside(accountRef, closeAccount, accountOpen)

  if (pathname !== lastPath) {
    setLastPath(pathname)
    setMenuOpen(false)
    setAccountOpen(false)
  }

  const accessRole = user ? getAccessRole(user) : null
  const dashboardLink =
    accessRole === 'seller'
      ? { to: ROUTES.SELLER, label: 'Kênh người bán' }
      : accessRole === 'admin'
        ? { to: ROUTES.ADMIN, label: 'Trang quản trị' }
        : null

  return (
    <header className={`header ${searchOpen ? 'header--search-open' : ''}`}>
      <div className="header__bar">
        <button
          type="button"
          className="header__menu-toggle"
          aria-label="Mở menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
        </button>

        <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`} aria-label="Điều hướng chính">
          {MAIN_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link to={ROUTES.HOME} className="header__logo" aria-label="Yarnly - Trang chủ">
          <img src="/images/brand/logo.png" alt="YARNLY" />
        </Link>

        <div className="header__actions">
          <button
            type="button"
            className="header__icon"
            aria-label="Tìm kiếm"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((value) => !value)}
          >
            <img src="/images/icons/search.svg" alt="" width={16} height={16} />
          </button>

          {user ? (
            <div className="header__account" ref={accountRef}>
              <button
                type="button"
                className="header__icon"
                aria-label="Tài khoản"
                aria-expanded={accountOpen}
                onClick={() => setAccountOpen((value) => !value)}
              >
                <img src="/images/icons/user.svg" alt="" width={18} height={18} />
              </button>
              {accountOpen && (
                <div className="header__account-menu">
                  <p className="header__account-name">{user.name}</p>
                  {dashboardLink && (
                    <Link to={dashboardLink.to} className="header__account-item">
                      {dashboardLink.label}
                    </Link>
                  )}
                  <button type="button" className="header__account-item" onClick={logout}>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to={ROUTES.LOGIN} className="header__icon" aria-label="Đăng nhập">
              <img src="/images/icons/user.svg" alt="" width={18} height={18} />
            </Link>
          )}

          <Link to={ROUTES.CART} className="header__icon header__cart" aria-label={`Giỏ hàng (${totalItems})`}>
            <img src="/images/icons/cart.svg" alt="" width={20} height={20} />
            <span className="header__cart-badge">{totalItems}</span>
          </Link>

          <LanguageSwitcher />
        </div>
      </div>

      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
    </header>
  )
}

export default Header
