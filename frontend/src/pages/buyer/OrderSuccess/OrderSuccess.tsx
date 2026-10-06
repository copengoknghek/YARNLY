import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useParams } from 'react-router-dom'
import Breadcrumb from '@/components/common/Breadcrumb'
import Button from '@/components/common/Button'
import Icon from '@/components/common/Icon'
import Loading from '@/components/common/Loading'
import PageBanner from '@/components/common/PageBanner'
import IdeaBanner from '@/components/features/marketing/IdeaBanner'
import OrderSummary from '@/components/features/order/OrderSummary'
import OrderTimeline from '@/components/features/order/OrderTimeline'
import RelatedProducts from '@/components/features/product/RelatedProducts'
import { getPaymentMethod } from '@/constants/payments'
import { ROUTES } from '@/constants/routes'
import { useFetch } from '@/hooks/useFetch'
import { getOrderById } from '@/services/orderService'
import type { Order } from '@/types/order'
import { formatDate, weeksBetween } from '@/utils/formatDate'
import { countItems, toSummaryLines } from '@/utils/orderLines'
import '@/styles/pages/buyer/OrderSuccess.css'

const formatPhone = (phone: string) => phone.replace(/^0/, '(+84) ').replace(/(\d{3})(\d{3})(\d{3})$/, '$1 $2 $3')

function OrderDetails({ order }: { order: Order }) {
  const { t } = useTranslation()
  const [message, setMessage] = useState('')
  const payment = getPaymentMethod(order.paymentMethod)
  const weeks = weeksBetween(order.createdAt, order.estimatedDelivery)
  const { shipping } = order

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(order.code)
      setMessage(t('orderSuccess.codeCopied', { code: order.code }))
    } catch {
      setMessage(t('orderSuccess.codeFallback', { code: order.code }))
    }
  }

  return (
    <div className="order-success__layout">
      <div className="order-success__cards">
        <section className="order-card">
          <h2 className="order-card__title">{t('orderSuccess.statusTitle')}</h2>
          <OrderTimeline status={order.status} />
          <p className="order-card__eta">
            {t('orderSuccess.statusEta', {
              weeks,
              date: formatDate(order.estimatedDelivery),
            })}
          </p>
        </section>

        <section className="order-card">
          <div className="order-card__header">
            <h2 className="order-card__title">{t('orderSuccess.shippingTitle')}</h2>
            <button
              type="button"
              className="order-card__pill"
              onClick={() => setMessage(t('orderSuccess.changeAddressNotice'))}
            >
              {t('orderSuccess.changeAddress')}
            </button>
          </div>
          <p className="order-card__name">{shipping.fullName}</p>
          <p className="order-card__muted">{formatPhone(shipping.phone)}</p>
          <p className="order-card__address">
            {shipping.address}, {shipping.ward}, {shipping.district},<br />
            {shipping.province}, {t('common.country')}
          </p>
        </section>

        <section className="order-card">
          <h2 className="order-card__title">{t('orderSuccess.paymentTitle')}</h2>
          <div className="order-card__payment">
            <img src={payment.logo} alt="" />
            <div>
              <p className="order-card__name">{t(payment.shortLabelKey)}</p>
              <p className="order-card__muted">
                {order.paymentMethod === 'cod' ? t('orderSuccess.paymentCod') : t('orderSuccess.paymentPending')}
              </p>
            </div>
            {order.paymentMethod !== 'cod' && (
              <button
                type="button"
                className="order-card__pill order-card__pill--small"
                onClick={() => setMessage(t('orderSuccess.paymentGatewayNotice'))}
              >
                {t('orderSuccess.paymentPayNow')}
              </button>
            )}
          </div>
        </section>
      </div>

      <aside className="order-success__summary">
        <div className="order-success__summary-card">
          <OrderSummary
            title={t('orderSuccess.summaryTitle', { code: order.code, count: countItems(order) })}
            lines={toSummaryLines(order)}
            subtotal={order.subtotal}
            shippingFee={order.shippingFee}
            total={order.total}
          />
        </div>
        <div className="order-success__actions">
          <Link to={ROUTES.CART} className="order-success__back">
            <Icon name="chevron-left" size={12} /> {t('common.backToCart')}
          </Link>
          <Button className="order-success__code" onClick={copyCode}>
            {t('orderSuccess.copyCode')}
          </Button>
        </div>
        {message && (
          <p className="order-success__message" role="status">
            {message}
          </p>
        )}
      </aside>
    </div>
  )
}

function OrderSuccess() {
  const { t } = useTranslation()
  const { id = '' } = useParams()
  const location = useLocation()
  const confirmationEmail =
    (location.state as { confirmationEmail?: string } | null)?.confirmationEmail ?? null
  const fetchOrder = useCallback(() => getOrderById(id), [id])
  const { data: order, loading, error } = useFetch(fetchOrder)

  return (
    <div className="order-success">
      <PageBanner title={t('orderSuccess.pageTitle')} subtitle={t('orderSuccess.subtitle')} />

      <div className="container page">
        <Breadcrumb
          items={[
            { label: t('common.breadcrumb.home'), to: ROUTES.HOME },
            { label: t('common.breadcrumb.cart'), to: ROUTES.CART },
            { label: t('common.breadcrumb.checkout'), to: ROUTES.CHECKOUT },
            { label: t('orderSuccess.breadcrumbConfirmed') },
          ]}
        />
        {(confirmationEmail || order?.shipping.email) && (
          <p className="order-success__email-notice" role="status">
            {t('orderSuccess.emailNotice', { email: confirmationEmail ?? order?.shipping.email })}
          </p>
        )}
        {loading && <Loading />}
        {error && (
          <p className="text-error">
            {error} {t('orderSuccess.errorLookupHint')}{' '}
            <Link to={ROUTES.ORDER_LOOKUP}>{t('orderSuccess.errorLookupLink')}</Link>{' '}
            {t('orderSuccess.errorLookupSuffix')}
          </p>
        )}
        {order && <OrderDetails order={order} />}
      </div>

      <RelatedProducts />
      <IdeaBanner />
    </div>
  )
}

export default OrderSuccess
