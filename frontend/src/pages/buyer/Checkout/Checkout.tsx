import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import Breadcrumb from '@/components/common/Breadcrumb'
import Button, { LinkButton } from '@/components/common/Button'
import Icon from '@/components/common/Icon'
import PageBanner from '@/components/common/PageBanner'
import CheckoutForm, { type CheckoutErrors } from '@/components/features/checkout/CheckoutForm'
import CouponInput from '@/components/features/checkout/CouponInput'
import PaymentMethods from '@/components/features/checkout/PaymentMethods'
import OrderSummary from '@/components/features/order/OrderSummary'
import i18n from '@/i18n'
import { ROUTES, orderSuccessPath } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { getErrorMessage } from '@/services/api'
import { createOrder } from '@/services/orderService'
import { getShippingQuotes } from '@/services/shippingService'
import type { PaymentMethod, ShippingInfo, ShippingQuote } from '@/types/order'
import { describeItemOptions } from '@/utils/cartItem'
import { formatPrice } from '@/utils/formatPrice'
import { isValidEmail, isValidPhone } from '@/utils/validators'
import '@/styles/pages/buyer/Checkout.css'

const FORM_ID = 'checkout-form'

const validate = (shipping: ShippingInfo): CheckoutErrors => {
  const errors: CheckoutErrors = {}
  if (!isValidEmail(shipping.email)) errors.email = i18n.t('common.validation.emailInvalid')
  if (!shipping.fullName.trim()) errors.fullName = i18n.t('common.validation.fullNameRequired')
  if (!isValidPhone(shipping.phone)) errors.phone = i18n.t('common.validation.phoneInvalid')
  if (!shipping.address.trim()) errors.address = i18n.t('common.validation.addressRequired')
  if (!shipping.province) errors.province = i18n.t('common.validation.provinceRequired')
  if (!shipping.district) errors.district = i18n.t('common.validation.districtRequired')
  if (!shipping.ward) errors.ward = i18n.t('common.validation.wardRequired')
  return errors
}

function Checkout() {
  const { t } = useTranslation()
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
  const [carrierId, setCarrierId] = useState('')
  const [quotes, setQuotes] = useState<ShippingQuote[]>([])
  const [quotesLoading, setQuotesLoading] = useState(false)
  const [quotesError, setQuotesError] = useState('')
  const [errors, setErrors] = useState<CheckoutErrors>({})
  const [paymentError, setPaymentError] = useState('')
  const [carrierError, setCarrierError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!shipping.province) {
      setQuotes([])
      setCarrierId('')
      return
    }

    let cancelled = false
    setQuotesLoading(true)
    setQuotesError('')

    getShippingQuotes(shipping.province)
      .then((result) => {
        if (cancelled) return
        setQuotes(result.quotes)
        setCarrierId((current) =>
          current && result.quotes.some((quote) => quote.carrierId === current)
            ? current
            : (result.quotes[0]?.carrierId ?? ''),
        )
      })
      .catch((error) => {
        if (cancelled) return
        setQuotes([])
        setCarrierId('')
        setQuotesError(getErrorMessage(error))
      })
      .finally(() => {
        if (!cancelled) setQuotesLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [shipping.province])

  const selectedQuote = quotes.find((quote) => quote.carrierId === carrierId) ?? null
  const shippingFee = selectedQuote?.fee ?? null
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate(shipping)
    setErrors(nextErrors)
    setPaymentError(paymentMethod ? '' : t('checkout.validationPaymentRequired'))
    setCarrierError(carrierId ? '' : t('checkout.validationCarrierRequired'))
    if (Object.keys(nextErrors).length > 0 || !paymentMethod || !carrierId) return

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
        carrierId,
      })
      clearCart()
      navigate(orderSuccessPath(order.id), { state: { confirmationEmail: shipping.email } })
    } catch (error) {
      setSubmitError(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <PageBanner title={t('checkout.pageTitle')} />
        <div className="container page checkout-page__empty">
          <p>{t('checkout.empty')}</p>
          <LinkButton to={ROUTES.PRODUCTS}>{t('common.continueShopping')}</LinkButton>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <PageBanner title={t('checkout.pageTitle')} />

      <div className="container page">
        <Breadcrumb
          items={[
            { label: t('common.breadcrumb.home'), to: ROUTES.HOME },
            { label: t('common.breadcrumb.cart'), to: ROUTES.CART },
            { label: t('common.breadcrumb.checkout') },
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
                <h2 className="checkout-page__section-title">{t('checkout.shippingTitle')}</h2>
                {!shipping.province ? (
                  <p className="checkout-page__notice">{t('checkout.shippingEnterAddress')}</p>
                ) : quotesLoading ? (
                  <p className="checkout-page__notice">{t('checkout.shippingLoadingQuotes')}</p>
                ) : quotesError ? (
                  <p className="text-error checkout-page__notice">{quotesError}</p>
                ) : quotes.length === 0 ? (
                  <p className="checkout-page__notice">{t('checkout.shippingNoCarriers')}</p>
                ) : (
                  <fieldset className="checkout-page__carriers">
                    <legend className="visually-hidden">{t('checkout.shippingSelectCarrier')}</legend>
                    {quotes.map((quote) => (
                      <label key={quote.carrierId} className="checkout-page__carrier">
                        <input
                          type="radio"
                          name="carrier"
                          value={quote.carrierId}
                          checked={carrierId === quote.carrierId}
                          onChange={() => {
                            setCarrierId(quote.carrierId)
                            setCarrierError('')
                          }}
                        />
                        <span className="checkout-page__carrier-body">
                          <span className="checkout-page__carrier-name">{quote.carrierName}</span>
                          <span className="checkout-page__carrier-meta">
                            {t('checkout.shippingCarrierEta', {
                              description: quote.description,
                              min: quote.etaMinDays,
                              max: quote.etaMaxDays,
                            })}
                          </span>
                        </span>
                        <strong>{formatPrice(quote.fee)}</strong>
                      </label>
                    ))}
                  </fieldset>
                )}
                {carrierError && <p className="text-error checkout-page__carrier-error">{carrierError}</p>}
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
              title={t('checkout.orderSummaryTitle', { count: itemCount })}
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
                <Icon name="chevron-left" size={12} /> {t('common.backToCart')}
              </Link>
              <Button type="submit" form={FORM_ID} disabled={submitting} className="checkout-page__submit">
                {submitting ? t('checkout.submitting') : t('checkout.submit')}
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Checkout
