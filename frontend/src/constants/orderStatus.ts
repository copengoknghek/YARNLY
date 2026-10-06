import type { OrderStatus } from '@/types/order'

export const ORDER_STEPS: { status: Exclude<OrderStatus, 'cancelled'>; labelKey: string }[] = [
  { status: 'placed', labelKey: 'order.steps.placed' },
  { status: 'crafting', labelKey: 'order.steps.crafting' },
  { status: 'shipping', labelKey: 'order.steps.shipping' },
  { status: 'delivered', labelKey: 'order.steps.delivered' },
]

export const ORDER_STATUS_LABEL_KEYS: Record<OrderStatus, string> = {
  placed: 'order.status.placed',
  crafting: 'order.status.crafting',
  shipping: 'order.status.shipping',
  delivered: 'order.status.delivered',
  cancelled: 'order.status.cancelled',
}

export const ORDER_STATUS_LABELS_VI: Record<OrderStatus, string> = {
  placed: 'Đã đặt hàng',
  crafting: 'Đang đan móc',
  shipping: 'Đang giao hàng',
  delivered: 'Đã giao hàng',
  cancelled: 'Đã hủy',
}

export const ORDER_TIMELINE_STATE_KEYS = {
  done: 'order.timelineState.done',
  current: 'order.timelineState.current',
  pending: 'order.timelineState.pending',
} as const
