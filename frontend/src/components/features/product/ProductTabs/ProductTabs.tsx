import { useId, useState } from 'react'
import type { ProductDetails } from '@/types/product'
import '@/styles/components/ProductTabs.css'

const TABS: { key: keyof ProductDetails; label: string }[] = [
  { key: 'material', label: 'Chất liệu' },
  { key: 'care', label: 'Cách bảo quản' },
  { key: 'shipping', label: 'Vận chuyển' },
]

function ProductTabs({ details }: { details: ProductDetails }) {
  const [active, setActive] = useState<keyof ProductDetails>('material')
  const baseId = useId()

  return (
    <section className="product-tabs">
      <div className="product-tabs__list" role="tablist">
        {TABS.map((tab) => (
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
            {tab.label}
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
