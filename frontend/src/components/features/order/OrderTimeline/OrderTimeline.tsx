import { useTranslation } from 'react-i18next'
import { ORDER_STEPS, ORDER_TIMELINE_STATE_KEYS } from '@/constants/orderStatus'
import type { OrderStatus } from '@/types/order'
import '@/styles/components/OrderTimeline.css'

type StepState = 'done' | 'current' | 'pending'

function OrderTimeline({ status }: { status: OrderStatus }) {
  const { t } = useTranslation()

  if (status === 'cancelled') {
    return <p className="order-timeline__cancelled">{t('order.cancelled')}</p>
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
            <span className="order-timeline__label">{t(step.labelKey)}</span>
            <span className="order-timeline__state">{t(ORDER_TIMELINE_STATE_KEYS[state])}</span>
          </li>
        )
      })}
    </ol>
  )
}

export default OrderTimeline
