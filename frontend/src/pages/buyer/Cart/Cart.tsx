import { useTranslation } from 'react-i18next'
import Breadcrumb from '@/components/common/Breadcrumb'
import { LinkButton } from '@/components/common/Button'
import PageBanner from '@/components/common/PageBanner'
import CartItem from '@/components/features/cart/CartItem'
import CartSummary from '@/components/features/cart/CartSummary'
import { ROUTES } from '@/constants/routes'
import { useCart } from '@/hooks/useCart'
import '@/styles/pages/buyer/Cart.css'

function Cart() {
  const { t } = useTranslation()
  const { items } = useCart()

  return (
    <div className="cart-page">
      <PageBanner title={t('cart.pageTitle')} />

      <div className="container page">
        <Breadcrumb
          items={[
            { label: t('common.breadcrumb.home'), to: ROUTES.HOME },
            { label: t('common.breadcrumb.cart') },
          ]}
        />

        {items.length === 0 ? (
          <div className="cart-page__empty">
            <p>{t('cart.empty')}</p>
            <LinkButton to={ROUTES.PRODUCTS}>{t('common.continueShopping')}</LinkButton>
          </div>
        ) : (
          <div className="cart-page__layout">
            <section className="cart-page__items" aria-label={t('cart.itemsLabel')}>
              <div className="cart-page__head">
                <span>{t('cart.productsColumn')}</span>
                <span>{t('cart.quantityColumn')}</span>
                <span>{t('cart.priceColumn')}</span>
              </div>
              <ul className="cart-page__list">
                {items.map((item) => (
                  <CartItem key={item.key} item={item} />
                ))}
              </ul>
            </section>
            <CartSummary />
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
