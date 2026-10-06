import { getIntlLocale } from '@/i18n'

export const formatPrice = (value: number) =>
  new Intl.NumberFormat(getIntlLocale(), {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
