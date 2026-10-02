import { useCallback, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Breadcrumb from '@/components/common/Breadcrumb'
import Button from '@/components/common/Button'
import Loading from '@/components/common/Loading'
import QuantityInput from '@/components/common/QuantityInput'
import OptionPicker from '@/components/features/product/OptionPicker'
import ProductGallery from '@/components/features/product/ProductGallery'
import ProductTabs from '@/components/features/product/ProductTabs'
import RelatedProducts from '@/components/features/product/RelatedProducts'
import { ROUTES } from '@/constants/routes'
import { useCart } from '@/hooks/useCart'
import { useFetch } from '@/hooks/useFetch'
import { getProductById } from '@/services/productService'
import type { SelectedOptions } from '@/types/cart'
import type { Product } from '@/types/product'
import { formatPrice } from '@/utils/formatPrice'
import '@/styles/pages/buyer/ProductDetail.css'

const RATING = 4

const initialOptions = (product: Product): SelectedOptions => ({
  color: product.options?.colors?.[0],
  size: product.options?.sizes?.[0],
  leadTime: product.options?.leadTimes?.[0],
})

function ProductInfo({ product }: { product: Product }) {
  const { addItem } = useCart()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const [options, setOptions] = useState<SelectedOptions>(() => initialOptions(product))
  const [added, setAdded] = useState(false)
  const outOfStock = product.stock === 0

  const addToCart = () => {
    const { id, name, price, category, images } = product
    const selectedOptions = Object.values(options).some(Boolean) ? options : undefined
    addItem({ id, name, price, category, images }, quantity, { selectedOptions })
  }

  const pickers: { key: keyof SelectedOptions; label: string; values?: string[] }[] = [
    { key: 'color', label: 'Màu sắc', values: product.options?.colors },
    { key: 'size', label: 'Kích cỡ', values: product.options?.sizes },
    { key: 'leadTime', label: 'Thời gian làm', values: product.options?.leadTimes },
  ]

  return (
    <div className="product-info">
      <h1 className="display-title product-info__name">{product.name}</h1>
      <div className="product-info__meta">
        <span className="product-info__price">{formatPrice(product.price)}</span>
        <span className="product-info__rating" aria-label={`Đánh giá ${RATING} trên 5`}>
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`yarn-ball ${i < RATING ? 'yarn-ball--filled' : ''}`} />
          ))}
        </span>
      </div>
      <p className="product-info__description">{product.description}</p>

      {pickers.map(
        ({ key, label, values }) =>
          values &&
          values.length > 0 && (
            <OptionPicker
              key={key}
              label={label}
              options={values}
              value={options[key] ?? values[0]}
              onChange={(value) => setOptions((current) => ({ ...current, [key]: value }))}
            />
          ),
      )}

      <div className="product-info__quantity">
        <span className="product-info__label">Số lượng</span>
        <QuantityInput
          size="lg"
          value={quantity}
          max={Math.max(1, product.stock)}
          onChange={setQuantity}
        />
      </div>

      {outOfStock ? (
        <p className="product-info__soldout">Sản phẩm tạm hết hàng. Bạn có thể đặt làm theo yêu cầu ở trang Thiết kế riêng.</p>
      ) : (
        <div className="product-info__actions">
          <Button
            onClick={() => {
              addToCart()
              setAdded(true)
            }}
          >
            Bỏ giỏ hàng
          </Button>
          <Button
            onClick={() => {
              addToCart()
              navigate(ROUTES.CHECKOUT)
            }}
          >
            Mua ngay
          </Button>
        </div>
      )}

      {added && (
        <p className="product-info__added" role="status">
          Đã thêm vào giỏ hàng. <Link to={ROUTES.CART}>Xem giỏ hàng</Link>
        </p>
      )}
    </div>
  )
}

function ProductDetail() {
  const { id = '' } = useParams()
  const fetchProduct = useCallback(() => getProductById(id), [id])
  const { data: product, loading, error } = useFetch(fetchProduct)

  return (
    <div className="product-detail">
      <div className="container page page--plain">
        <Breadcrumb
          items={[
            { label: 'Trang chủ', to: ROUTES.HOME },
            { label: 'Sản phẩm', to: ROUTES.PRODUCTS },
            { label: product?.name ?? '...' },
          ]}
        />

        {loading && <Loading />}
        {error && <p className="text-error">{error}</p>}
        {product && (
          <>
            <div className="product-detail__main">
              <ProductGallery key={product.id} images={product.images} name={product.name} />
              <ProductInfo key={product.id} product={product} />
            </div>
            <ProductTabs key={`tabs-${product.id}`} details={product.details} />
          </>
        )}
      </div>

      <RelatedProducts excludeId={product?.id} />
    </div>
  )
}

export default ProductDetail
