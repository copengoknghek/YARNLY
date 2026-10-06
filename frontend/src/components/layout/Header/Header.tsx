import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
      ? { to: ROUTES.SELLER, labelKey: 'header.sellerPortal' }
      : accessRole === 'admin'
        ? { to: ROUTES.ADMIN, labelKey: 'header.adminPortal' }
        : null

  return (
    <header className={`header ${searchOpen ? 'header--search-open' : ''}`}>
      <div className="header__bar">
        <button
          type="button"
          className="header__menu-toggle"
          aria-label={t('header.menuOpen')}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
        </button>

        <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`} aria-label={t('header.navMain')}>
          {MAIN_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>

        <Link to={ROUTES.HOME} className="header__logo" aria-label={t('common.brandHome')}>
          <img src="/images/brand/logo.png" alt="YARNLY" />
        </Link>

        <div className="header__actions">
          <button
            type="button"
            className="header__icon"
            aria-label={t('header.search')}
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
                aria-label={t('header.account')}
                aria-expanded={accountOpen}
                onClick={() => setAccountOpen((value) => !value)}
              >
                <img src="/images/icons/user.svg" alt="" width={18} height={18} />
              </button>
              {accountOpen && (
                <div className="header__account-menu">
                  <p className="header__account-name">{user.name}</p>
                  <Link to={ROUTES.ACCOUNT} className="header__account-item">
                    {t('header.accountProfile')}
                  </Link>
                  {dashboardLink && (
                    <Link to={dashboardLink.to} className="header__account-item">
                      {t(dashboardLink.labelKey)}
                    </Link>
                  )}
                  <button type="button" className="header__account-item" onClick={logout}>
                    {t('header.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to={ROUTES.LOGIN} className="header__icon" aria-label={t('header.login')}>
              <img src="/images/icons/user.svg" alt="" width={18} height={18} />
            </Link>
          )}

          <Link to={ROUTES.CART} className="header__icon header__cart" aria-label={t('header.cart', { count: totalItems })}>
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
