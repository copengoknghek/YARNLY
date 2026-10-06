import { useCallback, useState } from 'react'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Loading from '@/components/common/Loading'
import StatusBadge from '@/components/features/portal/StatusBadge'
import { useFetch } from '@/hooks/useFetch'
import { getSellerProducts, updateSellerStock } from '@/services/sellerService'
import '@/styles/pages/portal/Portal.css'

function Inventory() {
  const [refreshKey, setRefreshKey] = useState(0)
  const fetchProducts = useCallback(() => getSellerProducts(), [refreshKey])
  const { data: products, loading, error } = useFetch(fetchProducts)
  const [drafts, setDrafts] = useState<Record<string, string>>({})

  const handleSave = async (productId: string) => {
    const stock = Number(drafts[productId])
    if (!Number.isInteger(stock) || stock < 0) return
    await updateSellerStock(productId, stock)
    setRefreshKey((value) => value + 1)
  }

  if (loading) return <Loading />
  if (error) return <p className="text-error">{error}</p>

  return (
    <section className="portal-page">
      <header className="portal-page__header">
        <h1 className="display-title display-title--sm">Quản lý kho</h1>
        <p className="text-muted">Cập nhật số lượng tồn kho cho sản phẩm của bạn.</p>
      </header>

      {!products || products.length === 0 ? (
        <p className="portal-empty">Chưa có sản phẩm để quản lý kho.</p>
      ) : (
        <div className="portal-card portal-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Trạng thái</th>
                <th>Tồn kho hiện tại</th>
                <th>Cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td><StatusBadge status={product.approvalStatus} /></td>
                  <td>{product.stock}</td>
                  <td>
                    <div className="portal-actions">
                      <Input
                        label="Số lượng mới"
                        hideLabel
                        type="number"
                        min={0}
                        value={drafts[product.id] ?? String(product.stock)}
                        onChange={(event) =>
                          setDrafts((current) => ({ ...current, [product.id]: event.target.value }))
                        }
                      />
                      <Button onClick={() => handleSave(product.id)}>Lưu</Button>
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

export default Inventory
