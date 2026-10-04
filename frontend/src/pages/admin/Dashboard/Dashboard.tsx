import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import StatCard from '@/components/features/portal/StatCard'
import Loading from '@/components/common/Loading'
import { ORDER_STATUS_LABELS } from '@/constants/orderStatus'
import { ROUTES } from '@/constants/routes'
import { useFetch } from '@/hooks/useFetch'
import { getAdminStats } from '@/services/adminService'
import '@/styles/pages/portal/Portal.css'
import '@/styles/pages/admin/Dashboard.css'

function AdminDashboard() {
  const fetchStats = useCallback(() => getAdminStats(), [])
  const { data: stats, loading, error } = useFetch(fetchStats)

  if (loading) return <Loading />
  if (error) return <p className="text-error">{error}</p>
  if (!stats) return null

  return (
    <section className="portal-page admin-dashboard">
      <header className="portal-page__header">
        <h1 className="display-title display-title--sm">Tổng quan quản trị</h1>
        <p className="text-muted">Theo dõi đơn hàng và sản phẩm chờ duyệt trên hệ thống.</p>
      </header>

      <div className="portal-stats">
        <StatCard label="Tổng đơn hàng" value={stats.totalOrders} />
        <StatCard label="Chờ duyệt SP" value={stats.pendingProducts} />
        <StatCard label="Đang đan móc" value={stats.byStatus.crafting ?? 0} />
        <StatCard label="Đang giao" value={stats.byStatus.shipping ?? 0} />
      </div>

      <div className="portal-card">
        <h2 className="portal-card__title">Đơn hàng theo trạng thái</h2>
        <ul className="portal-empty">
          {Object.entries(ORDER_STATUS_LABELS).map(([status, label]) => (
            <li key={status}>
              {label}: {stats.byStatus[status] ?? 0}
            </li>
          ))}
        </ul>
      </div>

      <div className="portal-card">
        <h2 className="portal-card__title">Thao tác nhanh</h2>
        <div className="portal-actions">
          <Link to={ROUTES.ADMIN_APPROVALS} className="auth-page__link">Duyệt sản phẩm</Link>
          <Link to={ROUTES.ADMIN_ORDERS} className="auth-page__link">Xem đơn hàng</Link>
        </div>
      </div>
    </section>
  )
}

export default AdminDashboard
