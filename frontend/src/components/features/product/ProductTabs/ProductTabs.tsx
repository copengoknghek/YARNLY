import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ProductDetails } from '@/types/product'
import '@/styles/components/ProductTabs.css'

const TAB_KEYS: { key: keyof ProductDetails; labelKey: string }[] = [
  { key: 'material', labelKey: 'productDetail.tabs.material' },
  { key: 'care', labelKey: 'productDetail.tabs.care' },
  { key: 'shipping', labelKey: 'productDetail.tabs.shipping' },
]

function ProductTabs({ details }: { details: ProductDetails }) {
  const { t } = useTranslation()
  const [active, setActive] = useState<keyof ProductDetails>('material')
  const baseId = useId()

  return (
    <section className="product-tabs">
      <div className="product-tabs__list" role="tablist">
        {TAB_KEYS.map((tab) => (
          <button
            key={tab.key}
            id={`${baseId}-${tab.key}`}
            type="button"
            role="tab"
            aria-selected={tab.key === active}
            aria-controls={`${baseId}-panel`}
            className={`product-tabs__tab ${tab.key === active ? 'product-tabs__tab--active' : ''}`}
            onClick={() => setActive(tab.key)}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>
      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-${active}`}
        className="product-tabs__panel"
      >
        {details[active]}
      </div>
    </section>
  )
}

export default ProductTabs
