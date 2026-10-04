import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/common/Button'
import Loading from '@/components/common/Loading'
import StatusBadge from '@/components/features/portal/StatusBadge'
import { ROUTES, sellerEditProductPath } from '@/constants/routes'
import { useFetch } from '@/hooks/useFetch'
import { getSellerProducts } from '@/services/sellerService'
import { formatPrice } from '@/utils/formatPrice'
import '@/styles/pages/portal/Portal.css'

function SellerProducts() {
  const fetchProducts = useCallback(() => getSellerProducts(), [])
  const { data: products, loading, error } = useFetch(fetchProducts)

  if (loading) return <Loading />
  if (error) return <p className="text-error">{error}</p>

  return (
    <section className="portal-page">
      <header className="portal-page__header">
        <h1 className="display-title display-title--sm">Sản phẩm của tôi</h1>
        <p className="text-muted">Theo dõi trạng thái duyệt và chỉnh sửa sản phẩm bị từ chối.</p>
      </header>

      <div className="portal-actions">
        <Link to={ROUTES.SELLER_NEW_PRODUCT}>
          <Button>Đăng sản phẩm</Button>
        </Link>
      </div>

      {!products || products.length === 0 ? (
        <p className="portal-empty">Bạn chưa đăng sản phẩm nào.</p>
      ) : (
        <div className="portal-card portal-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <StatusBadge status={product.approvalStatus} />
                    {product.rejectionNote && (
                      <p className="text-muted" style={{ marginTop: '0.25rem', fontSize: '0.75rem' }}>
                        {product.rejectionNote}
                      </p>
                    )}
                  </td>
                  <td>
                    {product.approvalStatus === 'rejected' && (
                      <Link to={sellerEditProductPath(product.id)} className="auth-page__link">
                        Sửa & gửi lại
                      </Link>
                    )}
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

export default SellerProducts
