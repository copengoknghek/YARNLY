import DashboardLayout, { type DashboardNavItem } from '@/components/layout/DashboardLayout'
import { ROUTES } from '@/constants/routes'

const SELLER_NAV: DashboardNavItem[] = [
  { to: ROUTES.SELLER, label: 'Tổng quan' },
  { to: ROUTES.SELLER_PRODUCTS, label: 'Sản phẩm của tôi' },
  { to: ROUTES.SELLER_NEW_PRODUCT, label: 'Đăng sản phẩm' },
  { to: ROUTES.SELLER_INVENTORY, label: 'Kho hàng' },
]

function SellerLayout() {
  return <DashboardLayout title="Kênh người bán" navItems={SELLER_NAV} />
}

export default SellerLayout
