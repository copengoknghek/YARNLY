import { useCallback, useState } from 'react'
import Button from '@/components/common/Button'
import Loading from '@/components/common/Loading'
import StatusBadge from '@/components/features/portal/StatusBadge'
import { CATEGORY_LABELS_VI } from '@/constants/categories'
import { useFetch } from '@/hooks/useFetch'
import { approveProduct, getPendingProducts, rejectProduct } from '@/services/adminService'
import { formatDate } from '@/utils/formatDate'
import { formatPrice } from '@/utils/formatPrice'
import '@/styles/pages/portal/Portal.css'

function Approvals() {
  const [refreshKey, setRefreshKey] = useState(0)
  const fetchPending = useCallback(() => getPendingProducts(), [refreshKey])
  const { data: pendingProducts, loading, error } = useFetch(fetchPending)

  const handleApprove = async (productId: string) => {
    await approveProduct(productId)
    setRefreshKey((value) => value + 1)
  }

  const handleReject = async (productId: string) => {
    const note = window.prompt('Lý do từ chối (tùy chọn):') ?? ''
    await rejectProduct(productId, note)
    setRefreshKey((value) => value + 1)
  }

  if (loading) return <Loading />
  if (error) return <p className="text-error">{error}</p>

  return (
    <section className="portal-page">
      <header className="portal-page__header">
        <h1 className="display-title display-title--sm">Duyệt sản phẩm</h1>
        <p className="text-muted">Chỉ sản phẩm đã duyệt mới hiển thị trên trang cửa hàng.</p>
      </header>

      {!pendingProducts || pendingProducts.length === 0 ? (
        <p className="portal-empty">Không có sản phẩm đang chờ duyệt.</p>
      ) : (
        <div className="portal-card portal-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Người bán</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Ngày gửi</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pendingProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <strong>{product.name}</strong>
                    <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                      {product.description}
                    </p>
                  </td>
                  <td>{product.sellerName}</td>
                  <td>{CATEGORY_LABELS_VI[product.category]}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>{formatDate(product.createdAt)}</td>
                  <td><StatusBadge status={product.approvalStatus} /></td>
                  <td>
                    <div className="portal-actions">
                      <Button onClick={() => handleApprove(product.id)}>Duyệt</Button>
                      <Button variant="outline" onClick={() => handleReject(product.id)}>Từ chối</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default Approvals
