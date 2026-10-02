import type { ReactNode } from 'react'
import { formatPrice } from '@/utils/formatPrice'
import '@/styles/components/OrderSummary.css'

export interface OrderSummaryLine {
  key: string
  name: string
  image?: string
  quantity: number
  price: number
  optionsText?: string
}

interface OrderSummaryProps {
  title: string
  lines: OrderSummaryLine[]
  subtotal: number
  shippingFee: number | null
  total: number
  /** Rendered between the item list and the totals (e.g. a coupon field). */
  children?: ReactNode
  className?: string
}

function OrderSummary({ title, lines, subtotal, shippingFee, total, children, className = '' }: OrderSummaryProps) {
  return (
    <section className={`order-summary ${className}`}>
      <h2 className="order-summary__title">{title}</h2>

      <ul className="order-summary__items">
        {lines.map((line) => (
          <li key={line.key} className="order-summary__item">
            <span className="order-summary__thumb">
              {line.image && <img src={line.image} alt="" />}
              <span className="order-summary__qty" aria-label={`Số lượng ${line.quantity}`}>
                {line.quantity}
              </span>
            </span>
            <span className="order-summary__name">
              {line.name}
              {line.optionsText && <small>{line.optionsText}</small>}
            </span>
            <span className="order-summary__price">{formatPrice(line.price * line.quantity)}</span>
          </li>
        ))}
      </ul>

      {children && <div className="order-summary__extra">{children}</div>}

      <dl className="order-summary__totals">
        <div>
          <dt>Tạm tính</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div>
          <dt>Phí vận chuyển</dt>
          <dd>{shippingFee === null ? '--------' : formatPrice(shippingFee)}</dd>
        </div>
      </dl>

      <div className="order-summary__total">
        <span>Tổng cộng</span>
        <strong>{formatPrice(total)}</strong>
      </div>
    </section>
  )
}

export default OrderSummary
