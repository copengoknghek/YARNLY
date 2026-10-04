import { useCallback, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import ProductForm from '@/components/features/portal/ProductForm'
import Loading from '@/components/common/Loading'
import { ROUTES } from '@/constants/routes'
import { getErrorMessage } from '@/services/api'
import { getSellerProducts, updateSellerProduct } from '@/services/sellerService'
import { useFetch } from '@/hooks/useFetch'
import '@/styles/pages/portal/Portal.css'

function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const fetchProduct = useCallback(async () => {
    const products = await getSellerProducts()
    const product = products.find((item) => item.id === id)
    if (!product) throw new Error('Không tìm thấy sản phẩm')
    return product
  }, [id])
  const { data: product, loading, error: fetchError } = useFetch(fetchProduct)

  if (!id) return null
  if (loading) return <Loading />
  if (fetchError) return <p className="text-error">{fetchError}</p>
  if (!product) return <Navigate to={ROUTES.SELLER_PRODUCTS} replace />
  if (product.approvalStatus !== 'rejected') return <Navigate to={ROUTES.SELLER_PRODUCTS} replace />

  return (
    <section className="portal-page">
      <header className="portal-page__header">
        <h1 className="display-title display-title--sm">Sửa sản phẩm</h1>
        <p className="text-muted">Cập nhật thông tin và gửi lại để admin duyệt.</p>
      </header>
      {error && <p className="text-error">{error}</p>}
      <ProductForm
        initial={product}
        submitLabel="Gửi duyệt lại"
        onSubmit={async (input) => {
          try {
            await updateSellerProduct(id, input)
            navigate(ROUTES.SELLER_PRODUCTS)
          } catch (err) {
            setError(getErrorMessage(err))
          }
        }}
      />
    </section>
  )
}

export default EditProduct
