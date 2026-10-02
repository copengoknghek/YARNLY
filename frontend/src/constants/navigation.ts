import { ROUTES } from './routes'

export const MAIN_NAV = [
  { to: ROUTES.PRODUCTS, label: 'Sản phẩm' },
  { to: ROUTES.CUSTOM_DESIGN, label: 'Thiết kế riêng' },
  { to: ROUTES.BLIND_BOX, label: 'Blind box' },
  { to: ROUTES.ORDER_LOOKUP, label: 'Tra cứu đơn hàng' },
] as const

export const FOOTER_EXPLORE = [
  { to: ROUTES.PRODUCTS, label: 'Sản phẩm' },
  { to: ROUTES.CUSTOM_DESIGN, label: 'Thiết kế riêng' },
  { to: ROUTES.BLIND_BOX, label: 'Blind box' },
] as const

export const FOOTER_CONTACT = [
  'Email: hello@yarnly.vn',
  'Hotline: 1900 1234',
  'Địa chỉ: TP. Đà Nẵng',
] as const

export const FOOTER_SUPPORT = [
  'Chính sách thanh toán',
  'Chính sách đổi trả',
  'Chính sách bảo mật',
  'Chính sách vận chuyển',
] as const

export const LANGUAGES = [
  { code: 'vi', short: 'VN', label: 'Tiếng Việt (VN)', flag: '/images/flags/vn.svg' },
  { code: 'en', short: 'EN', label: 'English (USA)', flag: '/images/flags/us.svg' },
  { code: 'ko', short: 'KR', label: 'Korean (KRN)', flag: '/images/flags/kr.svg' },
  { code: 'zh', short: 'CN', label: 'Chinese (CN)', flag: '/images/flags/cn.svg' },
] as const

export type LanguageCode = (typeof LANGUAGES)[number]['code']
