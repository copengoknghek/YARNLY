import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductForm from '@/components/features/portal/ProductForm'
import { ROUTES } from '@/constants/routes'
import { getErrorMessage } from '@/services/api'
import { createSellerProduct } from '@/services/sellerService'
import '@/styles/pages/portal/Portal.css'

function NewProduct() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  return (
    <section className="portal-page">
      <header className="portal-page__header">
        <h1 className="display-title display-title--sm">Đăng sản phẩm</h1>
        <p className="text-muted">Sản phẩm sẽ ở trạng thái chờ duyệt trước khi hiển thị trên cửa hàng.</p>
      </header>
      {error && <p className="text-error">{error}</p>}
      <ProductForm
        submitLabel="Gửi duyệt"
        onSubmit={async (input) => {
          try {
            await createSellerProduct(input)
            navigate(ROUTES.SELLER_PRODUCTS)
          } catch (err) {
            setError(getErrorMessage(err))
          }
        }}
      />
    </section>
  )
}

export default NewProduct
