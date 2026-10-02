import type { CartProduct, SelectedOptions } from './cart'
import type { CustomDesign } from './customDesign'

export type OrderStatus = 'placed' | 'crafting' | 'shipping' | 'delivered' | 'cancelled'

export type PaymentMethod = 'momo' | 'zalopay' | 'cod'

export interface ShippingInfo {
  email: string
  fullName: string
  phone: string
  address: string
  province: string
  district: string
  ward: string
}

export interface OrderItem {
  product: CartProduct
  quantity: number
  unitPrice: number
  selectedOptions?: SelectedOptions
  customDesign?: CustomDesign
}

export interface Order {
  id: string
  code: string
  status: OrderStatus
  items: OrderItem[]
  shipping: ShippingInfo
  note: string
  paymentMethod: PaymentMethod
  subtotal: number
  shippingFee: number
  total: number
  estimatedDelivery: string
  trackingCode: string | null
  createdAt: string
}

export interface CreateOrderItem {
  productId: string
  quantity: number
  selectedOptions?: SelectedOptions
  customDesign?: CustomDesign
}

export interface CreateOrderPayload {
  items: CreateOrderItem[]
  shipping: ShippingInfo
  note?: string
  paymentMethod: PaymentMethod
}

export interface OrderLookupQuery {
  phone?: string
  email?: string
}
