import { ROUTES } from './routes'

export const MAIN_NAV = [
  { to: ROUTES.PRODUCTS, labelKey: 'nav.products' },
  { to: ROUTES.CUSTOM_DESIGN, labelKey: 'nav.customDesign' },
  { to: ROUTES.BLIND_BOX, labelKey: 'nav.blindBox' },
  { to: ROUTES.ORDER_LOOKUP, labelKey: 'nav.orderLookup' },
] as const

export const FOOTER_EXPLORE = [
  { to: ROUTES.PRODUCTS, labelKey: 'nav.products' },
  { to: ROUTES.CUSTOM_DESIGN, labelKey: 'nav.customDesign' },
  { to: ROUTES.BLIND_BOX, labelKey: 'nav.blindBox' },
] as const

export const FOOTER_CONTACT_KEYS = [
  'footer.contact.email',
  'footer.contact.hotline',
  'footer.contact.address',
] as const

export const FOOTER_SUPPORT_KEYS = [
  'footer.support.payment',
  'footer.support.return',
  'footer.support.privacy',
  'footer.support.shipping',
] as const

export const LANGUAGES = [
  { code: 'vi', short: 'VN', labelKey: 'language.vi', flag: '/images/flags/vn.svg' },
  { code: 'en', short: 'EN', labelKey: 'language.en', flag: '/images/flags/us.svg' },
  { code: 'zh', short: 'CN', labelKey: 'language.zh', flag: '/images/flags/cn.svg' },
] as const

export type LanguageCode = (typeof LANGUAGES)[number]['code']
