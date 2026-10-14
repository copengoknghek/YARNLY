import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Breadcrumb from '@/components/common/Breadcrumb'
import Loading from '@/components/common/Loading'
import PageBanner from '@/components/common/PageBanner'
import DesignForm from '@/components/features/customDesign/DesignForm'
import DesignPreview from '@/components/features/customDesign/DesignPreview'
import RelatedProducts from '@/components/features/product/RelatedProducts'
import { ROUTES } from '@/constants/routes'
import { useCart } from '@/hooks/useCart'
import { useFetch } from '@/hooks/useFetch'
import { getCustomDesignOptions } from '@/services/customDesignService'
import type { CustomDesign as CustomDesignData, CustomDesignOptions } from '@/types/customDesign'
import { buildInitialDesign, calculateDesignPrice, findLabel } from '@/utils/customDesign'
import '@/styles/pages/buyer/CustomDesign.css'

const CUSTOM_PRODUCT_ID = 'custom-design'
const MAX_REFERENCE_BYTES = 5 * 1024 * 1024

function DesignWorkspace({ options }: { options: CustomDesignOptions }) {
  const { t } = useTranslation()
  const { addItem } = useCart()
  const navigate = useNavigate()
  const initialDesign = useMemo(() => buildInitialDesign(options), [options])
  const [design, setDesign] = useState<CustomDesignData | null>(initialDesign)
  const [referenceImageUrl, setReferenceImageUrl] = useState<string | undefined>()
  const [referenceImageError, setReferenceImageError] = useState('')
  useEffect(() => {
    setDesign(initialDesign)
  }, [initialDesign])

  useEffect(
    () => () => {
      if (referenceImageUrl) URL.revokeObjectURL(referenceImageUrl)
    },
    [referenceImageUrl],
  )

  const handleReferenceImageChange = (file: File | null) => {
    if (referenceImageUrl) {
      URL.revokeObjectURL(referenceImageUrl)
      setReferenceImageUrl(undefined)
    }
    setReferenceImageError('')
    if (!file) {
      setDesign((current) => (current ? { ...current, referenceImageName: undefined } : current))
      return
    }
    if (file.size > MAX_REFERENCE_BYTES) {
      setReferenceImageError(t('customDesign.referenceTooLarge'))
      return
    }
    setReferenceImageUrl(URL.createObjectURL(file))
    setDesign((current) => (current ? { ...current, referenceImageName: file.name } : current))
  }

  const handleAddToCart = () => {
    if (!design) return
    const base = options.baseProducts.find((option) => option.id === design.baseProduct)
    const cleaned: CustomDesignData = {
      ...design,
      text: design.text?.trim() || undefined,
      note: design.note?.trim() || undefined,
    }
    addItem(
      {
        id: CUSTOM_PRODUCT_ID,
        name: t('customDesign.cartNamePrefix', { product: findLabel(options.baseProducts, design.baseProduct) }),
        price,
        category: 'custom',
        images: base?.image ? [base.image] : [],
      },
      1,
      { customDesign: cleaned },
    )
    navigate(ROUTES.CART)
  }

  if (!design) {
    return <p className="custom-design__empty">{t('customDesign.noMakers')}</p>
  }

  const price = calculateDesignPrice(design, options)

  return (
    <div className="custom-design__workspace">
      <DesignForm
        design={design}
        options={options}
        onChange={(patch) => setDesign((current) => (current ? { ...current, ...patch } : current))}
        referenceImageUrl={referenceImageUrl}
        referenceImageError={referenceImageError}
        onReferenceImageChange={handleReferenceImageChange}
      />
      <DesignPreview
        design={design}
        options={options}
        price={price}
        referenceImageUrl={referenceImageUrl}
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}

function CustomDesign() {
  const { t } = useTranslation()
  const fetchOptions = useCallback(() => getCustomDesignOptions(), [])
  const { data: options, loading, error } = useFetch(fetchOptions)

  return (
    <div className="custom-design">
      <PageBanner title={t('customDesign.pageTitle')} />

      <div className="container page">
        <Breadcrumb
          items={[
            { label: t('common.breadcrumb.home'), to: ROUTES.HOME },
            { label: t('customDesign.breadcrumb') },
          ]}
        />
        {loading && <Loading />}
        {error && <p className="text-error">{error}</p>}
        {options && <DesignWorkspace options={options} />}
      </div>

      <RelatedProducts />
    </div>
  )
}

export default CustomDesign
