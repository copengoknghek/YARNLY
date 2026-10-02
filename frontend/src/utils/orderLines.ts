import type { OrderSummaryLine } from '@/components/features/order/OrderSummary'
import type { Order } from '@/types/order'
import { describeItemOptions } from './cartItem'

export const toSummaryLines = (order: Order): OrderSummaryLine[] =>
  order.items.map((item, index) => ({
    key: `${item.product.id}-${index}`,
    name: item.product.name,
    image: item.product.images[0],
    quantity: item.quantity,
    price: item.unitPrice,
    optionsText: describeItemOptions(item.selectedOptions, item.customDesign),
  }))

export const countItems = (order: Order) => order.items.reduce((sum, item) => sum + item.quantity, 0)
