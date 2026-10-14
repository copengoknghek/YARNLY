import { useCallback, useState, type FormEvent } from 'react'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Loading from '@/components/common/Loading'
import { useFetch } from '@/hooks/useFetch'
import {
  MAX_YARN_COLORS,
  createSellerYarnColor,
  deleteSellerYarnColor,
  getSellerYarnColors,
  updateSellerYarnColor,
} from '@/services/sellerService'
import { getErrorMessage } from '@/services/api'
import '@/styles/pages/portal/Portal.css'

function YarnColors() {
  const [refreshKey, setRefreshKey] = useState(0)
  const fetchColors = useCallback(() => getSellerYarnColors(), [refreshKey])
  const { data: colors, loading, error } = useFetch(fetchColors)
  const [stockDrafts, setStockDrafts] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [newColor, setNewColor] = useState({ name: '', hex: '#d99aa6', stock: '5' })
  const [submitting, setSubmitting] = useState(false)

  const refresh = () => setRefreshKey((value) => value + 1)

  const handleStockSave = async (id: string) => {
    const stock = Number(stockDrafts[id])
    if (!Number.isInteger(stock) || stock < 0) return
    await updateSellerYarnColor(id, { stock })
    refresh()
  }

  const handleDelete = async (id: string) => {
    await deleteSellerYarnColor(id)
    refresh()
  }

  const handleAdd = async (event: FormEvent) => {
    event.preventDefault()
    setFormError('')
    const stock = Number(newColor.stock)
    if (!newColor.name.trim()) {
      setFormError('Vui lòng nhập tên màu')
      return
    }
    if (!Number.isInteger(stock) || stock < 0) {
      setFormError('Tồn kho phải là số không âm')
      return
    }
    setSubmitting(true)
    try {
      await createSellerYarnColor({
        name: newColor.name.trim(),
        hex: newColor.hex,
        stock,
      })
      setNewColor({ name: '', hex: '#d99aa6', stock: '5' })
      refresh()
    } catch (err) {
      setFormError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loading />
  if (error) return <p className="text-error">{error}</p>

  const count = colors?.length ?? 0
  const canAdd = count < MAX_YARN_COLORS

  return (
    <section className="portal-page">
      <header className="portal-page__header">
        <h1 className="display-title display-title--sm">Bảng màu len</h1>
        <p className="text-muted">
          Quản lý tối đa {MAX_YARN_COLORS} màu cho đơn thiết kế riêng. Đang dùng {count}/{MAX_YARN_COLORS} màu.
        </p>
      </header>

      {!colors || colors.length === 0 ? (
        <p className="portal-empty">Chưa có màu len. Thêm màu để khách có thể chọn xưởng của bạn.</p>
      ) : (
        <div className="portal-card portal-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Tên màu</th>
                <th>Màu</th>
                <th>Tồn kho</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {colors.map((color) => (
                <tr key={color.id}>
                  <td>{color.name}</td>
                  <td>
                    <span
                      className="portal-yarn-swatch"
                      style={{ backgroundColor: color.hex }}
                      title={color.hex}
                    />
                    <span className="text-muted">{color.hex}</span>
                  </td>
                  <td>
                    <div className="portal-actions">
                      <Input
                        label="Tồn kho"
                        hideLabel
                        type="number"
                        min={0}
                        value={stockDrafts[color.id] ?? String(color.stock)}
                        onChange={(event) =>
                          setStockDrafts((current) => ({ ...current, [color.id]: event.target.value }))
                        }
                      />
                      <Button onClick={() => handleStockSave(color.id)}>Lưu</Button>
                    </div>
                  </td>
                  <td>
                    <Button variant="outline" onClick={() => handleDelete(color.id)}>Xóa</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {canAdd && (
        <form className="portal-card portal-form portal-form--inline" onSubmit={handleAdd}>
          <h2 className="portal-form__title">Thêm màu mới</h2>
          <Input
            label="Tên màu"
            value={newColor.name}
            onChange={(event) => setNewColor((current) => ({ ...current, name: event.target.value }))}
          />
          <label className="portal-form__color">
            Mã màu
            <input
              type="color"
              value={newColor.hex}
              onChange={(event) => setNewColor((current) => ({ ...current, hex: event.target.value }))}
            />
          </label>
          <Input
            label="Tồn kho"
            type="number"
            min={0}
            value={newColor.stock}
            onChange={(event) => setNewColor((current) => ({ ...current, stock: event.target.value }))}
          />
          {formError && <p className="text-error">{formError}</p>}
          <Button type="submit" disabled={submitting}>{submitting ? 'Đang lưu...' : 'Thêm màu'}</Button>
        </form>
      )}
    </section>
  )
}

export default YarnColors
