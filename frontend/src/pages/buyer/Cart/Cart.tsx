import Breadcrumb from '@/components/common/Breadcrumb'
import { LinkButton } from '@/components/common/Button'
import PageBanner from '@/components/common/PageBanner'
import CartItem from '@/components/features/cart/CartItem'
import CartSummary from '@/components/features/cart/CartSummary'
import { ROUTES } from '@/constants/routes'
import { useCart } from '@/hooks/useCart'
import '@/styles/pages/buyer/Cart.css'

function Cart() {
  const { items } = useCart()

  return (
    <div className="cart-page">
      <PageBanner title="Giỏ hàng của bạn" />

      <div className="container page">
        <Breadcrumb items={[{ label: 'Trang chủ', to: ROUTES.HOME }, { label: 'Giỏ hàng' }]} />

        {items.length === 0 ? (
          <div className="cart-page__empty">
            <p>Giỏ hàng của bạn đang trống.</p>
            <LinkButton to={ROUTES.PRODUCTS}>Tiếp tục mua sắm</LinkButton>
          </div>
        ) : (
          <div className="cart-page__layout">
            <section className="cart-page__items" aria-label="Sản phẩm trong giỏ">
              <div className="cart-page__head">
                <span>Sản phẩm</span>
                <span>Số lượng</span>
                <span>Đơn giá</span>
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
