import { useCallback, useState } from 'react'
import StatCard from '@/components/features/portal/StatCard'
import Loading from '@/components/common/Loading'
import { ORDER_STATUS_LABELS_VI } from '@/constants/orderStatus'
import { useFetch } from '@/hooks/useFetch'
import { getAdminOrders } from '@/services/adminService'
import { formatDate } from '@/utils/formatDate'
import { formatPrice } from '@/utils/formatPrice'
import '@/styles/pages/portal/Portal.css'

function Orders() {
  const fetchOrders = useCallback(() => getAdminOrders(), [])
  const { data: orders, loading, error } = useFetch(fetchOrders)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedOrder = orders?.find((order) => order.id === selectedId) ?? null

  if (loading) return <Loading />
  if (error) return <p className="text-error">{error}</p>

  return (
    <section className="portal-page">
      <header className="portal-page__header">
        <h1 className="display-title display-title--sm">Quản lý đơn hàng</h1>
        <p className="text-muted">Xem tổng số đơn, người mua, người bán và chi tiết từng đơn.</p>
      </header>

      <div className="portal-stats">
        <StatCard label="Tổng đơn" value={orders?.length ?? 0} />
      </div>

      <div className="portal-card portal-table-wrap">
        <table className="portal-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Người mua</th>
              <th>Người bán</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Ngày</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr
                key={order.id}
                onClick={() => setSelectedId(order.id)}
                style={{ cursor: 'pointer' }}
              >
                <td>{order.code}</td>
                <td>
                  <div>{order.buyerName}</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>{order.buyerEmail}</div>
                </td>
                <td>{order.sellerName}</td>
                <td>{formatPrice(order.total)}</td>
                <td>{ORDER_STATUS_LABELS_VI[order.status]}</td>
                <td>{formatDate(order.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="portal-order-detail">
          <h2 className="portal-card__title">Chi tiết đơn {selectedOrder.code}</h2>
          <p>Người mua: {selectedOrder.buyerName} — {selectedOrder.buyerPhone}</p>
          <p>Người bán: {selectedOrder.sellerName}</p>
          {selectedOrder.items.map((item) => (
            <div key={`${item.productName}-${item.unitPrice}`} className="portal-order-detail__item">
              <span>{item.productName} × {item.quantity}</span>
              <span>{formatPrice(item.unitPrice * item.quantity)}</span>
            </div>
          ))}
          <strong>Tổng: {formatPrice(selectedOrder.total)}</strong>
        </div>
      )}
    </section>
  )
}

export default Orders
