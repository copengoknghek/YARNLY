import type { PaymentMethod } from '@/types/order'

export const PAYMENT_METHODS: { value: PaymentMethod; label: string; shortLabel: string; logo: string }[] = [
  { value: 'momo', label: 'Thanh toán qua MoMo QR đa năng', shortLabel: 'Ví MoMo', logo: '/images/payments/momo.png' },
  { value: 'zalopay', label: 'Thanh toán qua ZaloPay', shortLabel: 'ZaloPay', logo: '/images/payments/zalopay.png' },
  { value: 'cod', label: 'Thu hộ (COD)', shortLabel: 'Thanh toán khi nhận hàng', logo: '/images/payments/cod.svg' },
]

export const getPaymentMethod = (value: PaymentMethod) =>
  PAYMENT_METHODS.find((method) => method.value === value) ?? PAYMENT_METHODS[2]
