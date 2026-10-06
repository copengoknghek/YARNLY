import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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

  const pickers: { key: keyof SelectedOptions; labelKey: string; values?: string[] }[] = [
    { key: 'color', labelKey: 'productDetail.options.color', values: product.options?.colors },
    { key: 'size', labelKey: 'productDetail.options.size', values: product.options?.sizes },
    { key: 'leadTime', labelKey: 'productDetail.options.leadTime', values: product.options?.leadTimes },
  ]

  return (
    <div className="product-info">
      <h1 className="display-title product-info__name">{product.name}</h1>
      <div className="product-info__meta">
        <span className="product-info__price">{formatPrice(product.price)}</span>
        <span className="product-info__rating" aria-label={t('productDetail.rating', { rating: RATING })}>
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`yarn-ball ${i < RATING ? 'yarn-ball--filled' : ''}`} />
          ))}
        </span>
      </div>
      <p className="product-info__description">{product.description}</p>
      <p className="product-info__seller">{t('productDetail.seller', { name: product.sellerName })}</p>

      {pickers.map(
        ({ key, labelKey, values }) =>
          values &&
          values.length > 0 && (
            <OptionPicker
              key={key}
              label={t(labelKey)}
              options={values}
              value={options[key] ?? values[0]}
              onChange={(value) => setOptions((current) => ({ ...current, [key]: value }))}
            />
          ),
      )}

      <div className="product-info__quantity">
        <span className="product-info__label">{t('common.quantity')}</span>
        <QuantityInput
          size="lg"
          value={quantity}
          max={Math.max(1, product.stock)}
          onChange={setQuantity}
        />
      </div>

      {outOfStock ? (
        <p className="product-info__soldout">{t('productDetail.outOfStock')}</p>
      ) : (
        <div className="product-info__actions">
          <Button
            onClick={() => {
              addToCart()
              setAdded(true)
            }}
          >
            {t('productDetail.addToCart')}
          </Button>
          <Button
            onClick={() => {
              addToCart()
              navigate(ROUTES.CHECKOUT)
            }}
          >
            {t('productDetail.buyNow')}
          </Button>
        </div>
      )}

      {added && (
        <p className="product-info__added" role="status">
          {t('productDetail.addedToCart')} <Link to={ROUTES.CART}>{t('common.viewCart')}</Link>
        </p>
      )}
    </div>
  )
}

function ProductDetail() {
  const { t } = useTranslation()
  const { id = '' } = useParams()
  const fetchProduct = useCallback(() => getProductById(id), [id])
  const { data: product, loading, error } = useFetch(fetchProduct)

  return (
    <div className="product-detail">
      <div className="container page page--plain">
        <Breadcrumb
          items={[
            { label: t('common.breadcrumb.home'), to: ROUTES.HOME },
            { label: t('common.breadcrumb.products'), to: ROUTES.PRODUCTS },
            { label: product?.name ?? t('common.loadingEllipsis') },
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
