import DashboardLayout, { type DashboardNavItem } from '@/components/layout/DashboardLayout'
import { ROUTES } from '@/constants/routes'

const SELLER_NAV: DashboardNavItem[] = [{ to: ROUTES.SELLER, label: 'Tổng quan' }]

function SellerLayout() {
  return <DashboardLayout title="Kênh người bán" navItems={SELLER_NAV} />
}

export default SellerLayout
