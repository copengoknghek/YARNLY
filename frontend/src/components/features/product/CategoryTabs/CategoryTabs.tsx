import { CATEGORY_TABS } from '@/constants/categories'
import type { ProductCategory } from '@/types/product'
import '@/styles/components/CategoryTabs.css'

interface CategoryTabsProps {
  value: ProductCategory | ''
  onChange: (value: ProductCategory | '') => void
}

function CategoryTabs({ value, onChange }: CategoryTabsProps) {
  return (
    <div className="category-tabs" role="tablist" aria-label="Danh mục sản phẩm">
      {CATEGORY_TABS.map((tab) => (
        <button
          key={tab.value || 'all'}
          type="button"
          role="tab"
          aria-selected={tab.value === value}
          className={`category-tabs__tab ${tab.value === value ? 'category-tabs__tab--active' : ''}`}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default CategoryTabs
