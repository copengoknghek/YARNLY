import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import StatCard from '@/components/features/portal/StatCard'
import Loading from '@/components/common/Loading'
import { ROUTES } from '@/constants/routes'
import { useFetch } from '@/hooks/useFetch'
import { getSellerStats } from '@/services/sellerService'
import '@/styles/pages/portal/Portal.css'
import '@/styles/pages/seller/Dashboard.css'

function SellerDashboard() {
  const fetchStats = useCallback(() => getSellerStats(), [])
  const { data: stats, loading, error } = useFetch(fetchStats)

  if (loading) return <Loading />
  if (error) return <p className="text-error">{error}</p>
  if (!stats) return null

  return (
    <section className="portal-page seller-dashboard">
      <header className="portal-page__header">
        <h1 className="display-title display-title--sm">Tổng quan người bán</h1>
        <p className="text-muted">Theo dõi trạng thái duyệt sản phẩm và tình trạng kho hàng.</p>
      </header>

      <div className="portal-stats">
        <StatCard label="Chờ duyệt" value={stats.pending} />
        <StatCard label="Đã duyệt" value={stats.approved} />
        <StatCard label="Từ chối" value={stats.rejected} />
        <StatCard label="Sắp hết hàng" value={stats.lowStock} />
      </div>

      <div className="portal-card">
        <h2 className="portal-card__title">Thao tác nhanh</h2>
        <div className="portal-actions">
          <Link to={ROUTES.SELLER_NEW_PRODUCT} className="auth-page__link">Đăng sản phẩm mới</Link>
          <Link to={ROUTES.SELLER_PRODUCTS} className="auth-page__link">Xem sản phẩm của tôi</Link>
          <Link to={ROUTES.SELLER_INVENTORY} className="auth-page__link">Quản lý kho</Link>
        </div>
      </div>
    </section>
  )
}

export default SellerDashboard
