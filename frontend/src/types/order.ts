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
  carrierId: string
  carrierName: string
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
  carrierId: string
}

export interface ShippingQuote {
  carrierId: string
  carrierName: string
  description: string
  etaMinDays: number
  etaMaxDays: number
  zone: 'local' | 'nearby' | 'national'
  fee: number
}

export interface ShippingQuotesResult {
  province: string
  zone: ShippingQuote['zone']
  quotes: ShippingQuote[]
}

export interface OrderLookupQuery {
  phone?: string
  email?: string
}
