import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Breadcrumb from '@/components/common/Breadcrumb'
import Button, { LinkButton } from '@/components/common/Button'
import Icon from '@/components/common/Icon'
import PageBanner from '@/components/common/PageBanner'
import CheckoutForm, { type CheckoutErrors } from '@/components/features/checkout/CheckoutForm'
import CouponInput from '@/components/features/checkout/CouponInput'
import PaymentMethods from '@/components/features/checkout/PaymentMethods'
import OrderSummary from '@/components/features/order/OrderSummary'
import { ROUTES, orderSuccessPath } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { getErrorMessage } from '@/services/api'
import { createOrder } from '@/services/orderService'
import type { PaymentMethod, ShippingInfo } from '@/types/order'
import { describeItemOptions } from '@/utils/cartItem'
import { formatPrice } from '@/utils/formatPrice'
import { calculateShippingFee } from '@/utils/shipping'
import { isValidEmail, isValidPhone } from '@/utils/validators'
import '@/styles/pages/buyer/Checkout.css'

const FORM_ID = 'checkout-form'

const validate = (shipping: ShippingInfo): CheckoutErrors => {
  const errors: CheckoutErrors = {}
  if (!isValidEmail(shipping.email)) errors.email = 'Email không hợp lệ'
  if (!shipping.fullName.trim()) errors.fullName = 'Vui lòng nhập họ tên'
  if (!isValidPhone(shipping.phone)) errors.phone = 'Số điện thoại không hợp lệ'
  if (!shipping.address.trim()) errors.address = 'Vui lòng nhập địa chỉ'
  if (!shipping.province) errors.province = 'Vui lòng chọn tỉnh thành'
  if (!shipping.district) errors.district = 'Vui lòng chọn quận huyện'
  if (!shipping.ward) errors.ward = 'Vui lòng chọn phường xã'
  return errors
}

function Checkout() {
  const { items, totalPrice, note, setNote, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [shipping, setShipping] = useState<ShippingInfo>({
    email: user?.email ?? '',
    fullName: user?.name ?? '',
    phone: user?.phone ?? '',
    address: '',
    province: '',
    district: '',
    ward: '',
  })
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('')
  const [errors, setErrors] = useState<CheckoutErrors>({})
  const [paymentError, setPaymentError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const shippingFee = shipping.province ? calculateShippingFee(shipping.province) : null
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate(shipping)
    setErrors(nextErrors)
    setPaymentError(paymentMethod ? '' : 'Vui lòng chọn phương thức thanh toán')
    if (Object.keys(nextErrors).length > 0 || !paymentMethod) return

    setSubmitting(true)
    setSubmitError('')
    try {
      const order = await createOrder({
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions,
          customDesign: item.customDesign,
        })),
        shipping: { ...shipping, phone: shipping.phone.replace(/\s/g, '') },
        note: note.trim() || undefined,
        paymentMethod,
      })
      clearCart()
      navigate(orderSuccessPath(order.id))
    } catch (error) {
      setSubmitError(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <PageBanner title="Thanh toán" />
        <div className="container page checkout-page__empty">
          <p>Giỏ hàng của bạn đang trống.</p>
          <LinkButton to={ROUTES.PRODUCTS}>Tiếp tục mua sắm</LinkButton>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <PageBanner title="Thanh toán" />

      <div className="container page">
        <Breadcrumb
          items={[
            { label: 'Trang chủ', to: ROUTES.HOME },
            { label: 'Giỏ hàng', to: ROUTES.CART },
            { label: 'Thanh toán' },
          ]}
        />

        <div className="checkout-page__layout">
          <form id={FORM_ID} className="checkout-page__form" onSubmit={handleSubmit} noValidate>
            <CheckoutForm
              value={shipping}
              note={note}
              errors={errors}
              onChange={(patch) => setShipping((current) => ({ ...current, ...patch }))}
              onNoteChange={setNote}
            />

            <div className="checkout-page__side">
              <section>
                <h2 className="checkout-page__section-title">Vận chuyển</h2>
                {shippingFee === null ? (
                  <p className="checkout-page__notice">Vui lòng nhập thông tin giao hàng</p>
                ) : (
                  <p className="checkout-page__shipping">
                    <span>Giao hàng tiêu chuẩn đến {shipping.province}</span>
                    <strong>{formatPrice(shippingFee)}</strong>
                  </p>
                )}
              </section>

              <PaymentMethods
                value={paymentMethod}
                error={paymentError}
                onChange={(value) => {
                  setPaymentMethod(value)
                  setPaymentError('')
                }}
              />
            </div>
          </form>

          <aside className="checkout-page__summary">
            <OrderSummary
              title={`Đơn hàng (${itemCount} sản phẩm)`}
              lines={items.map((item) => ({
                key: item.key,
                name: item.product.name,
                image: item.product.images[0],
                quantity: item.quantity,
                price: item.product.price,
                optionsText: describeItemOptions(item.selectedOptions, item.customDesign),
              }))}
              subtotal={totalPrice}
              shippingFee={shippingFee}
              total={totalPrice + (shippingFee ?? 0)}
            >
              <CouponInput />
            </OrderSummary>

            {submitError && <p className="text-error checkout-page__error">{submitError}</p>}

            <div className="checkout-page__actions">
              <Link to={ROUTES.CART} className="checkout-page__back">
                <Icon name="chevron-left" size={12} /> Quay về giỏ hàng
              </Link>
              <Button type="submit" form={FORM_ID} disabled={submitting} className="checkout-page__submit">
                {submitting ? 'Đang đặt hàng...' : 'Đặt hàng'}
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Checkout
