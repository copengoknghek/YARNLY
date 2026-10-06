import { useTranslation } from 'react-i18next'
import { CATEGORY_TABS } from '@/constants/categories'
import type { ProductCategory } from '@/types/product'
import '@/styles/components/CategoryTabs.css'

interface CategoryTabsProps {
  value: ProductCategory | ''
  onChange: (value: ProductCategory | '') => void
}

function CategoryTabs({ value, onChange }: CategoryTabsProps) {
  const { t } = useTranslation()

  return (
    <div className="category-tabs" role="tablist" aria-label={t('products.categoryTabsLabel')}>
      {CATEGORY_TABS.map((tab) => (
        <button
          key={tab.value || 'all'}
          type="button"
          role="tab"
          aria-selected={tab.value === value}
          className={`category-tabs__tab ${tab.value === value ? 'category-tabs__tab--active' : ''}`}
          onClick={() => onChange(tab.value)}
        >
          {t(tab.labelKey)}
        </button>
      ))}
    </div>
  )
}

export default CategoryTabs
