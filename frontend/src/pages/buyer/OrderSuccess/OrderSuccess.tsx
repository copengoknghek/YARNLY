import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
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
  const [message, setMessage] = useState('')
  const payment = getPaymentMethod(order.paymentMethod)
  const weeks = weeksBetween(order.createdAt, order.estimatedDelivery)
  const { shipping } = order

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(order.code)
      setMessage(`Đã sao chép mã đơn hàng ${order.code}`)
    } catch {
      setMessage(`Mã đơn hàng của bạn: ${order.code}`)
    }
  }

  return (
    <div className="order-success__layout">
      <div className="order-success__cards">
        <section className="order-card">
          <h2 className="order-card__title">Trạng thái đơn hàng</h2>
          <OrderTimeline status={order.status} />
          <p className="order-card__eta">
            Dự kiến giao hàng: {weeks} tuần nữa, {formatDate(order.estimatedDelivery)}, vui lòng nghe điện thoại khi
            nhận hàng
          </p>
        </section>

        <section className="order-card">
          <div className="order-card__header">
            <h2 className="order-card__title">Chi tiết giao hàng</h2>
            <button
              type="button"
              className="order-card__pill"
              onClick={() => setMessage('Vui lòng gọi hotline 1900 1234 để thay đổi địa chỉ giao hàng.')}
            >
              Thay đổi thông tin địa chỉ
            </button>
          </div>
          <p className="order-card__name">{shipping.fullName}</p>
          <p className="order-card__muted">{formatPhone(shipping.phone)}</p>
          <p className="order-card__address">
            {shipping.address}, {shipping.ward}, {shipping.district},<br />
            {shipping.province}, Việt Nam
          </p>
        </section>

        <section className="order-card">
          <h2 className="order-card__title">Phương thức thanh toán</h2>
          <div className="order-card__payment">
            <img src={payment.logo} alt="" />
            <div>
              <p className="order-card__name">{payment.shortLabel}</p>
              <p className="order-card__muted">
                {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chờ thanh toán'}
              </p>
            </div>
            {order.paymentMethod !== 'cod' && (
              <button
                type="button"
                className="order-card__pill order-card__pill--small"
                onClick={() => setMessage('Cổng thanh toán trực tuyến sẽ sớm được tích hợp.')}
              >
                Trả
              </button>
            )}
          </div>
        </section>
      </div>

      <aside className="order-success__summary">
        <div className="order-success__summary-card">
          <OrderSummary
            title={`Đơn hàng ${order.code} (${countItems(order)} sản phẩm)`}
            lines={toSummaryLines(order)}
            subtotal={order.subtotal}
            shippingFee={order.shippingFee}
            total={order.total}
          />
        </div>
        <div className="order-success__actions">
          <Link to={ROUTES.CART} className="order-success__back">
            <Icon name="chevron-left" size={12} /> Quay về giỏ hàng
          </Link>
          <Button className="order-success__code" onClick={copyCode}>
            Lấy mã vận đơn
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
  const { id = '' } = useParams()
  const fetchOrder = useCallback(() => getOrderById(id), [id])
  const { data: order, loading, error } = useFetch(fetchOrder)

  return (
    <div className="order-success">
      <PageBanner title="Đặt hàng thành công" subtitle="Cảm ơn bạn đã tin tưởng và ủng hộ Yarnly nhé!" />

      <div className="container page">
        <Breadcrumb
          items={[
            { label: 'Trang chủ', to: ROUTES.HOME },
            { label: 'Giỏ hàng', to: ROUTES.CART },
            { label: 'Thanh toán', to: ROUTES.CHECKOUT },
            { label: 'Đơn hàng đã được xác nhận' },
          ]}
        />
        {loading && <Loading />}
        {error && (
          <p className="text-error">
            {error} Bạn có thể <Link to={ROUTES.ORDER_LOOKUP}>tra cứu đơn hàng</Link> bằng số điện thoại.
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
