import DashboardLayout, { type DashboardNavItem } from '@/components/layout/DashboardLayout'
import { ROUTES } from '@/constants/routes'

const ADMIN_NAV: DashboardNavItem[] = [{ to: ROUTES.ADMIN, label: 'Tổng quan' }]

function AdminLayout() {
  return <DashboardLayout title="Quản trị hệ thống" navItems={ADMIN_NAV} />
}

export default AdminLayout
