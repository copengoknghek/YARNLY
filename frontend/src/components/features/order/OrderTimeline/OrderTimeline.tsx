import { ORDER_STEPS } from '@/constants/orderStatus'
import type { OrderStatus } from '@/types/order'
import '@/styles/components/OrderTimeline.css'

type StepState = 'done' | 'current' | 'pending'

const STATE_LABELS: Record<StepState, string> = {
  done: 'Hoàn thành',
  current: 'Đang làm',
  pending: 'Chờ xử lí',
}

function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === 'cancelled') {
    return <p className="order-timeline__cancelled">Đơn hàng đã bị hủy.</p>
  }

  const reached = ORDER_STEPS.findIndex((step) => step.status === status)
  const isFinished = status === 'delivered'

  const stateOf = (index: number): StepState => {
    if (index <= reached) return 'done'
    if (index === reached + 1 && !isFinished) return 'current'
    return 'pending'
  }

  return (
    <ol className="order-timeline">
      {ORDER_STEPS.map((step, index) => {
        const state = stateOf(index)
        return (
          <li key={step.status} className={`order-timeline__step order-timeline__step--${state}`}>
            <span className="order-timeline__number">{index + 1}</span>
            <span className="order-timeline__label">{step.label}</span>
            <span className="order-timeline__state">{STATE_LABELS[state]}</span>
          </li>
        )
      })}
    </ol>
  )
}

export default OrderTimeline
