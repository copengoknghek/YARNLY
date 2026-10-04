import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { CATEGORY_LABELS } from '@/constants/categories'
import { ROUTES } from '@/constants/routes'
import type { ProductCategory } from '@/types/product'
import type { SellerProduct, SellerProductInput } from '@/types/portal'

const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).filter(([key]) => key !== 'custom') as [
  ProductCategory,
  string,
][]

interface ProductFormProps {
  initial?: SellerProduct
  onSubmit: (input: SellerProductInput) => void
  submitLabel: string
}

interface FormState {
  name: string
  description: string
  price: string
  category: ProductCategory | ''
  stock: string
  imageUrl: string
}

const toFormState = (product?: SellerProduct): FormState => ({
  name: product?.name ?? '',
  description: product?.description ?? '',
  price: product ? String(product.price) : '',
  category: product?.category ?? '',
  stock: product ? String(product.stock) : '',
  imageUrl: product?.images[0] ?? '',
})

function ProductForm({ initial, onSubmit, submitLabel }: ProductFormProps) {
  const [values, setValues] = useState<FormState>(() => toFormState(initial))
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const price = Number(values.price)
    const stock = Number(values.stock)
    if (!values.name.trim()) return setError('Vui lòng nhập tên sản phẩm.')
    if (!values.description.trim()) return setError('Vui lòng nhập mô tả sản phẩm.')
    if (!values.category) return setError('Vui lòng chọn danh mục.')
    if (!Number.isFinite(price) || price <= 0) return setError('Giá sản phẩm không hợp lệ.')
    if (!Number.isInteger(stock) || stock < 0) return setError('Số lượng tồn kho không hợp lệ.')
    setError('')
    onSubmit({
      name: values.name,
      description: values.description,
      price,
      category: values.category,
      stock,
      imageUrl: values.imageUrl,
    })
  }

  return (
    <form className="portal-form portal-card" onSubmit={handleSubmit}>
      <Input
        label="Tên sản phẩm"
        value={values.name}
        onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
      />
      <div className="portal-form__field">
        <label htmlFor="product-description">Mô tả</label>
        <textarea
          id="product-description"
          value={values.description}
          onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))}
        />
      </div>
      <Input
        label="Giá (VNĐ)"
        type="number"
        min={1000}
        value={values.price}
        onChange={(event) => setValues((current) => ({ ...current, price: event.target.value }))}
      />
      <div className="portal-form__field">
        <label htmlFor="product-category">Danh mục</label>
        <select
          id="product-category"
          value={values.category}
          onChange={(event) =>
            setValues((current) => ({ ...current, category: event.target.value as ProductCategory }))
          }
        >
          <option value="">Chọn danh mục</option>
          {CATEGORY_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <Input
        label="Tồn kho"
        type="number"
        min={0}
        value={values.stock}
        onChange={(event) => setValues((current) => ({ ...current, stock: event.target.value }))}
      />
      <Input
        label="URL ảnh (tùy chọn)"
        value={values.imageUrl}
        onChange={(event) => setValues((current) => ({ ...current, imageUrl: event.target.value }))}
      />
      {error && <p className="text-error">{error}</p>}
      <div className="portal-actions">
        <Button type="submit">{submitLabel}</Button>
        <Link to={ROUTES.SELLER_PRODUCTS} className="auth-page__link">Hủy</Link>
      </div>
    </form>
  )
}

export default ProductForm
