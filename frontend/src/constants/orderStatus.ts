import type { OrderStatus } from '@/types/order'

export const ORDER_STEPS: { status: Exclude<OrderStatus, 'cancelled'>; label: string }[] = [
  { status: 'placed', label: 'Đã đặt hàng' },
  { status: 'crafting', label: 'Đan móc' },
  { status: 'shipping', label: 'Đang giao hàng' },
  { status: 'delivered', label: 'Đã giao hàng' },
]

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  placed: 'Đã đặt hàng',
  crafting: 'Đang đan móc',
  shipping: 'Đang giao hàng',
  delivered: 'Đã giao hàng',
  cancelled: 'Đã hủy',
}
