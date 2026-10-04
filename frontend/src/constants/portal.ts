import type { ApprovalStatus } from '@/types/portal'

export const DEMO_STAFF_EMAIL = 'staff@yarnly.vn'
export const DEMO_STAFF_PASSWORD = 'yarnly-staff'

export const DEMO_SELLER_EMAIL = 'seller@yarnly.vn'
export const DEMO_SELLER_PASSWORD = 'yarnly-seller'

export const APPROVAL_STATUS_LABELS: Record<ApprovalStatus, string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
}

export const LOW_STOCK_THRESHOLD = 5

export const PLACEHOLDER_PRODUCT_IMAGE = '/images/products/moc-khoa-huou-cao-co.jpg'
