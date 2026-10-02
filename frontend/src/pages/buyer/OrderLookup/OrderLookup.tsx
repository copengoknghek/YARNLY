import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '@/components/common/Breadcrumb'
import Button from '@/components/common/Button'
import Icon from '@/components/common/Icon'
import Input from '@/components/common/Input'
import Loading from '@/components/common/Loading'
import PageBanner from '@/components/common/PageBanner'
import { ORDER_STATUS_LABELS } from '@/constants/orderStatus'
import { ROUTES, orderSuccessPath } from '@/constants/routes'
import { useFetch } from '@/hooks/useFetch'
import { lookupOrders } from '@/services/orderService'
import type { Order, OrderLookupQuery } from '@/types/order'
import { formatPrice } from '@/utils/formatPrice'
import { isValidEmail, isValidPhone } from '@/utils/validators'
import '@/styles/pages/buyer/OrderLookup.css'

type LookupMethod = 'phone' | 'email'

function LookupResult({ order }: { order: Order }) {
  return (
    <article className="lookup-result">
      <header className="lookup-result__header">
        <h3>Đơn hàng {order.code}</h3>
        <span className="lookup-result__status">{ORDER_STATUS_LABELS[order.status]}</span>
      </header>
      <ul className="lookup-result__items">
        {order.items.map((item, index) => (
          <li key={`${item.product.id}-${index}`} className="lookup-result__item">
            <span className="lookup-result__thumb">
              <img src={item.product.images[0]} alt="" />
              <span>{item.quantity}</span>
            </span>
            <span className="lookup-result__name">{item.product.name}</span>
            <span className="lookup-result__price">{formatPrice(item.unitPrice * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <p className="lookup-result__tracking">
        Mã vận đơn: <strong>{order.trackingCode ?? 'Đang chuẩn bị'}</strong>
      </p>
      <Link to={orderSuccessPath(order.id)} className="lookup-result__link">
        Xem chi tiết đơn hàng <Icon name="arrow-right" size={14} />
      </Link>
    </article>
  )
}

function OrderLookup() {
  const [method, setMethod] = useState<LookupMethod>('phone')
  const [value, setValue] = useState('')
  const [inputError, setInputError] = useState('')
  const [query, setQuery] = useState<OrderLookupQuery | null>(null)

  const fetcher = useMemo(() => (query ? () => lookupOrders(query) : null), [query])
  const { data: orders, loading, error } = useFetch(fetcher)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = value.trim()
    if (method === 'phone' && !isValidPhone(trimmed)) {
      setInputError('Số điện thoại không hợp lệ')
      return
    }
    if (method === 'email' && !isValidEmail(trimmed)) {
      setInputError('Email không hợp lệ')
      return
    }
    setInputError('')
    setQuery(method === 'phone' ? { phone: trimmed.replace(/\s/g, '') } : { email: trimmed })
  }

  return (
    <div className="order-lookup">
      <PageBanner title="Tra cứu đơn hàng" />

      <div className="container page">
        <Breadcrumb items={[{ label: 'Trang chủ', to: ROUTES.HOME }, { label: 'Tra cứu đơn hàng' }]} />

        <div className="order-lookup__layout">
          <form className="order-lookup__form" onSubmit={handleSubmit} noValidate>
            <h2 className="order-lookup__title">
              <Icon name="search" size={14} /> Kiểm tra đơn hàng của bạn
            </h2>

            <fieldset className="order-lookup__methods">
              <legend>Phương thức kiểm tra</legend>
              {(
                [
                  ['phone', 'Số điện thoại'],
                  ['email', 'Email'],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="order-lookup__method">
                  <input
                    type="radio"
                    name="lookup-method"
                    checked={method === key}
                    onChange={() => {
                      setMethod(key)
                      setValue('')
                      setInputError('')
                    }}
                  />
                  {label}
                </label>
              ))}
            </fieldset>

            <Input
              label={method === 'phone' ? 'Số điện thoại' : 'Email'}
              type={method === 'phone' ? 'tel' : 'email'}
              placeholder={method === 'phone' ? 'xxxx xxx xxx' : 'email@vidu.com'}
              value={value}
              error={inputError}
              onChange={(event) => setValue(event.target.value)}
            />

            <p className="order-lookup__hint">
              Để kiểm tra đơn hàng quý khách vui lòng nhập đúng số điện thoại/email đặt hàng vào ô trên!
            </p>
            <Button type="submit" className="order-lookup__submit">
              Kiểm tra
            </Button>
          </form>

          <section className="order-lookup__results" aria-live="polite">
            {!query && <p className="order-lookup__placeholder">Nhập thông tin bên cạnh để xem đơn hàng của bạn.</p>}
            {loading && <Loading />}
            {error && <p className="text-error">{error}</p>}
            {orders && orders.length === 0 && (
              <p className="order-lookup__placeholder">Không tìm thấy đơn hàng nào với thông tin này.</p>
            )}
            {orders?.map((order) => <LookupResult key={order.id} order={order} />)}

            <Link to={ROUTES.CART} className="order-lookup__back">
              <Icon name="chevron-left" size={12} /> Quay về giỏ hàng
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}

export default OrderLookup
