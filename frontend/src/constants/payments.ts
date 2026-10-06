import type { PaymentMethod } from '@/types/order'

export const PAYMENT_METHODS: {
  value: PaymentMethod
  labelKey: string
  shortLabelKey: string
  logo: string
}[] = [
  {
    value: 'momo',
    labelKey: 'payment.momo.label',
    shortLabelKey: 'payment.momo.shortLabel',
    logo: '/images/payments/momo.png',
  },
  {
    value: 'zalopay',
    labelKey: 'payment.zalopay.label',
    shortLabelKey: 'payment.zalopay.shortLabel',
    logo: '/images/payments/zalopay.png',
  },
  {
    value: 'cod',
    labelKey: 'payment.cod.label',
    shortLabelKey: 'payment.cod.shortLabel',
    logo: '/images/payments/cod.svg',
  },
]

export const getPaymentMethod = (value: PaymentMethod) =>
  PAYMENT_METHODS.find((method) => method.value === value) ?? PAYMENT_METHODS[2]
