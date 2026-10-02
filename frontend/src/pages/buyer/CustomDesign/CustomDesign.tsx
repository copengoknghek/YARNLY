import { useCallback, useState } from 'react'
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
import { calculateDesignPrice, findLabel } from '@/utils/customDesign'
import '@/styles/pages/buyer/CustomDesign.css'

const CUSTOM_PRODUCT_ID = 'custom-design'

const INITIAL_DESIGN: CustomDesignData = {
  baseProduct: 'doll',
  style: 'chibi',
  accessory: 'bow',
  mainColor: '#d99aa6',
  accentColor: '#ffe373',
}

function DesignWorkspace({ options }: { options: CustomDesignOptions }) {
  const { addItem } = useCart()
  const navigate = useNavigate()
  const [design, setDesign] = useState<CustomDesignData>(INITIAL_DESIGN)
  const price = calculateDesignPrice(design, options)

  const handleAddToCart = () => {
    const base = options.baseProducts.find((option) => option.id === design.baseProduct)
    const cleaned: CustomDesignData = {
      ...design,
      text: design.text?.trim() || undefined,
      note: design.note?.trim() || undefined,
    }
    addItem(
      {
        id: CUSTOM_PRODUCT_ID,
        name: `Thiết kế riêng: ${findLabel(options.baseProducts, design.baseProduct)}`,
        price,
        category: 'custom',
        images: base?.image ? [base.image] : [],
      },
      1,
      { customDesign: cleaned },
    )
    navigate(ROUTES.CART)
  }

  return (
    <div className="custom-design__workspace">
      <DesignForm
        design={design}
        options={options}
        onChange={(patch) => setDesign((current) => ({ ...current, ...patch }))}
      />
      <DesignPreview design={design} options={options} price={price} onAddToCart={handleAddToCart} />
    </div>
  )
}

function CustomDesign() {
  const fetchOptions = useCallback(() => getCustomDesignOptions(), [])
  const { data: options, loading, error } = useFetch(fetchOptions)

  return (
    <div className="custom-design">
      <PageBanner title="Tự tạo mẫu của riêng bạn" />

      <div className="container page">
        <Breadcrumb items={[{ label: 'Trang chủ', to: ROUTES.HOME }, { label: 'Thiết kế riêng' }]} />
        {loading && <Loading />}
        {error && <p className="text-error">{error}</p>}
        {options && <DesignWorkspace options={options} />}
      </div>

      <RelatedProducts />
    </div>
  )
}

export default CustomDesign
